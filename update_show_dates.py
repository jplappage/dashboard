#!/usr/bin/env python3
"""
Auto-update ONGOING show season-premiere dates in shows-data.js from TVmaze.

Sibling to update_vod_dates.py, but for TV. Runs server-side on a schedule so a
newly-announced season premiere lands on the show log — and pings your phone —
even when the laptop is off. Uses TVmaze (announced air dates as clean JSON;
same source as the poster/IMDb data), NOT WhenToStream, which only tracks films.

Scope, deliberately narrow and safe:
  * Only ONGOING shows whose `next` is still vague (no confirmed day+month+year).
  * Asks TVmaze for the next scheduled episode; if it is episode 1 of the very
    next season (season == aired + 1) and has a real air date, that's a confirmed
    premiere. Sets `next` to "S<N> · <D Mon YYYY>" and drops any `recheck`.
  * Never touches shows that already have a confirmed date, finished/cancelled
    shows, or the `aired` count and airing-window fields (those stay manual).
  * Stores the real date even if >3 months out — the show-log page keeps it under
    "Awaiting Date" until it's within range (matches the manual 3-month rule).

Only announces what TVmaze has actually scheduled — it can't invent a date for an
unrenewed/unannounced season. Writes shows-data.js only if something changed.
"""

import re
import os
import sys
import json
import time
import urllib.request
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.environ.get('SHOWS_DATA_FILE', os.path.join(SCRIPT_DIR, 'shows-data.js'))
# Summary is written fresh to a throwaway path (workflow points it at runner temp).
SUMMARY_FILE = os.environ.get('SHOW_SUMMARY_FILE', os.path.join(SCRIPT_DIR, '.show-update-summary.txt'))
FIXTURE_DIR = os.environ.get('TVMAZE_FIXTURES')  # test only

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126.0 Safari/537.36')

# A confirmed next looks like "S3 · 14 Sep 2026" (full day + mon + year).
CONFIRMED_RE = re.compile(r'S\d+\s*·\s*\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4}')


def uk(iso):
    """'2026-09-15' -> '15 Sep 2026'."""
    return datetime.strptime(iso, '%Y-%m-%d').strftime('%-d %b %Y')


# ── TVmaze ────────────────────────────────────────────────────────────────────

def fetch_json(url):
    if FIXTURE_DIR:  # test mode: canned JSON keyed by a slug in the URL
        key = url.split('tvmaze.com/')[-1].replace('/', '_').replace('?', '_').replace('=', '_')
        path = os.path.join(FIXTURE_DIR, key + '.json')
        if os.path.exists(path):
            with open(path) as fh:
                return json.load(fh)
        return None
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            if r.status != 200:
                return None
            return json.loads(r.read().decode('utf-8', 'ignore'))
    except Exception as e:
        print('    tvmaze fetch failed:', e)
        return None


def next_premiere(imdb, aired):
    """Return (season, 'YYYY-MM-DD') for a confirmed premiere of season aired+1, else None."""
    show = fetch_json('https://api.tvmaze.com/lookup/shows?imdb=' + imdb)
    if not show or 'id' not in show:
        return None
    time.sleep(0.4)  # stay under TVmaze's rate limit
    data = fetch_json('https://api.tvmaze.com/shows/%s?embed=nextepisode' % show['id'])
    ne = ((data or {}).get('_embedded') or {}).get('nextepisode')
    if not ne:
        return None
    airdate = ne.get('airdate')
    season = ne.get('season')
    number = ne.get('number')
    # Must be episode 1 of the very next season, with a real air date.
    if not airdate or season != aired + 1 or number != 1:
        return None
    return season, airdate


# ── shows-data.js editing ─────────────────────────────────────────────────────

def field(line, name):
    m = re.search(name + r':\s*"([^"]*)"', line)
    if m:
        return m.group(1)
    if re.search(name + r':\s*null', line):
        return None
    m = re.search(name + r':\s*(\d+)', line)
    return int(m.group(1)) if m else None


def set_next(line, value):
    if re.search(r'next:\s*(?:"[^"]*"|null)', line):
        return re.sub(r'next:\s*(?:"[^"]*"|null)', 'next:"%s"' % value, line, count=1)
    return line


def drop_recheck(line):
    return re.sub(r',\s*recheck:\s*"[^"]*"', '', line, count=1)


def main():
    if os.path.exists(SUMMARY_FILE):
        os.remove(SUMMARY_FILE)

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        text = f.read()

    changes = []
    new_text = text

    for m in re.finditer(r'\{[^{}]*\}', text):
        line = m.group(0)
        name = field(line, 'name')
        status = field(line, 'status')
        if not name or status != 'ongoing':
            continue
        nxt = field(line, 'next')
        if nxt and CONFIRMED_RE.search(nxt):
            continue  # already has a confirmed date
        imdb = field(line, 'imdbId')
        aired = field(line, 'aired')
        if not imdb or aired is None:
            continue

        print('  %s (next: %s)' % (name, nxt))
        found = next_premiere(imdb, aired)
        time.sleep(0.4)
        if not found:
            print('    no confirmed premiere on TVmaze, leaving as-is')
            continue
        season, airdate = found
        new_next = 'S%d · %s' % (season, uk(airdate))
        if new_next == nxt:
            print('    already up to date')
            continue
        nb = drop_recheck(set_next(line, new_next))
        new_text = new_text.replace(line, nb, 1)
        changes.append('%s: S%d premieres %s' % (name, season, uk(airdate)))
        print('    -> %s' % new_next)

    if not changes:
        print('\nNo changes.')
        return 0

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('\nUpdated shows-data.js:')
    for c in changes:
        print(' -', c)
    with open(SUMMARY_FILE, 'w') as f:
        f.write('\n'.join(changes))
    return 0


if __name__ == '__main__':
    sys.exit(main())
