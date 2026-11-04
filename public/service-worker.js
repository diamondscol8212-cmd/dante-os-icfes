// service-worker.js - PWA Offline & Shell Caching Manager (Dante OS Enterprise Gold v23.1.2-ENTERPRISE_GOLD)
// Bogotá, Colombia - Resiliencia de Red y Cumplimiento de Baja Conectividad

/**
 * @theory Offline-First Architecture Pattern - Resiliencia de red en zonas rurales y vulnerables
 * Estrategia de cacheado estático Stale-While-Revalidate y cola de sincronización offline
 * con idempotencia para telemetría neuro-conductual y contratos de Odiseo.
 */

const params = new URL(location).searchParams;
const BUILD_VERSION = params.get('v') || 'v23.1.3-LIVE_UPDATE';

const CACHE_NAME_STATIC = `dante-os-static-${BUILD_VERSION}`;
const CACHE_NAME_DYNAMIC = `dante-os-dynamic-${BUILD_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './perfil.html',
  './onboarding.html',
  './login.html',
  './reporte.html',
  './rector.html',
  './profesor.html',
  './js/danteHubEngine.js',
  './js/danteExamWorkspace.js',
  './js/preunEngine.js',
  './js/danteTutorEngine.js',
  './bancoPreguntas.json',
  './manifest.json'
];

// 1. INSTALACIÓN: Pre-cachear el App Shell de Dante OS
self.addEventListener('install', (event) => {
  console.log(`📦 [PWA SERVICE WORKER]: Instalando SW Dante OS ${BUILD_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVACIÓN: Purgar automáticamente cachés obsoletos
self.addEventListener('activate', (event) => {
  console.log(`🚀 [PWA SERVICE WORKER]: Activando SW Dante OS ${BUILD_VERSION}...`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC)
          .map((key) => {
            console.log(`🧹 [PWA SERVICE WORKER]: Purgando caché obsoleta -> ${key}`);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. INTERCEPCIÓN DE PETICIONES (FETCH):
// - Stale-While-Revalidate para recursos estáticos (HTML, CSS, JS, JSON).
// - Network-First con Fallback en Caché para llamadas de API y datos de examen.
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // Ignorar métodos no-GET (POST, PUT, DELETE se gestionan offline vía IndexedDB DanteOfflineStore)
  if (event.request.method !== 'GET') return;

  // ESTRATEGIA 1: NETWORK FIRST WITH CACHE FALLBACK para APIs y banco de preguntas
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
              message: "Modo Offline Activo: Operando con banco local y telemetría en caché IndexedDB." 
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // ESTRATEGIA 2: NETWORK FIRST WITH CACHE FALLBACK para HTML y JS (garantiza siempre la última versión en vivo)
  if (event.request.mode === 'navigate' || reqUrl.pathname.endsWith('.html') || reqUrl.pathname.endsWith('.js') || reqUrl.pathname === '/') {
    event.respondWith(
      fetch(new Request(event.request, { cache: 'no-store' }))
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ESTRATEGIA 3: STALE-WHILE-REVALIDATE para Assets estáticos (imágenes, iconos, fuentes)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      }).catch(() => {
        /* Fallback silencioso en red no disponible */
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. BACKGROUND SYNC API: Disparar sincronización al recuperar conectividad
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-dante-responses' || event.tag === 'sync-dante-telemetry') {
    console.log(`🔄 [PWA BACKGROUND SYNC]: Tag recibido [${event.tag}]. Notificando a los clientes...`);
    event.waitUntil(sincronizarRespuestasEncoladas());
  }
});

async function sincronizarRespuestasEncoladas() {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'DANTE_OFFLINE_SYNC_TRIGGER' });
  });
}

// 5. MENSAJERÍA DIRECTA CON CLIENTES DANTE OS
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_SYNC_NOW') {
    console.log("⚡ [PWA SERVICE WORKER]: Solicitud manual de sync recibida.");
    sincronizarRespuestasEncoladas();
  }
});
