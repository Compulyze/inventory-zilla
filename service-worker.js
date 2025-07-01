self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('inventory-zilla-cache').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './app.js',
        './manifest.json',
        './lib/qrcode.min.js',
        './lib/html5-qrcode.min.js',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
