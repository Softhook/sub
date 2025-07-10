const CACHE_NAME = 'reactor-dive-cache-v13'; // Bump version for display_override
const URLS_TO_CACHE = [
  './', // The start URL
  'index.html',
  'style.css',
  'sketch.js',
  'mobileControls.js',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png',
  'Berpatroli.otf',
  'spinner.svg',
  'p5.js',
  'p5.sound.min.js',
];

// Install: cache all static assets
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell:', URLS_TO_CACHE);
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, or network, with a fallback for navigation
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const scopeUrl = new URL(self.registration.scope);

  // Check if the request is for the root of the scope (the start_url)
  const isStartUrlRequest = event.request.method === 'GET' && requestUrl.pathname === scopeUrl.pathname;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return from cache if available
        if (response) {
          return response;
        }

        // If the request is for the start_url, or any other navigation,
        // serve the app shell from the cache. This is the crucial fallback.
        if (isStartUrlRequest || event.request.mode === 'navigate') {
          console.log(`[SW] Fallback for ${event.request.mode} to ${event.request.url}. Serving root from cache.`);
          return caches.match('./');
        }

        // Otherwise, fetch from network
        return fetch(event.request);
      })
  );
});
