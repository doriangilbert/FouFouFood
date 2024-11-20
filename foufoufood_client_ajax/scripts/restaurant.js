import {getToken} from './db.js';

// Récupérer l'ID depuis l'URL
function getRestaurantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log("ID récupéré depuis l'URL :", id); // Vérifiez ici
    return id;
}

function fetchRestaurantAndMenus(token, restaurantId) {
    // Effectuer les deux requêtes en parallèle
    Promise.all([
        fetch(`http://localhost:3000/restaurants/${restaurantId}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        }).then(response => response.json()),

        fetch(`http://localhost:3000/restaurants/${restaurantId}/menuitems`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        }).then(response => response.json())
    ])
        .then(([restaurantData, menuData]) => {
            // Appeler displayRestaurantDetails avec les deux jeux de données
            displayRestaurantDetails(restaurantData, menuData);
        })
        .catch(error => console.error('Erreur:', error));
}

// Mettre à jour le DOM avec les informations du restaurant
function displayRestaurantDetails(restaurant, menus) {
    // Remplir les informations principales
    document.getElementById("restaurant-name").textContent = restaurant.name;
    document.getElementById("restaurant-address").textContent = `Adresse : ${restaurant.address}`;
    document.getElementById("restaurant-cuisine").textContent = `Cuisine : ${restaurant.cuisine}`;

    // Générer les blocs pour les menus
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = ""; // Vide la liste existante

    menus.forEach(menuItem => {
        const menuBlock = document.createElement("div");

        menuBlock.className = "col-md-6 col-sm-12 mb-4";

        menuBlock.innerHTML = `
            <div class="card h-100" role="button" tabindex="0">
                <div class="card-body">
                    <h5 class="card-title">${menuItem.name}</h5>
                    <p class="card-text">Adresse : ${menuItem.price}$</p>
                </div>
            </div>
        `;

        menuList.appendChild(menuBlock);

    function navigateToMenu() {
        window.location.href = `menu.html?id=${menuItem._id}`;
    }

    // Ajout des événements
    menuBlock.addEventListener("click", navigateToMenu);
    menuBlock.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            navigateToMenu();
        }
    });

    menuList.appendChild(menuBlock);
    });
}

// Chargement initial de la page
document.addEventListener('DOMContentLoaded', async function () {
    const token = await getToken();
    const restaurantId = getRestaurantIdFromUrl();

    fetchRestaurantAndMenus(token, restaurantId);
});

// Charger les restaurants au chargement de la page
document.addEventListener("DOMContentLoaded", fetchRestaurantAndMenus);