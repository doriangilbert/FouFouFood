import {getToken} from './db.js';

// Récupérer l'ID depuis l'URL
function getRestaurantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
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
                    <p class="card-title">${menuItem.description}</p>
                    <p class="card-text">Adresse : ${menuItem.price}$</p>
                </div>
            </div>
        `;
        // ajout de bouton pour valider notre ajout de menu dans le panier
        menuBlock.innerHTML += `
            <div class="card-footer">
                <div class="input-group">
                    <input type="number" id="menuQuantity_${menuItem._id}" class="form-control" value="1" min="1" max="10">
                    <button id="validateButton_${menuItem._id}" class="btn btn-primary">Ajouter au panier</button>
                </div>
            </div>
        `;

        menuList.appendChild(menuBlock);

        // Ajout de l'événement au bouton de validation
        const validateButton = document.getElementById(`validateButton_${menuItem._id}`);
        const quantityInput = document.getElementById(`menuQuantity_${menuItem._id}`);

        validateButton.addEventListener("click", (event) => {
            event.stopPropagation();  // Empêche la propagation de l'événement
            event.preventDefault();  // Empêche toute navigation ou comportement par défaut

            // Réinitialiser la valeur du champ de quantité à 1
            quantityInput.value = 1;
            console.log(`Quantité pour "${menuItem.name}" réinitialisée à 1`);
        });

        quantityInput.addEventListener("click", (event) => {
            event.stopPropagation();  // Empêche la propagation de l'événement
        });

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