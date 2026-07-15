#!/usr/bin/env python3
"""
Push a reminder before France (World Cup) and Liverpool matches.

Runs every couple of hours. For any FRA/LFC match kicking off within the next
few hours that hasn't already been announced, it writes a reminder for the push
step and records the match id in notified-matches.json so it's never repeated.

Data: ESPN's public API (same feeds the World Cup page and lineup builder use).
Note: France is tracked via the World Cup competition; after the tournament,
add other competitions here if you want France friendlies/qualifiers too.
"""

import re
import os
import json
import urllib.request
from datetime import datetime, timezone, timedelta

try:
    from zoneinfo import ZoneInfo
    UK = ZoneInfo('Europe/London')
except Exception:
    UK = timezone(timedelta(hours=1))

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
NOTIFIED_FILE = os.path.join(SCRIPT_DIR, 'notified-matches.json')
SUMMARY_FILE = os.environ.get('MATCH_SUMMARY_FILE', os.path.join(SCRIPT_DIR, '.match-summary.txt'))
LEAD_HOURS = float(os.environ.get('MATCH_LEAD_HOURS', '5'))
NOW = (datetime.fromisoformat(os.environ['MATCH_NOW']) if os.environ.get('MATCH_NOW')
       else datetime.now(timezone.utc))

UA = 'Mozilla/5.0 (compatible; JP-Dashboard/1.0)'
WC_SCOREBOARD = ('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/'
                 'scoreboard?dates=20260611-20260719&limit=200')
LFC_COMPS = ['eng.1', 'uefa.champions', 'eng.fa', 'eng.league_cup', 'club.friendly']


def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read().decode('utf-8', 'ignore'))
    except Exception as e:
        print('  espn fetch failed:', e)
        return {}


def parse_event(e, team):
    date_str = e.get('date')
    if not date_str:
        return None
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except ValueError:
        return None
    label = e.get('shortName') or e.get('name') or ''
    try:
        comp = e['competitions'][0]['competitors']
        h = next(x for x in comp if x['homeAway'] == 'home')
        a = next(x for x in comp if x['homeAway'] == 'away')
        label = h['team']['shortDisplayName'] + ' v ' + a['team']['shortDisplayName']
    except Exception:
        pass
    return {'id': str(e.get('id') or label + date_str), 'dt': dt, 'label': label, 'team': team}


def gather():
    out = []
    j = fetch(WC_SCOREBOARD)
    for e in j.get('events', []):
        if 'france' in (e.get('name', '').lower()):
            g = parse_event(e, 'France')
            if g:
                out.append(g)
    for comp in LFC_COMPS:
        j = fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/%s/teams/364' % comp)
        evs = (j.get('team', {}) or {}).get('nextEvent') or j.get('events') or []
        for e in evs:
            g = parse_event(e, 'Liverpool')
            if g:
                out.append(g)
    return out


def when_label(dt):
    uk = dt.astimezone(UK)
    today = NOW.astimezone(UK).date()
    delta_days = (uk.date() - today).days
    day = 'today' if delta_days == 0 else 'tomorrow' if delta_days == 1 else uk.strftime('%a %-d %b')
    return '%s %s' % (day, uk.strftime('%H:%M'))


def main():
    if os.path.exists(SUMMARY_FILE):
        os.remove(SUMMARY_FILE)

    try:
        with open(NOTIFIED_FILE) as f:
            notified = json.load(f)
        if not isinstance(notified, dict):
            notified = {}
    except Exception:
        notified = {}

    lines = []
    for g in gather():
        if g['id'] in notified:
            continue
        secs = (g['dt'] - NOW).total_seconds()
        if secs <= 0 or secs > LEAD_HOURS * 3600:
            continue
        lines.append('%s — kicks off %s' % (g['label'], when_label(g['dt'])))
        notified[g['id']] = g['dt'].astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        print('  reminder:', lines[-1])

    # Prune ids for matches now well in the past so the file stays small.
    cutoff = (NOW - timedelta(days=2)).strftime('%Y-%m-%dT%H:%M:%SZ')
    notified = {k: v for k, v in notified.items() if v >= cutoff}

    with open(NOTIFIED_FILE, 'w') as f:
        json.dump(notified, f, indent=0, sort_keys=True)

    if lines:
        with open(SUMMARY_FILE, 'w') as f:
            f.write('\n'.join(lines))
    else:
        print('No matches within the next %g hours.' % LEAD_HOURS)
    return 0


if __name__ == '__main__':
    main()
