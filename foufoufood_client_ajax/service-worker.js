const CACHE_NAME = 'foufoufood-cache-v1';

// URLs des ressources à mettre en cache
const urlsToCache = [];

// Événement d'installation : mettre en cache les ressources
self.addEventListener('install', (event) => {
    console.log('Service Worker installé');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Mise en cache des ressources');
            return cache.addAll(urlsToCache);
        }).catch((error) => {
            console.error('Échec de la mise en cache :', error);
        })
    );
    self.skipWaiting(); // Forcer l'activation immédiate
});

// Événement d'activation : nettoyer les anciens caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activé');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache :', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Prendre le contrôle des pages immédiatement
});

// Événement de fetch : intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
    console.log('Interception de la requête pour :', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch((error) => {
                console.error('Échec de la récupération :', error);
                throw error;
            });
        })
    );
});