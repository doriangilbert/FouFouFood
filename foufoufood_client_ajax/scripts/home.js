import {getToken} from './db.js';

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
            window.location.href = `restaurant.html?id=${restaurant._id}`;
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