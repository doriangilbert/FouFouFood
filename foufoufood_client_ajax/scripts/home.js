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