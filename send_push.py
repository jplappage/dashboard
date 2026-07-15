#!/usr/bin/env python3
"""
Send a Web Push notification to the dashboard PWA when a VOD date changes.

Runs in the GitHub Action after update_vod_dates.py makes a real change. Reads
the push subscription(s) that the web app saved into the (public) gist, and
sends each one a payload the service worker turns into a notification. Tapping
that notification opens the installed Home Screen app — which is the whole point
of using Web Push instead of ntfy.

Requires (as GitHub secrets / env):
  VAPID_PRIVATE_KEY  — the VAPID private key (PEM or raw base64url)
  VAPID_SUBJECT      — a mailto: contact (optional; has a default)
  VOD_SUMMARY_FILE   — path to the change summary written by update_vod_dates.py

Fails safe: if no key, no subscription, or a send error, it logs and exits 0 so
the workflow never goes red over a notification.
"""

import os
import json
import sys
import urllib.request

GIST_ID = '5411ac8d12fdc31aa3fa73e4d66f6377'
SUB_FILE = 'push-subscription.json'
DASH_URL = 'https://jplappage.github.io/dashboard/'

SUMMARY_FILE = os.environ.get('VOD_SUMMARY_FILE', '.vod-update-summary.txt')
VAPID_PRIVATE = os.environ.get('VAPID_PRIVATE_KEY', '').strip()
VAPID_SUBJECT = os.environ.get('VAPID_SUBJECT') or 'mailto:jplappage@outlook.com'


def load_summary():
    try:
        body = open(SUMMARY_FILE).read().strip()
    except OSError:
        body = ''
    return body or 'A film release date changed.'


def load_subscriptions():
    try:
        with urllib.request.urlopen('https://api.github.com/gists/' + GIST_ID, timeout=25) as r:
            gist = json.load(r)
    except Exception as e:
        print('could not read gist:', e)
        return []
    files = gist.get('files', {})
    if SUB_FILE not in files:
        return []
    try:
        subs = json.loads(files[SUB_FILE]['content'])
    except Exception as e:
        print('bad subscription JSON:', e)
        return []
    if isinstance(subs, dict):
        subs = [subs]
    return [s for s in subs if isinstance(s, dict) and s.get('endpoint')]


def main():
    if not VAPID_PRIVATE:
        print('VAPID_PRIVATE_KEY not set — skipping web push.')
        return 0

    from pywebpush import webpush, WebPushException

    subs = load_subscriptions()
    if not subs:
        print('No push subscriptions saved yet — nothing to send.')
        return 0

    payload = json.dumps({
        'title': 'Dashboard',
        'body': load_summary(),
        'url': DASH_URL,
    })

    sent = 0
    for sub in subs:
        try:
            webpush(
                subscription_info=sub,
                data=payload,
                vapid_private_key=VAPID_PRIVATE,
                vapid_claims={'sub': VAPID_SUBJECT},
            )
            sent += 1
        except WebPushException as e:
            # 404/410 = the subscription is dead; it'll be replaced next time the
            # app re-subscribes. Nothing else to do here.
            code = getattr(getattr(e, 'response', None), 'status_code', None)
            print('push failed (%s): %s' % (code, e))
        except Exception as e:
            # Any other error (network, etc.) — log and keep going; never crash
            # the workflow over a notification.
            print('push error: %r' % (e,))
    print('sent %d/%d' % (sent, len(subs)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
