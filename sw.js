const CACHE_NAME = 'dev-cheatsheets-v7';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/modules/paths.js',
  './assets/js/modules/data-loader.js',
  './assets/js/modules/i18n.js',
  './assets/js/modules/interactions.js',
  './assets/js/modules/render.js',
  './assets/js/modules/state.js',
  './assets/brands/git.svg',
  './assets/brands/docker.svg',
  './assets/data/sections.json',
  './assets/data/git.en.json',
  './assets/data/git.es.json',
  './assets/data/git.fr.json',
  './assets/data/git.it.json',
  './assets/data/docker.en.json',
  './assets/data/ui.json',
  './assets/favicon.svg',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

function isOurOrigin(url) {
  return url.origin === self.location.origin;
}

/** Always hit network first so code + JSON updates are not stuck behind stale cache. */
function isNetworkFirstAsset(url) {
  if (!isOurOrigin(url)) return false;
  const p = url.pathname;
  if (p.includes('/assets/data/') && p.endsWith('.json')) return true;
  if (p.includes('/assets/js/') && p.endsWith('.js')) return true;
  if (p.includes('/assets/brands/') && p.endsWith('.svg')) return true;
  return false;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[sw] skip cache add:', url, err?.message ?? err);
          }),
        ),
      );
      await self.skipWaiting();
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (isNetworkFirstAsset(url)) {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          if (networkRes.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkRes.clone());
            });
          }
          return networkRes;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request).then((fetchRes) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (
              fetchRes.ok &&
              (isOurOrigin(url) ||
                event.request.url.includes('fonts.googleapis.com') ||
                event.request.url.includes('fonts.gstatic.com'))
            ) {
              cache.put(event.request, fetchRes.clone());
            }
            return fetchRes;
          });
        })
      );
    }).catch(() => {
      if (event.request.url.indexOf('.html') > -1) {
        return caches.match('./index.html');
      }
    }),
  );
});
