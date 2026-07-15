#!/usr/bin/env python3
"""
Find films / show premieres landing TODAY and write a notification summary.

Run once a day by the release-today workflow: if anything is out today, it writes
the summary file the push step sends ("Backrooms is out now"). If nothing's out,
it writes nothing and no notification is sent. Runs once daily, so each release
is announced exactly once.
"""

import re
import os
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FILMS_FILE = os.path.join(SCRIPT_DIR, 'films-data.js')
SHOWS_FILE = os.path.join(SCRIPT_DIR, 'shows-data.js')
SUMMARY_FILE = os.environ.get('RELEASE_SUMMARY_FILE', os.path.join(SCRIPT_DIR, '.release-summary.txt'))

# Allow tests to pin "today".
TODAY = os.environ.get('RELEASE_TODAY') or datetime.now(timezone.utc).strftime('%Y-%m-%d')

NEXT_RE = re.compile(r'S(\d+)\s*·\s*(\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4})')


def objects(content, array):
    m = re.search(rf'const {array} = \[', content)
    if not m:
        return []
    start, depth, i = m.end(), 1, m.end()
    while i < len(content) and depth > 0:
        depth += (content[i] == '[') - (content[i] == ']')
        i += 1
    txt, out, d, s = content[start:i - 1], [], 0, None
    for j, ch in enumerate(txt):
        if ch == '{':
            if d == 0:
                s = j
            d += 1
        elif ch == '}':
            d -= 1
            if d == 0 and s is not None:
                out.append(txt[s:j + 1])
                s = None
    return out


def sfield(obj, field):
    m = re.search(rf"{field}:\s*'([^']*)'", obj) or re.search(rf'{field}:\s*"([^"]*)"', obj)
    return m.group(1) if m else None


def main():
    if os.path.exists(SUMMARY_FILE):
        os.remove(SUMMARY_FILE)

    lines = []

    with open(FILMS_FILE, encoding='utf-8') as f:
        films = f.read().replace('\x00', '')
    for obj in objects(films, 'FILMS'):
        if sfield(obj, 'vodDate') == TODAY:
            title = sfield(obj, 'title') or 'A film'
            lines.append(f'{title} is out now')

    with open(SHOWS_FILE, encoding='utf-8') as f:
        shows = f.read().replace('\x00', '')
    for obj in objects(shows, 'SHOWS'):
        if sfield(obj, 'status') != 'ongoing':
            continue
        nxt = sfield(obj, 'next') or ''
        m = NEXT_RE.search(nxt)
        if not m:
            continue
        iso = datetime.strptime(m.group(2), '%d %b %Y').strftime('%Y-%m-%d')
        if iso == TODAY:
            name = sfield(obj, 'name') or 'A show'
            lines.append(f'{name} — S{m.group(1)} premieres today')

    if not lines:
        print('Nothing out today (%s).' % TODAY)
        return 0

    with open(SUMMARY_FILE, 'w') as f:
        f.write('\n'.join(lines))
    print('Out today (%s):' % TODAY)
    for l in lines:
        print(' -', l)
    return 0


if __name__ == '__main__':
    main()
