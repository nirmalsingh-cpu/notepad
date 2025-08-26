'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration(): React.JSX.Element | null {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, refresh the page
                  if (confirm('A new version of Lummu is available. Refresh now?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          if (confirm('A new version of Lummu is ready. Restart now?')) {
            window.location.reload();
          }
        }
      });
    }

    // Register for background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Register background sync with type assertion since sync is not in default types
        const syncRegistration = registration as ServiceWorkerRegistration & {
          sync: { register: (tag: string) => Promise<void> };
        };
        if (syncRegistration.sync) {
          return syncRegistration.sync.register('background-sync');
        }
      }).catch((error) => {
        console.log('Background sync registration failed:', error);
      });
    }
  }, []);
