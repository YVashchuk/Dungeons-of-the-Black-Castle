// ═══════════════════════════════════════════════════════════════
// Dungeons of the Black Castle — Service Worker
// ═══════════════════════════════════════════════════════════════
//
// Strategy: tiny precache + navigation network-first fallback.
// Because all art and game data are baked into the main HTML,
// there is no need for a complex runtime asset cache.
//
// - Repeat launches work offline.
// - Installed app opens without a network dependency.
// - Online launches pick up new builds instead of getting stuck on old cache.
//
// Based on: https://web.dev/articles/service-worker-lifecycle (Google Chrome team)
// and MDN Service Worker API.
//
// IMPORTANT: bump VERSION on every release to force cache invalidation.
// ═══════════════════════════════════════════════════════════════

const VERSION = '2026-09-04-001';
const CACHE_NAME = `black-castle-${VERSION}`;
const APP_HTML = './dungeons-of-the-black-castle.html';

const PRECACHE = [
  './',
  APP_HTML,
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

// ─── INSTALL ───
// Precache the app shell. skipWaiting() activates immediately after install
// so returning users get new code on next navigation.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ─── ACTIVATE ───
// Delete old caches so we don't grow unboundedly across versions.
// clients.claim() takes control of open pages without requiring a reload.
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

// ─── FETCH ───
// Two strategies:
//   1. Navigation requests (top-level HTML):
//      network-first, fall back to cached APP_HTML offline.
//      Also update the cache with fresh HTML when online.
//   2. Static shell files (manifest, icons, any subresources):
//      cache-first, fall through to network.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests.
  if (url.origin !== location.origin) return;

  // Navigation: network-first.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(APP_HTML, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(req)) || (await caches.match(APP_HTML));
      }
    })());
    return;
  }

  // Static: cache-first.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    if (req.method === 'GET' && res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  })());
});

// ─── MESSAGE (optional update hook) ───
// Allows the page to postMessage({type:'SKIP_WAITING'}) to force an update
// without waiting for all tabs to close. Useful for "reload to update" UX.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
