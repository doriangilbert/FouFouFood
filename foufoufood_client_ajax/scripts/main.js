import { getToken } from './db.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js', {scope: '/'})
            .then(registration => {
                console.log('Service Worker enregistré : ', registration);
            })
            .catch(err => {
                console.error('Erreur d\'enregistrement du Service Worker : ', err);
            });
    });
}

const token = await getToken();
console.log('Token:', token); // Add this line to check the token
if (!token && !['/index.html', '/login.html', '/register.html'].includes(window.location.pathname)) {
    window.location.href = 'index.html'; // Redirect to index.html if no token is found
}