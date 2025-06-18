const CACHE_NAME = 'reactor-dive-cache-v7';

// The filenames we want to cache, without paths
const filesToCache = [
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
  'sw.js'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        
        // Get the base URL of the service worker
        const url = new URL(self.location.href);
        const baseUrlPath = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
        const isGitHubPages = self.location.hostname === 'softhook.github.io';
        
        console.log('SW install: Base URL Path:', baseUrlPath);
        console.log('SW install: Is GitHub Pages:', isGitHubPages);
        
        // Try to cache files using multiple possible paths
        const cachePromises = filesToCache.map(file => {
          // Try multiple path combinations for each file
          const paths = [
            file,                  // Simple filename
            `./${file}`,           // Relative path
            `/sub/${file}`,        // GitHub Pages path
            `${baseUrlPath}${file}` // Dynamically determined path
          ];
          
          // Try each path in sequence until one works
          return paths.reduce((promise, path) => {
            return promise.then(() => cache.add(path))
              .catch(err => {
                console.log(`Failed to cache ${path}:`, err);
                return Promise.resolve(); // Continue even if one path fails
              });
          }, Promise.resolve());
        });
        
        // Also try to cache the root paths
        const rootPaths = ['/', './'];
        if (isGitHubPages) {
          rootPaths.push('/sub/', '/sub');
        }
        
        const rootCachePromises = rootPaths.map(path => {
          return cache.add(path).catch(err => {
            console.log(`Failed to cache root path ${path}:`, err);
            return Promise.resolve();
          });
        });
        
        return Promise.all([...cachePromises, ...rootCachePromises]);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  console.log('SW: Fetch event for ', event.request.url);
  
  // Get our base URL
  const url = new URL(event.request.url);
  const baseUrlPath = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
  console.log('SW: Base URL Path:', baseUrlPath);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('SW: Cache hit for ', event.request.url);
          return response;
        }
        
        // For navigation requests, serve index.html for any path that doesn't have a file extension
        if (event.request.mode === 'navigate') {
          console.log('SW: Navigation request for path:', url.pathname);
          
          // Handle PWA start with any path
          if (!url.pathname.includes('.')) { // If no file extension, it's a directory request
            console.log('SW: Directory navigation, trying index.html');
            
            // Try multiple possible paths for index.html, using in-scope approach
            const indexPaths = [
              'index.html',
              './index.html',
              '/index.html',
              '/sub/index.html',
              'sub/index.html',
              `${baseUrlPath}index.html`
            ];
            
            // Try each path in sequence
            return indexPaths.reduce((promise, path) => {
              return promise.then(response => {
                if (response) return response;
                console.log('SW: Trying', path);
                return caches.match(path);
              });
            }, Promise.resolve(null)).then(response => {
              if (response) return response;
              console.log('SW: Fetching index.html from network');
              return fetch('index.html').catch(() => fetch('./index.html'))
                .catch(() => fetch('/sub/index.html'))
                .catch(() => {
                  console.error('SW: Failed to fetch index.html from anywhere');
                  // Create a fallback response that redirects to the main page
                  return new Response('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=index.html"></head><body>Redirecting...</body></html>', {
                    headers: { 'Content-Type': 'text/html' }
                  });
                });
            });
          }
        }
        
        console.log('SW: Fetching from network ', event.request.url);
        return fetch(event.request).catch(error => {
          console.error('SW: Fetch failed:', error);
          
          // For image/font resources if fetch fails, try with different paths
          if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|otf|ttf|woff|woff2)$/i)) {
            const filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
            console.log('SW: Trying alternate paths for asset:', filename);
            
            return fetch(filename).catch(() => fetch(`./${filename}`))
              .catch(() => fetch(`/sub/${filename}`));
          }
          
          throw error;
        });
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  console.log('SW: Activating new service worker');
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients immediately
      self.clients.claim().then(() => {
        console.log('SW: Claimed clients');
        
        // Optionally refresh clients to ensure they use the new service worker
        return self.clients.matchAll().then(clients => {
          return Promise.all(clients.map(client => {
            // You could send a message to clients here if needed
            console.log('SW: Controlling client:', client.url);
          }));
        });
      })
    ])
  );
});
