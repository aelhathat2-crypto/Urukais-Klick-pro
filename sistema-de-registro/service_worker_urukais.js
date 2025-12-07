/**
 * SERVICE WORKER - URUKAIS KLICK PERFORMANCE OPTIMIZATION
 * Desarrollado por: MiniMax Agent
 * Fecha: 2025-11-16
 * 
 * Funcionalidades:
 * - Cache offline inteligente
 * - Actualizaciones en background
 * - Notificaciones push
 * - Sincronización de datos
 * - Optimización de imágenes
 */

// Configuración del Service Worker
const CACHE_NAME = 'urukais-klick-v1.2.0';
const CACHE_VERSION = '1.2.0';

// URLs que se cachean inmediatamente (precaching)
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/imagenes/urukais-main.webp',
  '/imagenes/ecosistema-alforja.webp',
  '/css/sistema_diseno_urukais_klick.css',
  '/css/iconos_urukais_utilities.css',
  '/js/performance-optimization.js',
  '/js/lazy-loading.js'
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Configuración de cache por tipo de recurso
const CACHE_CONFIG = {
  images: {
    maxEntries: 100,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    strategy: CACHE_STRATEGIES.CACHE_FIRST
  },
  api: {
    maxEntries: 50,
    maxAge: 5 * 60 * 1000, // 5 minutos
    strategy: CACHE_STRATEGIES.NETWORK_FIRST
  },
  static: {
    maxEntries: 200,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
    strategy: CACHE_STRATEGIES.CACHE_FIRST
  },
  html: {
    maxEntries: 20,
    maxAge: 60 * 60 * 1000, // 1 hora
    strategy: CACHE_STRATEGIES.NETWORK_FIRST
  }
};

// URLs de API y recursos críticos
const API_URLS = [
  '/api/urukais',
  '/api/ubicaciones',
  '/api/proyectos',
  '/api/estadisticas'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker instalando...');
  
  event.waitUntil(
    Promise.all([
      // Precache de recursos críticos
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Precaching recursos críticos...');
        return cache.addAll(PRECACHE_URLS);
      }),
      // Skip waiting para activar inmediatamente
      self.skipWaiting()
    ])
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      cleanupOldCaches(),
      // Tomar control inmediato
      self.clients.claim(),
      // Notificar a los clientes sobre la activación
      notifyClientsOfActivation()
    ])
  );
});

// Interceptar requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo interceptar requests del mismo origen
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Determinar estrategia de cache basada en el tipo de recurso
  const cacheStrategy = getCacheStrategy(request);
  
  event.respondWith(handleRequest(request, cacheStrategy));
});

// Estrategias de cache
async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cache);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cache);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cache);
      
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request, cache);
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
      
    default:
      return fetch(request);
  }
}

// Cache First: Busca en cache primero, luego en red
async function cacheFirst(request, cache) {
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Actualizar en background
    updateInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return getOfflineFallback(request);
  }
}

// Network First: Busca en red primero, luego en cache
async function networkFirst(request, cache) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

// Stale While Revalidate: Sirve del cache y actualiza en background
async function staleWhileRevalidate(request, cache) {
  const cachedResponse = await cache.match(request);
  
  // Fetch en background para actualizar cache
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Retornar cache inmediatamente si está disponible
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Esperar por la red si no hay cache
  return fetchPromise || getOfflineFallback(request);
}

// Cache Only: Solo desde cache
async function cacheOnly(request, cache) {
  const cachedResponse = await cache.match(request);
  return cachedResponse || getOfflineFallback(request);
}

// Network Only: Solo desde red
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return getOfflineFallback(request);
  }
}

// Determinar estrategia de cache basada en el tipo de recurso
function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // API calls
  if (pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // Imágenes
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // CSS y JavaScript
  if (pathname.match(/\.(css|js)$/i)) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // HTML
  if (pathname.endsWith('.html') || pathname === '/') {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // Por defecto, network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// Actualización en background
function updateInBackground(request, cache) {
  fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response);
    }
  }).catch(() => {
    // Silenciar errores de actualización en background
  });
}

// Página offline como fallback
function getOfflineFallback(request) {
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }
  
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0a0e27"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b46c1" font-family="Arial" font-size="14">Imagen no disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Recurso no disponible', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Limpiar caches antiguos
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => name !== CACHE_NAME);
  
  return Promise.all(
    oldCaches.map(name => {
      console.log('🗑️ Eliminando cache antiguo:', name);
      return caches.delete(name);
    })
  );
}

// Notificar a los clientes sobre la activación
async function notifyClientsOfActivation() {
  const clients = await self.clients.matchAll();
  
  return Promise.all(
    clients.map(client => {
      return client.postMessage({
        type: 'SW_ACTIVATED',
        version: CACHE_VERSION
      });
    })
  );
}

// Mensajes del cliente
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      // Cachear URLs específicas
      cacheUrls(payload.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearCache();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ status });
      });
      break;
  }
});

// Cachear URLs específicas
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  
  return Promise.all(
    urls.map(url => {
      return fetch(url).then(response => {
        if (response.ok) {
          return cache.put(url, response);
        }
      }).catch(() => null);
    })
  );
}

// Limpiar todo el cache
async function clearCache() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map(name => caches.delete(name)));
}

// Obtener tamaño del cache
async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  let totalSize = 0;
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}

// Obtener estado del cache
async function getCacheStatus() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  return {
    totalEntries: requests.length,
    version: CACHE_VERSION,
    cacheName: CACHE_NAME,
    urls: requests.map(request => request.url)
  };
}

// Background Sync para submissions offline
self.addEventListener('sync', event => {
  if (event.tag === 'urukais-sighting-submission') {
    event.waitUntil(submitOfflineSightings());
  }
});

// Enviar avistamientos offline cuando se restaure la conectividad
async function submitOfflineSightings() {
  const db = await openIndexedDB();
  const transactions = await db.getAll('offlineSightings');
  
  for (const transaction of transactions) {
    try {
      const response = await fetch('/api/avistamientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction.data)
      });
      
      if (response.ok) {
        await db.delete('offlineSightings', transaction.id);
        console.log('✅ Avistamiento enviado:', transaction.id);
      }
    } catch (error) {
      console.log('❌ Error enviando avistamiento:', error);
    }
  }
}

// IndexedDB para datos offline
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('urukais-offline-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('offlineSightings')) {
        const store = db.createObjectStore('offlineSightings', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nuevo contenido de Urukais Klick disponible',
    icon: '/imagenes/urukais-icon-192.png',
    badge: '/imagenes/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorar',
        icon: '/imagenes/action-explore.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/imagenes/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Urukais Klick', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Click en la notificación principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🌟 Service Worker Urukais Klick cargado correctamente');