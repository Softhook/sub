const CACHE_NAME = 'reactor-dive-cache-v25'; // Added improved update handling

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
  'JSONBase.js', // Updated from JSONBIN.js to JSONBase.js
  'powerup.js',
  'update-manager.js'
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
        // Skip waiting to activate the new service worker immediately
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

// Check for app updates periodically
self.addEventListener('message', event => {
  if (event.data === 'CHECK_FOR_UPDATES') {
    console.log('[SW] Checking for updates requested by client');
    // This will compare the cached files with network versions
    event.waitUntil(
      checkForUpdates().then(hasUpdates => {
        // Notify client about update status
        if (hasUpdates) {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'UPDATE_AVAILABLE',
                message: 'A new version is available!'
              });
            });
          });
        }
      })
    );
  } else if (event.data === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested by client');
    self.skipWaiting();
  }
});

// Function to check for updates by comparing cache to network
async function checkForUpdates() {
  console.log('[SW] Checking for application updates...');
  
  // First, check if we're online by attempting a network request
  try {
    // We'll try to fetch a known endpoint on the same origin
    const onlineCheckUrl = self.location.origin + '/manifest.json';
    const testRequest = await fetch(onlineCheckUrl, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    if (!testRequest.ok) {
      console.log('[SW] Network appears to be offline or unreliable. Skipping update check.');
      return false;
    }
  } catch (error) {
    console.log('[SW] Network test failed. Likely offline. Skipping update check.');
    return false;
  }
  
  let hasUpdates = false;
  const cache = await caches.open(CACHE_NAME);
  const cachedRequests = await cache.keys();
  const updateCheckFiles = cachedRequests.filter(request => {
    const url = new URL(request.url);
    return url.pathname.endsWith('.js') || url.pathname.endsWith('.html') || url.pathname === '/';
  });

  try {
    for (const request of updateCheckFiles) {
      try {
        // Get the cached version
        const cachedResponse = await cache.match(request);
        if (!cachedResponse) continue;

        // Fetch the current version from network
        const fetchResponse = await fetch(request, { cache: 'no-cache' });
        if (!fetchResponse || fetchResponse.status !== 200) continue;

        // Compare the responses (at minimum by checking their dates)
        const cachedLastModified = cachedResponse.headers.get('last-modified');
        const fetchedLastModified = fetchResponse.headers.get('last-modified');

        if (fetchedLastModified && cachedLastModified && 
            new Date(fetchedLastModified) > new Date(cachedLastModified)) {
          console.log(`[SW] Update detected for ${request.url}`);
          hasUpdates = true;
          break;
        }
        
        // If we can't compare by date, compare by etag or content
        const cachedEtag = cachedResponse.headers.get('etag');
        const fetchedEtag = fetchResponse.headers.get('etag');
        
        if (fetchedEtag && cachedEtag && fetchedEtag !== cachedEtag) {
          console.log(`[SW] Update detected for ${request.url} (ETag changed)`);
          hasUpdates = true;
          break;
        }
      } catch (error) {
        console.error(`[SW] Error checking updates for ${request.url}:`, error);
      }
    }
  } catch (error) {
    console.error('[SW] Error during update check:', error);
  }
  
  console.log('[SW] Update check complete. Updates available:', hasUpdates);
  return hasUpdates;
}

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
  const path = requestUrl.pathname;
  
  // Check if this is a file that might be updated frequently
  const isUpdateableFile = path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css') || 
                           path === '/' || path === '' || isStartUrlRequest;
                           
  // For HTML, JS, and CSS files - use network first with cache fallback
  if (isUpdateableFile) {
    console.log('[SW] Network-first strategy for:', request.url);
    try {
      // Try network first
      const networkResponse = await fetch(request);
      
      // If successful, clone the response, cache it and return it
      if (networkResponse && networkResponse.status === 200) {
        const clone = networkResponse.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, clone);
        console.log('[SW] Updated cache from network for:', request.url);
        return networkResponse;
      }
    } catch (error) {
      console.log('[SW] Network request failed, falling back to cache for:', request.url);
    }
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  } 
  // For other assets - use cache first with network fallback
  else {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // For navigation requests or start URL, serve the app shell
  if (isStartUrlRequest || request.mode === 'navigate') {
    console.log(`[SW] Serving app shell for ${request.mode} request to ${request.url}`);
    const appShell = await caches.match('./');
    if (appShell) {
      return appShell;
    }
  }
  
  // Try network as last resort
  console.log('[SW] Fetching from network:', request.url);
  return fetch(request);
}
