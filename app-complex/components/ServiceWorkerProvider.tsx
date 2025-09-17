'use client';

import { useEffect } from 'react';

export default function ServiceWorkerProvider() {
  const registerServiceWorker = async () => {
    try {
      console.log('[SW] Registering service worker...');

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[SW] Service worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          console.log('[SW] New service worker found, installing...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log(
                  '[SW] New content is available, will be used when all tabs are closed.'
                );
                // Could show a notification to user about update
                showUpdateAvailableNotification();
              } else {
                console.log('[SW] Content is cached for offline use.');
                showOfflineReadyNotification();
              }
            }
          });
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[SW] Message from service worker:', event.data);

        if (event.data?.type === 'CACHE_UPDATED') {
          // Handle cache update
          console.log('[SW] Cache has been updated');
        }
      });
    } catch (error) {
      console.error('[SW] Service worker registration failed:', error);
    }
  };

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      registerServiceWorker();
    }
  }, [registerServiceWorker]);

  const showUpdateAvailableNotification = () => {
    // You could show a toast notification here
    console.log('[SW] Update available - will be applied on next page refresh');
  };

  const showOfflineReadyNotification = () => {
    // You could show a toast notification here
    console.log('[SW] App is ready to work offline');
  };

  return null; // This component doesn't render anything
}

// Utility functions for offline support
export const isOnline = () => {
  return typeof window !== 'undefined' ? navigator.onLine : true;
};

export const addToOfflineQueue = async (data: any) => {
  if (
    'serviceWorker' in navigator &&
    'sync' in window.ServiceWorkerRegistration.prototype
  ) {
    try {
      // Store data in IndexedDB for background sync
      const db = await openOfflineDB();
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');

      await store.add({
        payload: data,
        timestamp: Date.now(),
      });

      await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });

      // Register for background sync (if supported)
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (registration as any).sync.register('analytics-sync');
        }
      } catch (syncError) {
        console.warn('[SW] Background sync not supported:', syncError);
      }

      console.log('[SW] Data queued for background sync');
    } catch (error) {
      console.error('[SW] Failed to queue data for offline sync:', error);
    }
  }
};

// Helper function to open IndexedDB
const openOfflineDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('analytics-queue', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('queue')) {
        const store = db.createObjectStore('queue', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
};
