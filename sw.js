const CACHE_NAME = 'reactor-dive-cache-v17'; // Updated to fix playerSub.js sonar range bug

// Core application files
const CORE_FILES = [
  './', // The start URL
  'index.html',
  'style.css',
  'manifest.json'
];

// Game JavaScript files
const GAME_FILES = [
  'sketch.js',
  'playerSub.js',
  'enemy.js', 
  'projectile.js',
  'cave.js',
  'bubbles.js',
  'mobileControls.js',
  'JSONBase.js' // Updated from JSONBIN.js to JSONBase.js
];

// External libraries
const LIBRARY_FILES = [
  'p5.js',
  'p5.sound.min.js'
];

// Assets
const ASSET_FILES = [
  'icon-192x192.png',
  'icon-512x512.png',
  'Berpatroli.otf',
  'spinner.svg'
];

// All files to cache
const URLS_TO_CACHE = [
  ...CORE_FILES,
  ...GAME_FILES,
  ...LIBRARY_FILES,
  ...ASSET_FILES
];

// Install: cache all static assets
self.addEventListener('install', event => {
  console.log('[SW] Install event - caching resources');
  event.waitUntil(
    installCache()
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
        throw error;
      })
  );
});

// Activate: clean up old caches and take control
self.addEventListener('activate', event => {
  console.log('[SW] Activate event - cleaning up old caches');
  event.waitUntil(
    cleanupOldCaches()
      .then(() => {
        console.log('[SW] Activation complete, taking control');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[SW] Activation failed:', error);
        throw error;
      })
  );
});

// Fetch: serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    handleFetchRequest(event.request)
      .catch(error => {
        console.error('[SW] Fetch error for', event.request.url, ':', error);
        // Return a basic response or let it fail naturally
        return new Response('Network error', { 
          status: 503, 
          statusText: 'Service Unavailable' 
        });
      })
  );
});

// Helper function to install and cache resources
async function installCache() {
  const cache = await caches.open(CACHE_NAME);
  console.log('[SW] Caching app shell:', URLS_TO_CACHE.length, 'files');
  
  // Cache core files first, then others
  await cache.addAll(CORE_FILES);
  console.log('[SW] Core files cached');
  
  await cache.addAll(GAME_FILES);
  console.log('[SW] Game files cached');
  
  await cache.addAll(LIBRARY_FILES);
  console.log('[SW] Library files cached');
  
  await cache.addAll(ASSET_FILES);
  console.log('[SW] Asset files cached');
  
  return cache;
}

// Helper function to clean up old caches
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames
    .filter(cacheName => cacheName !== CACHE_NAME)
    .map(cacheName => {
      console.log('[SW] Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    });
  
  return Promise.all(deletePromises);
}

// Helper function to handle fetch requests
async function handleFetchRequest(request) {
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  const isStartUrlRequest = requestUrl.pathname === scopeUrl.pathname;
  
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // For navigation requests or start URL, serve the app shell
  if (isStartUrlRequest || request.mode === 'navigate') {
    console.log(`[SW] Serving app shell for ${request.mode} request to ${request.url}`);
    const appShell = await caches.match('./');
    if (appShell) {
      return appShell;
    }
  }
  
  // Try network as fallback
  console.log('[SW] Fetching from network:', request.url);
  return fetch(request);
}
