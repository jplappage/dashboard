#!/usr/bin/env python3
"""
Generate watchlist.ics from films-data.js (the single source of truth for
FILMS and WATCHED). Runs automatically via GitHub Actions whenever
films-data.js changes — no need to run it by hand.

Usage:
    python generate_ics.py
"""

import re
import os
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE  = os.path.join(SCRIPT_DIR, 'films-data.js')
ICS_FILE   = os.path.join(SCRIPT_DIR, 'watchlist.ics')


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_field(obj_text, field, default=None):
    """Extract a single field from a JS object literal (single or double quotes)."""
    m = re.search(rf'{field}:\s*"([^"]*)"', obj_text)
    if m:
        return m.group(1)
    m = re.search(rf"{field}:\s*'([^']*)'", obj_text)
    if m:
        return m.group(1)
    if re.search(rf'{field}:\s*null', obj_text):
        return None
    m = re.search(rf'{field}:\s*(true|false)', obj_text)
    if m:
        return m.group(1) == 'true'
    m = re.search(rf'{field}:\s*([\d.]+)', obj_text)
    if m:
        val = m.group(1)
        return float(val) if '.' in val else int(val)
    return default


def extract_objects(content, array_name):
    """Return a list of raw JS object strings from a named const array."""
    m = re.search(rf'const {array_name} = \[', content)
    if not m:
        return []
    start = m.end()
    depth, i = 1, start
    while i < len(content) and depth > 0:
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
        i += 1
    array_text = content[start:i - 1]

    objects, obj_depth, obj_start = [], 0, None
    for j, ch in enumerate(array_text):
        if ch == '{':
            if obj_depth == 0:
                obj_start = j
            obj_depth += 1
        elif ch == '}':
            obj_depth -= 1
            if obj_depth == 0 and obj_start is not None:
                objects.append(array_text[obj_start:j + 1])
                obj_start = None
    return objects


def to_ics_date(date_str):
    return date_str.replace('-', '')


def next_day(date_str):
    d = datetime.strptime(date_str, '%Y-%m-%d') + timedelta(days=1)
    return d.strftime('%Y%m%d')


def make_uid(label, date_str=''):
    slug = re.sub(r'[^a-z0-9]+', '-', label.lower()).strip('-')
    return f'{slug}-{date_str}@jp-watchlist'


def vevent(summary, date_str, uid_str, description=''):
    now = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    lines = [
        'BEGIN:VEVENT',
        f'UID:{uid_str}',
        f'DTSTAMP:{now}',
        f'DTSTART;VALUE=DATE:{to_ics_date(date_str)}',
        f'DTEND;VALUE=DATE:{next_day(date_str)}',
        f'SUMMARY:{summary}',
    ]
    if description:
        lines.append(f'DESCRIPTION:{description}')
    lines.append('END:VEVENT')
    return lines


# ── Main builder ──────────────────────────────────────────────────────────────

def build_ics(film_objs, watched_objs):
    events = []

    # Watched archive — kept on calendar even after removal from dashboard
    for obj in watched_objs:
        title    = get_field(obj, 'title') or 'Untitled'
        vod_date = get_field(obj, 'vodDate')
        imdb     = get_field(obj, 'imdbRating')
        if not vod_date:
            continue
        summary = f'Watched: {title}'
        desc    = f'IMDB: {imdb}' if imdb else ''
        events += vevent(summary, vod_date, make_uid(title + '-watched', vod_date), desc)

    # Films — confirmed dates only (not estimated, not null)
    for obj in film_objs:
        title     = get_field(obj, 'title') or 'Untitled'
        vod_date  = get_field(obj, 'vodDate')
        estimated = get_field(obj, 'estimated', False)
        imdb      = get_field(obj, 'imdbRating')

        if not vod_date or estimated:
            continue

        today = datetime.today().date()
        d     = datetime.strptime(vod_date, '%Y-%m-%d').date()
        verb  = 'Available' if d <= today else 'Coming'
        summary = f'{title} - VOD ({verb})'
        desc    = f'IMDB: {imdb}' if imdb else ''
        events += vevent(summary, vod_date, make_uid(title, vod_date), desc)

    # TV shows — premiere + finale
    for obj in tv_objs:
        title       = get_field(obj, 'title') or 'Untitled'
        season      = get_field(obj, 'season')
        stream_date = get_field(obj, 'streamDate')
        finale_date = get_field(obj, 'finaleDate')
        note        = get_field(obj, 'note') or ''
        imdb        = get_field(obj, 'imdbRating')

        s = f'S{int(season)}' if season is not None else ''

        if stream_date:
            summary = f'{title} {s} - Premiere'
            desc    = note
            if imdb:
                desc = (desc + f' | IMDB: {imdb}').strip(' |')
            events += vevent(summary, stream_date, make_uid(f'{title}-premiere', stream_date), desc)

        if finale_date:
            summary = f'{title} {s} - Finale'
            events += vevent(summary, finale_date, make_uid(f'{title}-finale', finale_date), note)

    header = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//JP Watchlist//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        "X-WR-CALNAME:JP's Watchlist",
        'X-WR-CALDESC:VOD and streaming release dates',
        'X-WR-TIMEZONE:Europe/London',
    ]
    footer = ['END:VCALENDAR']
    return '\r\n'.join(header + events + footer) + '\r\n'


def main():
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    film_objs = extract_objects(content, 'FILMS')
    tv_objs   = extract_objects(content, 'TV_SHOWS')

    ics = build_ics(film_objs, tv_objs)

    with open(ICS_FILE, 'w', encoding='utf-8', newline='') as f:
        f.write(ics)

    film_count = sum(
        1 for o in film_objs
        if get_field(o, 'vodDate') and not get_field(o, 'estimated', False)
    )
    tv_count   = sum(1 for o in tv_objs if get_field(o, 'streamDate'))

    print(f'watchlist.ics generated')
    print(f'  {len(WATCHED)} watched archive events')
    print(f'  {film_count} film events')
    print(f'  {tv_count} TV show premieres + finales')
    print(f'  Subscribe: https://jplappage.github.io/dashboard/watchlist.ics')


if __name__ == '__main__':
    main()
