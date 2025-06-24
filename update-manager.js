// Update Manager for PWA Auto-Updates
(function() {
    let refreshing = false;
    let updateNotificationShown = false;

    // App version information
    const APP_VERSION = '1.0.0'; // Update this when releasing new versions

    // Create and display the version number on the start screen
    function displayVersionNumber() {
        // Remove any existing version element
        const existingElement = document.getElementById('app-version-display');
        if (existingElement) {
            existingElement.remove();
        }
        
        const versionElement = document.createElement('div');
        versionElement.id = 'app-version-display';
        versionElement.textContent = `v${APP_VERSION}`;
        versionElement.style.position = 'fixed';
        versionElement.style.bottom = '5px';
        versionElement.style.right = '8px';
        versionElement.style.fontSize = '10px';
        versionElement.style.color = 'rgba(255, 255, 255, 0.5)';
        versionElement.style.padding = '2px 5px';
        versionElement.style.zIndex = '100';
        versionElement.style.fontFamily = 'monospace';
        versionElement.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.5)';
        versionElement.style.pointerEvents = 'none'; // Don't interfere with game interaction
        document.body.appendChild(versionElement);
        return versionElement;
    }

    // Display the version when the page loads
    window.addEventListener('load', () => {
        // Wait a moment to ensure game UI is initialized
        setTimeout(() => {
            displayVersionNumber();
        }, 1000);
    });
    
    // Update the version display on window resize (in case game layout changes)
    window.addEventListener('resize', () => {
        // Reset position and ensure visibility
        const versionElement = document.getElementById('app-version-display');
        if (versionElement) {
            // Just refresh the element to ensure proper positioning
            displayVersionNumber();
        }
    });

    // Create a toast notification element
    function createUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'app-update-toast';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.minWidth = '200px';
        notification.style.maxWidth = '90%';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';

        const message = document.createElement('span');
        message.textContent = 'New version available!';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginLeft = '15px';

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Update';
        refreshButton.style.backgroundColor = 'white';
        refreshButton.style.color = '#2196F3';
        refreshButton.style.border = 'none';
        refreshButton.style.padding = '5px 10px';
        refreshButton.style.borderRadius = '3px';
        refreshButton.style.cursor = 'pointer';

        refreshButton.addEventListener('click', function() {
            updateApp();
        });

        buttonContainer.appendChild(refreshButton);
        notification.appendChild(message);
        notification.appendChild(buttonContainer);
        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        return notification;
    }    // Function to update the app
    function updateApp() {
        if (refreshing) return;
        refreshing = true;
        
        // Update version display to show update in progress
        const versionElement = document.getElementById('app-version-display');
        if (versionElement) {
            versionElement.textContent = `v${APP_VERSION} (Updating...)`;
        }
        
        // Tell the service worker to skip waiting
        navigator.serviceWorker.controller?.postMessage('SKIP_WAITING');
        
        // Reload the page to get the new version
        setTimeout(() => {
            window.location.reload();
        }, 500); // Small delay to show the "Updating..." message
    }

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
        // When the service worker is updated, show a notification
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            console.log('[Client] Reloading page for updated service worker');
            window.location.reload();
        });

        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.type === 'UPDATE_AVAILABLE' && !updateNotificationShown) {
                updateNotificationShown = true;
                console.log('[Client] Received update available message');
                createUpdateNotification();
                
                // Also update the version display to indicate an update is available
                const versionElement = document.getElementById('app-version-display');
                if (versionElement) {
                    versionElement.textContent = `v${APP_VERSION} (Update available)`;
                    versionElement.style.color = 'rgba(33, 150, 243, 0.8)'; // Highlight in blue
                }
            }
        });

        // Periodically check for updates (every 60 minutes or when the app regains focus)
        let lastUpdateCheck = 0;
        const CHECK_INTERVAL = 60 * 60 * 1000; // 60 minutes

        function checkForUpdates() {
            // Don't check for updates when offline
            if (!navigator.onLine) {
                console.log('[Client] Skipping update check - device is offline');
                return;
            }

            const now = Date.now();
            if (now - lastUpdateCheck > CHECK_INTERVAL) {
                lastUpdateCheck = now;
                console.log('[Client] Checking for app updates...');
                navigator.serviceWorker.controller?.postMessage('CHECK_FOR_UPDATES');
            }
        }

        // Also listen for online/offline events to optimize behavior
        window.addEventListener('online', () => {
            console.log('[Client] Device is now online. Checking for updates...');
            // Small delay to ensure connectivity is stable
            setTimeout(checkForUpdates, 3000);
        });

        // Check when the app comes into focus
        window.addEventListener('focus', checkForUpdates);

        // And check periodically
        setInterval(checkForUpdates, CHECK_INTERVAL);

        // Also check once on load (but after a delay to not interfere with startup)
        window.addEventListener('load', () => {
            setTimeout(checkForUpdates, 10000);
        });
    }
})();
