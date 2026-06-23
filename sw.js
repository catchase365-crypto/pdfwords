var C='v_1782231911004';
var assets = ['./', './index.html', './manifest.json', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(assets)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== C && caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  let requestToFetch = e.request;
  if (e.request.mode === 'navigate') {
    requestToFetch = new Request(e.request, { cache: 'reload' });
  }
  e.respondWith(
    fetch(requestToFetch)
      .then(res => {
        if (res && res.status === 200) {
          var resClone = res.clone();
          caches.open(C).then(c => c.put(e.request, resClone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || new Response('Offline', { status: 503 })))
  );
});