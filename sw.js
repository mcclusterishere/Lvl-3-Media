const BASE = "/Lvl-3-Media/";
const CACHE = "level3-pages-v3";
const APP_SHELL = [BASE, `${BASE}l3-skin.css`, `${BASE}l3-enhance.js`, `${BASE}manifest.webmanifest`, `${BASE}favicon.svg`, `${BASE}icon-192.png`, `${BASE}icon-512.png`];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (request.mode === "navigate") {
    /* Cache each page under its OWN url. This used to store every
       navigation under BASE, so opening the studio desk overwrote the
       cached home page with dashboard HTML — and the next flaky-network
       navigation to any page served back whichever page was cached last. */
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then((hit) => hit || caches.match(BASE))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
