self.addEventListener('install', function(e) {
  console.log('📦 Service Worker Installed');
  e.waitUntil(
    caches.open('elevate-store-v1').then(function(cache) {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});