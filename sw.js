const CACHE_NAME = 'reactor-dive-cache-v6';
// Function to determine if we're on GitHub Pages
function getBaseUrl() {
  // Check if we're on GitHub Pages (softhook.github.io)
  const isGitHubPages = self.location.hostname === 'softhook.github.io';
  return isGitHubPages ? '/sub/' : './';
}

// Add all the files you want to cache
const baseUrl = getBaseUrl();
const urlsToCache = [
  baseUrl,
  `${baseUrl}index.html`,
  `${baseUrl}style.css`,
  `${baseUrl}sketch.js`,
  `${baseUrl}mobileControls.js`,
  `${baseUrl}pwa-test.js`,
  `${baseUrl}manifest.json`,
  `${baseUrl}icon-192x192.png`,
  `${baseUrl}icon-512x512.png`,
  `${baseUrl}Berpatroli.otf`,
  `${baseUrl}spinner.svg`,
  `${baseUrl}p5.js`,
  `${baseUrl}p5.sound.min.js`
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  console.log('SW: Fetch event for ', event.request.url);
  
  // Helper function to handle GitHub Pages subdirectory
  const isGitHubPages = location.hostname === 'softhook.github.io';
  const basePath = isGitHubPages ? '/sub/' : '/';
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('SW: Cache hit for ', event.request.url);
          return response;
        }
        
        // For navigation requests to root or subdirectory root, try to serve index.html
        if (event.request.mode === 'navigate') {
          const url = new URL(event.request.url);
          console.log('SW: Navigation request for path:', url.pathname);
          
          if (url.pathname === '/' || 
              url.pathname === '/sub/' || 
              url.pathname === basePath || 
              url.pathname.endsWith('/')) {
            console.log('SW: Navigation to root, trying index.html');
            
            // Try multiple possible paths for index.html
            return caches.match('index.html')
              .then(response => {
                if (response) return response;
                return caches.match('./index.html');
              })
              .then(response => {
                if (response) return response;
                return caches.match(`${basePath}index.html`);
              })
              .then(response => {
                if (response) return response;
                console.log('SW: Fetching index.html from network');
                return fetch('index.html');
              });
          }
        }
        
        console.log('SW: Fetching from network ', event.request.url);
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
