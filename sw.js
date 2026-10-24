// Naikkan versi ini tiap kali ada perubahan file supaya perangkat ambil versi baru.
const CACHE = 'gajian-v7';
const FILES = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network dulu (biar selalu versi terbaru), fallback ke cache kalau offline.
// Request ke Supabase (API/login/realtime) nggak pernah di-cache.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const ours = url.origin === location.origin || url.hostname === 'cdn.jsdelivr.net';
  if (e.request.method !== 'GET' || !ours) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
