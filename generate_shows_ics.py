#!/usr/bin/env python3
"""
Generate shows.ics from shows-data.js — one all-day event per ONGOING show that
has a confirmed season-premiere date (next: "S3 · 14 Sep 2026"). Subscribe to it
to see premieres in your calendar, alongside watchlist.ics for films.

Runs via GitHub Actions whenever shows-data.js changes. Vague/estimated dates are
skipped (nothing to put on a calendar until there's a real date).
"""

import re
import os
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE  = os.path.join(SCRIPT_DIR, 'shows-data.js')
ICS_FILE   = os.path.join(SCRIPT_DIR, 'shows.ics')

# "S3 · 14 Sep 2026"  ->  season "3", date "14 Sep 2026"
NEXT_RE = re.compile(r'S(\d+)\s*·\s*(\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4})')


def get_field(obj_text, field):
    m = re.search(rf'{field}:\s*"([^"]*)"', obj_text)
    if m:
        return m.group(1)
    if re.search(rf'{field}:\s*null', obj_text):
        return None
    m = re.search(rf'{field}:\s*(\d+)', obj_text)
    return m.group(1) if m else None


def extract_objects(content, array_name):
    m = re.search(rf'const {array_name} = \[', content)
    if not m:
        return []
    start, depth, i = m.end(), 1, m.end()
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


def make_uid(label):
    slug = re.sub(r'[^a-z0-9]+', '-', label.lower()).strip('-')
    return f'{slug}@jp-shows'


def vevent(summary, iso_date):
    now = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    end = (datetime.strptime(iso_date, '%Y-%m-%d') + timedelta(days=1)).strftime('%Y%m%d')
    return [
        'BEGIN:VEVENT',
        f'UID:{make_uid(summary)}',
        f'DTSTAMP:{now}',
        f'DTSTART;VALUE=DATE:{iso_date.replace("-", "")}',
        f'DTEND;VALUE=DATE:{end}',
        f'SUMMARY:{summary}',
        'END:VEVENT',
    ]


def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read().replace('\x00', '')

    events, count = [], 0
    for obj in extract_objects(content, 'SHOWS'):
        if get_field(obj, 'status') != 'ongoing':
            continue
        name = get_field(obj, 'name')
        nxt = get_field(obj, 'next')
        if not name or not nxt:
            continue
        m = NEXT_RE.search(nxt)
        if not m:
            continue  # vague/estimated — nothing to schedule yet
        season, human = m.group(1), m.group(2)
        iso = datetime.strptime(human, '%d %b %Y').strftime('%Y-%m-%d')
        events += vevent(f'{name} — S{season} premiere', iso)
        count += 1

    header = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//JP Show Log//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        "X-WR-CALNAME:JP's Show Premieres",
        'X-WR-CALDESC:Confirmed season-premiere dates',
        'X-WR-TIMEZONE:Europe/London',
    ]
    ics = '\r\n'.join(header + events + ['END:VCALENDAR']) + '\r\n'

    with open(ICS_FILE, 'w', encoding='utf-8', newline='') as f:
        f.write(ics)
    print(f'shows.ics generated — {count} premiere events')
    print('  Subscribe: https://jplappage.github.io/dashboard/shows.ics')


if __name__ == '__main__':
    main()
