// service-worker.js - PWA Offline & Shell Caching Manager (Dante OS Enterprise Gold)
// Bogotá, Colombia

// Extract dynamic version from registration URL query parameter or fallback
const params = new URL(location).searchParams;
const BUILD_VERSION = params.get('v') || 'v21.2.4-ENTERPRISE_GOLD';

const CACHE_NAME_STATIC = `dante-os-static-${BUILD_VERSION}`;
const CACHE_NAME_DYNAMIC = `dante-os-dynamic-${BUILD_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './onboarding.html',
  './login.html',
  './reporte.html',
  './rector.html',
  './profesor.html',
  './bancoPreguntas.json',
  './manifest.json'
];

// 1. Instalar el Service Worker y pre-cachear el Shell de la PWA
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activar y PURGAR AUTOMÁTICAMENTE cachés obsoletos con filtro explícito de promesas (Estructura AAA+)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC)
          .map((key) => {
            console.log(`🧹 [PWA SERVICE WORKER]: Eliminando caché obsoleta -> ${key}`);
            return caches.delete(key);
          })
      );
    }).then(() => self.skipWaiting())
  );
});

// 3. Estrategia Doblada: Stale-While-Revalidate (Assets) & Network-First con Fallback Offline (APIs/Preguntas)
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // Excluir peticiones de no-GET o externas incompatibles
  if (event.request.method !== 'GET') return;

  // ESTRATEGIA 1: NETWORK FIRST WITH OFFLINE FALLBACK para APIs y JSONs dinámicos
  if (reqUrl.pathname.includes('/api/') || reqUrl.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME_DYNAMIC).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return new Response(JSON.stringify({ 
              offline: true, 
              message: "Modo Offline Activo: Operando con banco local en caché." 
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // ESTRATEGIA 2: STALE-WHILE-REVALIDATE para Assets estáticos
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      }).catch(() => {/* Red no disponible, retorno suave */});

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. BACKGROUND SYNC Y RETENCIÓN DE RESPUESTAS OFFLINE
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-dante-responses') {
    event.waitUntil(sincronizarRespuestasEncoladas());
  }
});

async function sincronizarRespuestasEncoladas() {
  console.log("🔄 [PWA BACKGROUND SYNC]: Procesando cola de respuestas almacenadas offline...");
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'DANTE_OFFLINE_SYNC_TRIGGER' });
  });
}
