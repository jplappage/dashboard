#!/usr/bin/env python3
"""
Auto-update VOD/streaming dates in films-data.js from WhenToStream.

Runs server-side on a schedule (see .github/workflows/update-vod-dates.yml),
so film release dates stay current even when the laptop is off. It ONLY
touches VOD dates for films already in the FILMS array — it never adds new
films or archives watched ones (those need a logged-in Letterboxd session,
which a cloud job doesn't have).

Behaviour, deliberately conservative:
  * For each film with a slug, fetch its WhenToStream page and read the
    confirmed PVOD / VOD / Digital Release Date field (NOT the later SVOD date).
  * A confirmed date within 3 months  -> set vodDate + estimated:false, drop note.
    A confirmed date more than 3 months out -> keep estimated:true with a note
    (matches the manual "3-month reliability" rule).
  * If WhenToStream shows no confirmed date, the film is left EXACTLY as-is
    (so a manually-set date is never downgraded).
  * If WhenToStream shows a DIFFERENT confirmed date than we hold, we adopt it
    (this is what catches delays like Robin Hood 21 Jul -> 4 Aug).

Never guesses. Only acts on a specific "Month DD, YYYY" date in the confirmed
field. Writes films-data.js only if something actually changed, and the caller
(the workflow) validates the file with `node --check` before committing.
"""

import re
import sys
import os
import json
import urllib.request
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# FILMS_DATA_FILE / WTS_FIXTURES env vars exist only for testing; the Action uses defaults.
DATA_FILE = os.environ.get('FILMS_DATA_FILE', os.path.join(SCRIPT_DIR, 'films-data.js'))
FIXTURE_DIR = os.environ.get('WTS_FIXTURES')
# Summary is written fresh each run to a throwaway path (the workflow points this
# at the runner temp dir) — it must never be a committed file, or a stale copy
# gets read on later runs. Only written when a real change happens.
SUMMARY_FILE = os.environ.get('VOD_SUMMARY_FILE', os.path.join(SCRIPT_DIR, '.vod-update-summary.txt'))


OMDB_KEY = os.environ.get('OMDB_API_KEY', '').strip()


def uk(iso):
    """'2026-08-04' -> '4 Aug 2026'."""
    try:
        return datetime.strptime(iso, '%Y-%m-%d').strftime('%-d %b %Y')
    except (ValueError, TypeError):
        return iso


def omdb_rating(title, year):
    """IMDb rating for a released film via OMDb, or None. (OMDb only has a rating
    once a film is out, so this naturally fills only on release.)"""
    if not OMDB_KEY:
        return None
    import urllib.parse
    url = ('https://www.omdbapi.com/?apikey=%s&t=%s&y=%s&type=movie'
           % (OMDB_KEY, urllib.parse.quote(title), year))
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            d = json.loads(r.read().decode('utf-8', 'ignore'))
        rv = d.get('imdbRating')
        if rv and rv != 'N/A':
            return float(rv)
    except Exception as e:
        print('    omdb failed:', e)
    return None


def fill_ratings(text):
    """Add imdbRating to any FILMS entry missing one that OMDb now has a rating for.
    Returns (new_text, filled_titles). These are persisted but not push-notified."""
    if not OMDB_KEY:
        return text, []
    watched_at = text.find('const WATCHED')
    region = text if watched_at < 0 else text[:watched_at]
    todo = []
    for m in re.finditer(r'\{[^{}]*\}', region):
        block = m.group(0)
        if get_field(block, 'imdbRating') is not None:
            continue
        title = get_field(block, 'title')
        ym = re.search(r'year:\s*(\d{4})', block)
        if title and ym:
            todo.append((block, title, ym.group(1)))
    filled = []
    for block, title, year in todo:
        r = omdb_rating(title, year)
        if r is not None:
            nb = set_or_replace(block, 'imdbRating', '%.1f' % r)
            text = text.replace(block, nb, 1)
            filled.append('%s (%.1f)' % (title, r))
            print('  rating filled: %s -> %.1f' % (title, r))
    return text, filled

THREE_MONTHS = timedelta(days=92)
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126.0 Safari/537.36')


# ── Fetch ─────────────────────────────────────────────────────────────────────

def fetch(url):
    """GET a URL, returning HTML text or None on any failure."""
    if FIXTURE_DIR:  # test mode: read canned HTML from a local file named after the slug
        slug = re.sub(r'https?://whentostream\.com/|/$', '', url)
        path = os.path.join(FIXTURE_DIR, slug + '.html')
        if os.path.exists(path):
            with open(path) as fh:
                return fh.read()
        return None
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            if r.status != 200:
                return None
            return r.read().decode('utf-8', 'ignore')
    except Exception as e:
        print(f'    fetch failed: {e}')
        return None


def wts_candidates(slug, year):
    """WhenToStream URL patterns: slug is a Letterboxd slug; WTS usually adds -year."""
    urls = []
    if re.search(r'-\d{4}$', slug):
        urls.append(f'https://whentostream.com/{slug}/')
    else:
        urls.append(f'https://whentostream.com/{slug}-{year}/')
        urls.append(f'https://whentostream.com/{slug}/')
    return urls


def find_confirmed_date(html):
    """Return a datetime for the confirmed first-window digital date, or None.

    Looks at PVOD / VOD / Digital Release Date fields (never SVOD, which is the
    later free-streaming date). Only a specific 'Month DD, YYYY' counts.
    """
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text)
    # Remove the SVOD (free-streaming, later-window) field entirely first, so its
    # date can never be picked up and its "...VOD Release Date" tail can't match.
    text = re.sub(r'SVOD Release Date\s*:?\s*[A-Za-z0-9,]+(?:\s+[A-Za-z0-9,]+){0,2}', ' ', text)
    # e.g. "PVOD Release Date : July 21, 2026"  /  "VOD Release Date : August 4, 2026"
    for label in ('PVOD Release Date', 'VOD/Digital Release Date',
                  'VOD Release Date', 'Digital Release Date'):
        m = re.search(re.escape(label) + r'\s*:?\s*([A-Z][a-z]+ \d{1,2},\s*\d{4})', text)
        if m:
            raw = re.sub(r'\s+', ' ', m.group(1)).strip()
            try:
                return datetime.strptime(raw, '%B %d, %Y')
            except ValueError:
                continue
    return None


# ── films-data.js editing ─────────────────────────────────────────────────────

def get_field(block, field):
    m = re.search(rf"{field}:\s*'([^']*)'", block)
    if m:
        return m.group(1)
    m = re.search(rf'{field}:\s*"([^"]*)"', block)
    if m:
        return m.group(1)
    if re.search(rf'{field}:\s*null', block):
        return None
    m = re.search(rf'{field}:\s*(true|false)', block)
    if m:
        return m.group(1) == 'true'
    return None


def set_or_replace(block, field, value_literal):
    """Set field to value_literal (a JS literal string). Adds it after `slug` if missing."""
    if re.search(rf'\b{field}:', block):
        return re.sub(rf'({field}:\s*)(null|true|false|\'[^\']*\'|"[^"]*")',
                      lambda m: m.group(1) + value_literal, block, count=1)
    # insert a new line after the slug line, matching its indentation
    m = re.search(r'\n(\s*)slug:[^\n]*\n', block)
    indent = m.group(1) if m else '    '
    return re.sub(r'(\n\s*slug:[^\n]*\n)',
                  lambda mm: mm.group(1) + f'{indent}{field}: {value_literal},\n',
                  block, count=1)


def remove_field(block, field):
    return re.sub(rf'\n\s*{field}:\s*(?:null|true|false|\'[^\']*\'|"[^"]*")\s*,', '', block, count=1)


def build_new_block(block, confirmed_dt, today):
    """Given a film block and a confirmed datetime, return (new_block, summary) or (block, None)."""
    iso = confirmed_dt.strftime('%Y-%m-%d')
    within_3mo = confirmed_dt <= today + THREE_MONTHS

    cur_vod = get_field(block, 'vodDate')
    cur_est = get_field(block, 'estimated')
    platform = get_field(block, 'platform')

    if within_3mo:
        # firm date
        if cur_vod == iso and cur_est is False:
            return block, None  # already correct
        nb = set_or_replace(block, 'vodDate', f"'{iso}'")
        nb = set_or_replace(nb, 'estimated', 'false')
        if platform is None:
            nb = set_or_replace(nb, 'platform', "'Digital'")
        nb = remove_field(nb, 'note')
        summary = (f'now streaming {uk(iso)}' if not cur_vod
                   else f'moved to {uk(iso)} (was {uk(cur_vod)})')
        return nb, summary
    else:
        # confirmed but >3 months out: keep as estimate with a note, no firm vodDate
        note = f'Digital {confirmed_dt.strftime("%-d %b %Y")} (confirmed, >3mo out)'
        if cur_vod is None and cur_est is True and get_field(block, 'note') == note:
            return block, None
        nb = set_or_replace(block, 'vodDate', 'null')
        nb = set_or_replace(nb, 'estimated', 'true')
        nb = set_or_replace(nb, 'note', f"'{note}'")
        return nb, f'{uk(iso)} confirmed (>3 months out, still tentative)'


def main():
    # Never let a stale summary survive into this run.
    if os.path.exists(SUMMARY_FILE):
        os.remove(SUMMARY_FILE)

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        text = f.read()

    # Restrict edits to the FILMS array (never touch WATCHED).
    watched_at = text.find('const WATCHED')
    films_region = text if watched_at < 0 else text[:watched_at]

    today = datetime.now()
    changes = []
    new_text = text

    for m in re.finditer(r'\{[^{}]*\}', films_region):
        block = m.group(0)
        slug = get_field(block, 'slug')
        year_m = re.search(r'year:\s*(\d{4})', block)
        if not slug or not year_m:
            continue
        year = year_m.group(1)
        title = get_field(block, 'title') or slug
        print(f'  {title} ({slug})')

        html = None
        for url in wts_candidates(slug, year):
            html = fetch(url)
            if html:
                break
        if not html:
            print('    no WhenToStream page reachable, skipping')
            continue

        dt = find_confirmed_date(html)
        if not dt:
            print('    no confirmed date on WhenToStream, leaving as-is')
            continue

        nb, summary = build_new_block(block, dt, today)
        if summary:
            new_text = new_text.replace(block, nb, 1)
            changes.append(f'{title}: {summary}')
            print(f'    -> {summary}')
        else:
            print('    already up to date')

    # Fill IMDb ratings for any newly-released films (persisted, not notified).
    new_text, filled = fill_ratings(new_text)

    if not changes and not filled:
        print('\nNo changes.')
        return 0

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(new_text)
    if changes:
        print('\nDate changes:')
        for c in changes:
            print(' -', c)
        # Only date changes go in the summary (that's what gets push-notified).
        with open(SUMMARY_FILE, 'w') as f:
            f.write('\n'.join(changes))
    if filled:
        print('\nRatings filled:', ', '.join(filled))
    return 0


if __name__ == '__main__':
    sys.exit(main())
