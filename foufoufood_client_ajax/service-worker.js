// Nom du cache
const CACHE_NAME = 'foufoufood-cache-v1';

// URLs des ressources à mettre en cache
const urlsToCache = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

// Événement d'installation : mise en cache des ressources
self.addEventListener('install', event => {
    console.log('Service Worker installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching files');
                return cache.addAll(urlsToCache)
                    .catch(error => {
                        console.error('Failed to cache:', error);
                    });
            })
    );
    self.skipWaiting(); // Forcer l'activation immédiate
});

// Événement d'activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
    console.log('Service Worker activé');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Suppression du cache obsolète :', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Prendre le contrôle des pages immédiatement
});

// Événement fetch : intercepte les requêtes réseau
self.addEventListener('fetch', event => {
    console.log('Requête interceptée pour :', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourne la ressource depuis le cache ou fait une requête réseau
                return response || fetch(event.request);
            })
    );
});