const CACHE_NAME = 'reactor-dive-cache-v9'; // Bump version
const URLS_TO_CACHE = [
  './', // The start URL
  'index.html',
  'style.css',
  'sketch.js',
  'mobileControls.js',
  'pwa-test.js',
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return from cache if available
        if (response) {
          return response;
        }

        // For navigation requests, fall back to the main page
        if (event.request.mode === 'navigate') {
          console.log('[SW] Navigation request, serving index.html from cache.');
          return caches.match('index.html');
        }

        // Otherwise, fetch from network
        return fetch(event.request);
      })
  );
});
