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
  logToPage('Service Worker: ' + ('serviceWorker' in navigator ? '✅' : '❌'));
  logToPage('HTTPS: ' + (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? '✅' : '❌'));
  logToPage('Manifest: ' + (document.querySelector('link[rel="manifest"]') ? '✅' : '❌'));
  
  // Check if already installed
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    logToPage('Already installed: ✅');
  } else {
    logToPage('Already installed: ❌');
  }
  
  // Check if service worker is registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      logToPage('SW Registrations: ' + registrations.length);
    });
  }
  
  logToPage('=== Waiting for install prompt... ===');
}

// Run check when page loads
window.addEventListener('load', () => {
  setTimeout(checkPWACriteria, 1000); // Wait a bit for everything to load
});
