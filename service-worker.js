const CACHE_NAME_STATIC = 'dante-os-static-v21.2';
const CACHE_NAME_DYNAMIC = 'dante-os-dynamic-v21.2';

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

// Instalar el Service Worker y pre-cachear el Shell de la PWA
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y purgar cachés obsoletos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Doblada: Stale-While-Revalidate (Assets) & Network-First con Fallback Offline (APIs/Preguntas)
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // Excluir peticiones de no-GET o externas incompatibles
  if (event.request.method !== 'GET') return;

  // 1. ESTRATEGIA NETWORK FIRST WITH OFFLINE FALLBACK: Preguntas, APIs y Rutas dinámicas
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
            // Fallback sintético en caso de desconexión total
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

  // 2. ESTRATEGIA STALE-WHILE-REVALIDATE: Assets estáticos (HTML, CSS, JS, Fuentes, Manifest)
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

// 🔄 BACKGROUND SYNC Y RETENCIÓN DE RESPUESTAS OFFLINE
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-dante-responses') {
    event.waitUntil(sincronizarRespuestasEncoladas());
  }
});

async function sincronizarRespuestasEncoladas() {
  console.log("🔄 [PWA BACKGROUND SYNC]: Procesando cola de respuestas almacenadas offline...");
  // Notificar a clientes conectados para desencadenar sincronización local
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'DANTE_OFFLINE_SYNC_TRIGGER' });
  });
}
