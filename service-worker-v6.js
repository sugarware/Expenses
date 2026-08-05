const CACHE_NAME = "traffic-expense-pwa-v6-new-icon";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest-v6.webmanifest",
  "./icons/expense-icon-180-v6.png",
  "./icons/expense-icon-192-v6.png",
  "./icons/expense-icon-512-v6.png",
  "./icons/favicon-32-v6.png",
  "./icons/favicon-16-v6.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(hit => hit || caches.match("./index.html")))
  );
});
