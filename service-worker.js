const CACHE_NAME = 'dante-os-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y congelar el chasis visual
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Red con Fallback Inmediato a Caché
self.addEventListener('fetch', (e) => {
  // Ignorar peticiones externas de Supabase para no bloquear los datos frescos
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Si hay red, clonar la respuesta en el caché
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => caches.match(e.request)) // Si falla el internet, usar el chasis congelado
  );
});