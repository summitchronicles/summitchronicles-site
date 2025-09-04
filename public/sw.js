// Summit Chronicles Service Worker
// Provides offline content caching for better UX

const CACHE_NAME = 'summit-chronicles-v1';
const OFFLINE_URL = '/offline';

// Essential assets to cache for offline use
const ESSENTIAL_ASSETS = [
  '/',
  '/expeditions',
  '/training',
  '/gear',
  '/blog',
  '/ask',
  '/offline',
  '/_next/static/css/',
  '/_next/static/js/',
];

// Dynamic content patterns to cache
const CACHE_PATTERNS = [
  /\/_next\/static\/.*/,
  /\/api\/strava\/recent/,
  /\/api\/ask/,
  /\.(?:js|css|woff2|png|jpg|jpeg|svg)$/
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching essential assets');
      return cache.addAll(ESSENTIAL_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch((error) => {
      console.error('[SW] Failed to cache essential assets:', error);
    })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome extensions
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle navigation requests (page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to offline page
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Handle API requests - Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached version
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving cached API response for:', request.url);
              return cachedResponse;
            }
            // Return offline response for failed API calls
            return new Response(
              JSON.stringify({ 
                error: 'Offline - Please check your connection',
                offline: true 
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  // Handle static assets - Cache first strategy
  const shouldCache = CACHE_PATTERNS.some(pattern => pattern.test(request.url));
  
  if (shouldCache) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fetch and cache if not found
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Handle background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    console.log('[SW] Background sync: analytics-sync');
    event.waitUntil(syncAnalytics());
  }
});

// Background sync function for analytics
async function syncAnalytics() {
  try {
    // Get pending analytics data from IndexedDB
    const db = await openDB('analytics-queue', 1);
    const tx = db.transaction('queue', 'readwrite');
    const store = tx.objectStore('queue');
    const pendingData = await store.getAll();
    
    // Send each pending request
    for (const data of pendingData) {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.payload)
        });
        
        // Remove from queue on success
        await store.delete(data.id);
      } catch (error) {
        console.error('[SW] Failed to sync analytics data:', error);
      }
    }
    
    await tx.complete;
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Helper function to open IndexedDB
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        const store = db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      // If Summit Chronicles is already open, focus it
      for (const client of clients) {
        if (client.url.includes('summitchronicles') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

console.log('[SW] Summit Chronicles service worker loaded');