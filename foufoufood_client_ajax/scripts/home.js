import { getUserId } from './db.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const clientId = await getUserId();
            navigator.serviceWorker.register('service-worker.js', {scope: '/'})
                .then(registration => {
                    console.log('Service Worker enregistré : ', registration);
                    navigator.serviceWorker.ready.then(() => {
                        const socket = io('http://localhost:8080/');

                        socket.on('connect', () => {
                            console.log('Connecté au serveur');
                            socket.emit('register', clientId);
                            registration.active.postMessage({ type: 'INIT_SOCKET', clientId });
                        });

                        socket.on('notification', (data) => {
                            console.log('Notification reçue :', data);
                            registration.active.postMessage({ type: 'notification', data });
                        });

                        socket.on('disconnect', () => {
                            console.log('Déconnecté du serveur');
                            registration.active.postMessage({ type: 'status', message: 'Déconnecté du serveur' });
                        });
                    });
                })
                .catch(err => {
                    console.error('Erreur d\'enregistrement du Service Worker : ', err);
                });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID utilisateur : ', error);
        }
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'status') {
            document.getElementById('status').innerText = event.data.message;
        } else if (event.data.type === 'notification') {
            const data = event.data.data;
            const options = {
                body: '',
                icon: '../images/notification-favicon.svg',
                data: data
            };

            if (data.type === 'ORDER_STATUS_CHANGED') {
                options.body = `Statut de la commande mis à jour : \nID de la commande : ${data.order._id}\nDate de la commande : ${new Date(data.order.createdAt).toLocaleString()}\nNom du restaurant : ${data.restaurant.name}\nStatut : ${data.order.status}`;
            } else if (data.type === 'ORDER_ASSIGNED') {
                options.body = `Commande assignée : \nID de la commande : ${data.order._id}\nDate de la commande : ${new Date(data.order.createdAt).toLocaleString()}\nNom du restaurant : ${data.restaurant.name}\nAdresse du restaurant : ${data.restaurant.address}\nAdresse de livraison : ${data.order.deliveryAddress}`;
            } else if (data.type === 'ORDER_CREATED') {
                options.body = `Placement de commande confirmé : \nID de la commande : ${data.order._id}\nDate de la commande : ${new Date(data.order.createdAt).toLocaleString()}\nNom du restaurant : ${data.restaurant.name}\nAdresse de livraison : ${data.order.deliveryAddress}`;
            } else if (data.type === 'ORDER_UPDATED') {
                options.body = `Commande mise à jour : \nID de la commande : ${data.order._id}\nDate de la commande : ${new Date(data.order.createdAt).toLocaleString()}\nNom du restaurant : ${data.restaurant.name}\nStatut : ${data.order.status}`;
            } else {
                options.body = `Notification reçue : \nType : ${data.type}\nDétails : ${JSON.stringify(data)}`;
            }

            if (Notification.permission === 'granted') {
                new Notification('Notification FouFouFood', options);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Notification FouFouFood', options);
                    }
                });
            }
        }
    });
}