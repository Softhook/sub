// PWA Install Detection and Manual Trigger
let deferredPrompt;

// Create a visible test results div
function createTestResultsDiv() {
  const existingDiv = document.getElementById('pwa-test-results');
  if (existingDiv) return existingDiv;
  
  const div = document.createElement('div');
  div.id = 'pwa-test-results';
  div.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-width: 300px;
  `;
  document.body.appendChild(div);
  return div;
}

function logToPage(message) {
  console.log(message);
  const div = createTestResultsDiv();
  div.innerHTML += message + '<br>';
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  logToPage('PWA: beforeinstallprompt event fired ✅');
  
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  logToPage('PWA: Install prompt is available ✅');
  
  // Auto-trigger the install prompt (for testing)
  setTimeout(() => {
    if (deferredPrompt) {
      logToPage('PWA: Triggering install prompt...');
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          logToPage('PWA: User accepted the install prompt ✅');
        } else {
          logToPage('PWA: User dismissed the install prompt ❌');
        }
        deferredPrompt = null;
      });
    }
  }, 3000); // Show prompt after 3 seconds
});

// Check if app is already installed
window.addEventListener('appinstalled', (evt) => {
  logToPage('PWA: App was installed ✅');
});

// Check PWA criteria
function checkPWACriteria() {
  logToPage('=== PWA Criteria Check ===');
  logToPage('URL: ' + window.location.href);
  logToPage('Origin: ' + window.location.origin);
  logToPage('Pathname: ' + window.location.pathname);
  logToPage('Base URI: ' + document.baseURI);
  
  // Detect environment
  const isGitHubPages = location.hostname === 'softhook.github.io';
  logToPage('GitHub Pages: ' + (isGitHubPages ? '✅' : '❌'));
  logToPage('Base Path: ' + (isGitHubPages ? '/sub/' : './'));
  
  // Check if running in standalone mode (PWA)
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreen = window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalUI = window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches;
  const isBrowser = window.matchMedia && window.matchMedia('(display-mode: browser)').matches;
  
  logToPage('Standalone mode: ' + (isStandalone ? '✅' : '❌'));
  logToPage('Fullscreen mode: ' + (isFullscreen ? '✅' : '❌'));
  logToPage('Minimal-UI mode: ' + (isMinimalUI ? '✅' : '❌'));
  logToPage('Browser mode: ' + (isBrowser ? '✅' : '❌'));
  
  // Check other PWA indicators
  const isNavigatorStandalone = window.navigator.standalone;
  logToPage('Navigator standalone: ' + (isNavigatorStandalone ? '✅' : '❌'));
  
  // Check if launched from home screen (iOS)
  const isHomeScreen = window.navigator.standalone === true;
  logToPage('iOS Home Screen: ' + (isHomeScreen ? '✅' : '❌'));
  
  // Check window characteristics
  logToPage('Window outerHeight: ' + window.outerHeight);
  logToPage('Window innerHeight: ' + window.innerHeight);
  logToPage('Screen height: ' + screen.height);
  
  // Overall PWA status
  const isPWAInstalled = isStandalone || isFullscreen || isNavigatorStandalone;
  logToPage('PWA Installed: ' + (isPWAInstalled ? '✅' : '❌'));
  
  logToPage('Service Worker: ' + ('serviceWorker' in navigator ? '✅' : '❌'));
  logToPage('HTTPS: ' + (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? '✅' : '❌'));
  logToPage('Manifest: ' + (document.querySelector('link[rel="manifest"]') ? '✅' : '❌'));
  
  // Check if service worker is registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      logToPage('SW Registrations: ' + registrations.length);
      if (registrations.length > 0) {
        logToPage('SW State: ' + registrations[0].active?.state);
      }
    });
  }
  
  // Check manifest fetch
  fetch('./manifest.json')
    .then(response => {
      logToPage('Manifest response status: ' + response.status);
      logToPage('Manifest content-type: ' + response.headers.get('content-type'));
      if (response.ok) {
        logToPage('Manifest fetch: ✅');
        return response.json();
      } else {
        logToPage('Manifest fetch: ❌ (Status: ' + response.status + ')');
        throw new Error('Manifest fetch failed');
      }
    })
    .then(manifest => {
      if (manifest) {
        logToPage('Manifest start_url: ' + (manifest.start_url || 'undefined'));
        logToPage('Manifest scope: ' + (manifest.scope || 'undefined'));
        logToPage('Manifest name: ' + (manifest.name || 'undefined'));
        logToPage('Manifest display: ' + (manifest.display || 'undefined'));
      } else {
        logToPage('Manifest is null/undefined');
      }
    })
    .catch(err => {
      logToPage('Manifest error: ' + err.message);
      // Try alternative manifest fetch
      logToPage('Trying absolute path...');
      fetch('/manifest.json')
        .then(response => {
          if (response.ok) {
            logToPage('Absolute manifest fetch: ✅');
            return response.json();
          } else {
            logToPage('Absolute manifest fetch: ❌');
          }
        })
        .then(manifest => {
          if (manifest) {
            logToPage('Alt manifest scope: ' + (manifest.scope || 'undefined'));
          }
        })
        .catch(err2 => {
          logToPage('Alt manifest error: ' + err2.message);
        });
    });
  
  logToPage('=== Waiting for install prompt... ===');
}

// Run check when page loads
window.addEventListener('load', () => {
  setTimeout(checkPWACriteria, 1000); // Wait a bit for everything to load
});
