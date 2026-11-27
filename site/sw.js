// Offline-first service worker: precache everything on install.
const CACHE = "secondclass-v3";
const FILES = [
  "./", "./index.html", "./styles.css", "./app.js", "./learn.js", "./bank.js", "./engine.js",
  "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-180.png",
  "./fonts/atkinson-hyperlegible-latin-400-normal.woff2", "./fonts/atkinson-hyperlegible-latin-700-normal.woff2", "./fonts/marcellus-latin-400-normal.woff2",
  "./img/burn.svg", "./img/compass.svg", "./img/cpr.svg", "./img/dipper.svg", "./img/eye.svg", "./img/firelays.svg", "./img/firewood.svg", "./img/heat.svg", "./img/hypothermia.svg", "./img/mapsymbols.svg", "./img/pressure.svg", "./img/shadowstick.svg", "./img/shock.svg", "./img/stroke.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll())
      .then((cs) => cs.forEach((c) => c.postMessage("cached")))
  );
});

// Cache first, then network; update the cache in the background when online.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      const net = fetch(e.request).then((res) => {
        const u = new URL(e.request.url);
        // Same-origin files, plus photos from Wikimedia (kept for offline use).
        if (res && ((res.ok && u.origin === location.origin) || /(^|\.)wikimedia\.org$/.test(u.hostname))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit || caches.match("./index.html"));
      return hit || net;
    })
  );
});
