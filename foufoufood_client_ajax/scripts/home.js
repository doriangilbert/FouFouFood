import {getToken, getUserId} from './db.js';

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
                            registration.active.postMessage({type: 'INIT_SOCKET', clientId});
                        });

                        socket.on('notification', (data) => {
                            console.log('Notification reçue :', data);
                            registration.active.postMessage({type: 'notification', data});
                        });

                        socket.on('disconnect', () => {
                            console.log('Déconnecté du serveur');
                            registration.active.postMessage({type: 'status', message: 'Déconnecté du serveur'});
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

function fetchRestaurants(token) {
    fetch('http://localhost:3000/restaurants', {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`
        })
    })
        .then(response => response.json())
        .then(data => displayRestaurants(data))
        .catch(error => console.error('Erreur:', error));
}

// Fonction pour afficher les restaurants
function displayRestaurants(restaurants) {
    const restaurantList = document.getElementById("restaurant-list");
    restaurantList.innerHTML = ""; // Vide la liste existante

    restaurants.forEach(restaurant => {
        const restaurantBlock = document.createElement("div");

        // Changez "col-md-4" (3 colonnes par ligne) en "col-md-6" (2 colonnes par ligne)
        restaurantBlock.className = "col-md-6 col-sm-12 mb-4";

        restaurantBlock.innerHTML = `
            <div class="card h-100" role="button" tabindex="0">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">Adresse : ${restaurant.address}</p>
                    <p class="card-text">Cuisine : ${restaurant.cuisine}</p>
                </div>
            </div>
        `;

        // Fonction de navigation vers la page des détails
        function navigateToRestaurant() {
            window.location.href = `restaurant.html?id=${restaurant.id}`;
        }

        // Ajout des événements
        restaurantBlock.addEventListener("click", navigateToRestaurant);
        restaurantBlock.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                navigateToRestaurant();
            }
        });

        restaurantList.appendChild(restaurantBlock);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const token = await getToken();
    fetchRestaurants(token);
});

// Charger les restaurants au chargement de la page
document.addEventListener("DOMContentLoaded", fetchRestaurants);