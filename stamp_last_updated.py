#!/usr/bin/env python3
"""
Auto-stamp the 'Last updated' footers after a data push.

Run by .github/workflows/stamp-last-updated.yml whenever films-data.js,
shows-data.js or retro-data.js is pushed by JP/the watcher (pushes made by
other GitHub Actions use the actions token and do NOT trigger the workflow,
so the footers always reflect the last *manual* refresh).

Stamps (UK time):
  - watchlist-dashboard.html : 'Last updated: DD Mon YYYY (refresh #N)'
                               N increments at most once per calendar day.
  - show-log.html            : const LAST_UPDATED = 'DD Mon YYYY HH:MM'
  - retro-watchlist.html     : footer 'Last updated: DD Mon YYYY HH:MM'

No manual footer bumps are needed during a refresh any more.
"""

import re
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

now = datetime.now(ZoneInfo('Europe/London'))
date = now.strftime('%d %b %Y').lstrip('0')
stamp = f"{date} {now.strftime('%H:%M')}"

changed = []


def sub(path, pattern, repl):
    s = open(path, encoding='utf-8').read()
    ns, n = re.subn(pattern, repl, s, count=1)
    if n and ns != s:
        open(path, 'w', encoding='utf-8').write(ns)
        changed.append(path)


# Films dashboard — date + refresh counter (bumps at most once per day)
p = 'watchlist-dashboard.html'
s = open(p, encoding='utf-8').read()
m = re.search(r'Last updated: (\d{1,2} \w{3} \d{4}) \(refresh #(\d+)\)', s)
if m:
    n = int(m.group(2)) + (0 if m.group(1) == date else 1)
    new = f'Last updated: {date} (refresh #{n})'
    if new != m.group(0):
        open(p, 'w', encoding='utf-8').write(s.replace(m.group(0), new, 1))
        changed.append(p)

sub('show-log.html', r"const LAST_UPDATED = '[^']*'", f"const LAST_UPDATED = '{stamp}'")
sub('retro-watchlist.html', r'Last updated: [^<]*<', f'Last updated: {stamp}<')

print(f"stamp {stamp}: " + (', '.join(changed) if changed else 'no change'))
sys.exit(0)
