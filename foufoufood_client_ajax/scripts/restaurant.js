import {getToken, storeCartItem, storeSelectedRestaurantId, getSelectedRestaurantId} from './db.js';

const spinner = document.getElementById('loading-spinner');

// Récupérer l'ID depuis l'URL
function getRestaurantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

async function fetchRestaurantAndMenus(token, restaurantId) {
    if (!restaurantId) {
        console.error('Restaurant ID is undefined');
        return;
    }

    spinner.style.display = 'block'; // Display spinner while fetching data

    const cache = await caches.open('foufoufood-cache-v1');
    const restaurantRequest = new Request(`http://localhost:3000/restaurants/${restaurantId}`, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`
        })
    });
    const menuRequest = new Request(`http://localhost:3000/restaurants/${restaurantId}/menuitems`, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`
        })
    });

    try {
        const [restaurantResponse, menuResponse] = await Promise.all([
            fetch(restaurantRequest),
            fetch(menuRequest)
        ]);

        const restaurantResponseClone = restaurantResponse.clone();
        const menuResponseClone = menuResponse.clone();

        const [restaurantData, menuData] = await Promise.all([
            restaurantResponseClone.json(),
            menuResponseClone.json()
        ]);

        displayRestaurantDetails(restaurantData, menuData);

        await cache.put(restaurantRequest, restaurantResponse);
        await cache.put(menuRequest, menuResponse);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);

        const cachedRestaurantResponse = await cache.match(restaurantRequest);
        const cachedMenuResponse = await cache.match(menuRequest);

        if (cachedRestaurantResponse && cachedMenuResponse) {
            const [cachedRestaurantData, cachedMenuData] = await Promise.all([
                cachedRestaurantResponse.json(),
                cachedMenuResponse.json()
            ]);
            displayRestaurantDetails(cachedRestaurantData, cachedMenuData);
        } else {
            console.error('Aucune donnée en cache disponible');
        }
    } finally {
        spinner.style.display = 'none'; // Hide spinner after fetching data
    }
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

        validateButton.addEventListener("click", async (event) => {
            event.stopPropagation();  // Prevent event propagation
            event.preventDefault();  // Prevent default behavior

            // Check if the restaurant ID is already stored
            const storedRestaurantId = await getSelectedRestaurantId();
            if (!storedRestaurantId) {
                // Store the restaurant ID if it's the first item
                await storeSelectedRestaurantId(menuItem.restaurantId);
            }

            // Add the menu item and quantity to the cart
            storeCartItem(menuItem._id, quantityInput.value);

            // Reset the quantity input field to 1
            quantityInput.value = 1;
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

    if (restaurantId) {
        await fetchRestaurantAndMenus(token, restaurantId);
    } else {
        console.error('ID du restaurant non défini');
    }
});

// Charger les restaurants au chargement de la page
document.addEventListener("DOMContentLoaded", fetchRestaurantAndMenus);