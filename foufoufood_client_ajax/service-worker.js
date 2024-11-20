const CACHE_NAME = 'foufoufood-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/home.html',
    '/login.html',
    '/register.html',
    '/navbar.html',
    '/profile.html',
    '/restaurant.html',
    '/menu.html',
    '/styles/main.css',
    '/styles/home.css',
    '/styles/restaurant.css',
    '/scripts/db.js',
    '/scripts/home.js',
    '/scripts/main.js',
    '/scripts/navbar.js',
    '/scripts/notifications.js',
    '/scripts/profile.js',
    '/scripts/login.js',
    '/scripts/register.js',
    '/scripts/restaurant.js',
    '/images/app-favicon.svg',
    '/images/notification-favicon.svg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.socket.io/4.0.0/socket.io.min.js'
];

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
    self.skipWaiting();
});

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
    self.clients.claim();
});

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

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INIT_SOCKET') {
        console.log(`Socket initialized for client ID: ${event.data.clientId}`);
    } else if (event.data && event.data.type === 'notification') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ type: 'notification', data: event.data.data }));
        });
    } else if (event.data && event.data.type === 'status') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ type: 'status', message: event.data.message }));
        });
    }
});