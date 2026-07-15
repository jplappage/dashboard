#!/usr/bin/env python3
"""
Auto-add films you've added to your (public) Letterboxd watchlist into films-data.js,
enriched via TMDB (poster + year). New entries go in with no date/rating yet — the
WhenToStream job fills the streaming date and the OMDb job fills the IMDb rating on
their next runs. It only ADDS; archiving watched films stays a manual-refresh job.

EXPERIMENTAL: depends on GitHub's runners being able to read letterboxd.com. If the
watchlist can't be fetched (bot-blocked / empty), it does nothing and changes nothing.

Needs TMDB_API_KEY. Writes films-data.js only if a genuinely new film is found.
"""

import re
import os
import json
import urllib.request
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FILMS_FILE = os.path.join(SCRIPT_DIR, 'films-data.js')
SUMMARY_FILE = os.environ.get('NEWFILM_SUMMARY_FILE', os.path.join(SCRIPT_DIR, '.newfilm-summary.txt'))
TMDB_KEY = os.environ.get('TMDB_API_KEY', '').strip()
LB_USER = os.environ.get('LETTERBOXD_USER', 'zidanejp')
FIXTURE_DIR = os.environ.get('NEWFILM_FIXTURES')  # test only
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'


def fetch_text(url):
    if FIXTURE_DIR:
        p = os.path.join(FIXTURE_DIR, re.sub(r'[^a-z0-9]+', '_', url.lower()).strip('_') + '.html')
        return open(p).read() if os.path.exists(p) else ''
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.read().decode('utf-8', 'ignore')
    except Exception as e:
        print('  fetch failed:', e)
        return ''


def fetch_json(url):
    if FIXTURE_DIR:
        p = os.path.join(FIXTURE_DIR, re.sub(r'[^a-z0-9]+', '_', url.split('api_key=')[0].lower()).strip('_') + '.json')
        return json.load(open(p)) if os.path.exists(p) else {}
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read().decode('utf-8', 'ignore'))
    except Exception as e:
        print('  tmdb failed:', e)
        return {}


def watchlist_slugs():
    """{slug: name} from the public Letterboxd watchlist (first pages)."""
    out = {}
    for page in range(1, 9):
        url = ('https://letterboxd.com/%s/watchlist/' % LB_USER if page == 1
               else 'https://letterboxd.com/%s/watchlist/page/%d/' % (LB_USER, page))
        html = fetch_text(url)
        if not html or 'data-item-slug' not in html:
            break
        for m in re.finditer(r'data-item-slug="([^"]+)"[^>]*?data-item-name="([^"]+)"', html):
            out[m.group(1)] = m.group(2)
        for m in re.finditer(r'data-item-name="([^"]+)"[^>]*?data-item-slug="([^"]+)"', html):
            out[m.group(2)] = m.group(1)
        if 'paginate-next' not in html:
            break
    return out


def existing_slugs(text):
    return set(re.findall(r"slug:\s*'([^']*)'", text))


def tmdb_lookup(name):
    """Return (poster_url, year) for a film name via TMDB, or (None, None)."""
    if not TMDB_KEY:
        return None, None
    # name like "The Odyssey (2026)"
    ym = re.search(r'\((\d{4})\)\s*$', name)
    year = ym.group(1) if ym else ''
    title = re.sub(r'\s*\(\d{4}\)\s*$', '', name)
    url = ('https://api.themoviedb.org/3/search/movie?api_key=%s&query=%s%s'
           % (TMDB_KEY, urllib.parse.quote(title), '&year=' + year if year else ''))
    res = (fetch_json(url).get('results') or [])
    if not res:
        return None, year or None
    r = res[0]
    poster = ('https://image.tmdb.org/t/p/w342' + r['poster_path']) if r.get('poster_path') else None
    yr = (r.get('release_date') or '')[:4] or year
    return poster, (yr or None)


def build_entry(slug, name, poster, year):
    title = re.sub(r'\s*\(\d{4}\)\s*$', '', name).replace("'", "\\'")
    y = year or 'null'
    lines = [
        '  {',
        "    title: '%s'," % title,
        '    year: %s,' % y,
        "    slug: '%s'," % slug,
    ]
    if poster:
        lines.append("    poster: '%s'," % poster)
    lines += [
        '    vodDate: null,',
        '    platform: null,',
        '    estimated: true,',
        "    note: 'Auto-added from Letterboxd — awaiting a streaming date',",
        '  },',
    ]
    return '\n'.join(lines) + '\n'


def main():
    if os.path.exists(SUMMARY_FILE):
        os.remove(SUMMARY_FILE)
    if not TMDB_KEY:
        print('TMDB_API_KEY not set — skipping.')
        return 0

    with open(FILMS_FILE, encoding='utf-8') as f:
        text = f.read()

    wl = watchlist_slugs()
    if not wl:
        print('No watchlist slugs fetched (blocked or empty) — nothing to do.')
        return 0
    have = existing_slugs(text)
    new = [(s, n) for s, n in wl.items() if s not in have]
    if not new:
        print('No new films on the watchlist.')
        return 0

    # Insert before the closing "];" of the FILMS array.
    m = re.search(r'(const FILMS = \[.*?)(\n\];)', text, re.S)
    if not m:
        print('Could not locate FILMS array.')
        return 0

    added = []
    insert = ''
    for slug, name in new:
        poster, year = tmdb_lookup(name)
        insert += build_entry(slug, name, poster, year)
        clean = re.sub(r'\s*\(\d{4}\)\s*$', '', name)
        added.append(clean)
        print('  + %s (%s)' % (clean, slug))

    text = text[:m.end(1)] + '\n' + insert + text[m.end(1):]

    with open(FILMS_FILE, 'w', encoding='utf-8') as f:
        f.write(text)
    with open(SUMMARY_FILE, 'w') as f:
        f.write('\n'.join('Added to watchlist: %s' % a for a in added))
    print('\nAdded %d film(s).' % len(added))
    return 0


if __name__ == '__main__':
    main()
