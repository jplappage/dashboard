/* JP's Dashboards — service worker
 *
 * Caching strategy:
 *   - DATA files (films-data.js, shows-data.js): NETWORK-FIRST.
 *     Always try the live version from GitHub first so your laptop edits
 *     show up as soon as the deploy is live. Falls back to cache only when
 *     offline / on a bad signal.
 *   - App shell (HTML pages, images, fonts, icons): STALE-WHILE-REVALIDATE.
 *     Serves instantly from cache, then quietly fetches a fresh copy in the
 *     background so the next open is up to date.
 *   - Cross-origin (Google Fonts CSS, GitHub gist API): passed straight to
 *     the network, never cached.
 *
 * If you ever need to force every device to drop its cached shell, bump
 * CACHE_VERSION below and redeploy.
 */

const CACHE_VERSION = 'v3';
const CACHE_NAME = 'jp-dashboards-' + CACHE_VERSION;

// Files fetched fresh every load (fall back to cache only when offline).
const DATA_FILES = ['films-data.js', 'shows-data.js'];

// Warm the cache on install so the first standalone launch is instant.
const PRECACHE = [
  './',
  'index.html',
  'watchlist-dashboard.html',
  'manifest.json',
  'Images/app-icon-180.png',
  'Images/app-icon-192.png',
  'Images/app-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

function isDataFile(url) {
  return DATA_FILES.some((f) => url.pathname.endsWith('/' + f) || url.pathname.endsWith(f));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GETs; everything else goes straight to network.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // NETWORK-FIRST for the data files.
  if (isDataFile(url)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // STALE-WHILE-REVALIDATE for the app shell.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

/* ── Web Push ──────────────────────────────────────────────────────────────
 * Shows the notification when a push arrives, and — the whole point on iOS —
 * opens/focuses the installed Home Screen app when the notification is tapped.
 */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { body: event.data ? event.data.text() : '' }; }

  const title = data.title || 'Dashboard';
  const options = {
    body: data.body || 'A film release date changed.',
    icon: 'Images/app-icon-192.png',
    badge: 'Images/app-icon-192.png',
    data: { url: data.url || './' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus an already-open dashboard window if there is one…
      for (const c of clients) {
        if ('focus' in c) return c.focus();
      }
      // …otherwise open the app (standalone display, i.e. the Home Screen shortcut).
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
