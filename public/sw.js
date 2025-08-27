const CACHE_NAME = "pmkp-v1.0.0";
const STATIC_CACHE = "pmkp-static-v1.0.0";
const DYNAMIC_CACHE = "pmkp-dynamic-v1.0.0";

// Files to cache immediately
const STATIC_FILES = ["/", "/index.html", "/static/js/bundle.js", "/static/css/main.css", "/manifest.json", "/favicon.ico", "/logo192.png", "/logo512.png"];

// Install event - cache static files
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log("Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .catch(error => {
        console.error("Error caching static files:", error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same origin requests
    event.respondWith(handleSameOriginRequest(request));
  } else if (url.origin.includes("firebase")) {
    // Firebase requests - always go to network
    event.respondWith(handleFirebaseRequest(request));
  } else {
    // External requests - cache first
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle same origin requests
async function handleSameOriginRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.destination === "document") {
      return caches.match("/");
    }

    throw error;
  }
}

// Handle Firebase requests
async function handleFirebaseRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // For Firebase requests, we don't cache, just return error
    throw error;
  }
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Then try network
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return a fallback response
    return new Response("Offline content not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Background sync for offline messages
self.addEventListener("sync", event => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncMessages());
  }
});

// Sync offline messages when connection is restored
async function syncMessages() {
  try {
    // Get offline messages from IndexedDB
    const offlineMessages = await getOfflineMessages();

    // Send them to the server
    for (const message of offlineMessages) {
      try {
        await sendMessage(message);
        await removeOfflineMessage(message.id);
      } catch (error) {
        console.error("Failed to sync message:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Helper functions for IndexedDB operations
async function getOfflineMessages() {
  // This would be implemented with IndexedDB
  return [];
}

async function sendMessage(message) {
  // This would send the message to Firebase
  return fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function removeOfflineMessage(messageId) {
  // This would remove the message from IndexedDB
  return Promise.resolve();
}

// Push notification handling
self.addEventListener("push", event => {
  const options = {
    body: event.data ? event.data.text() : "New message received",
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Message",
        icon: "/logo192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/logo192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("PMKP", options));
});

// Notification click handling
self.addEventListener("notificationclick", event => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
