import {getToken} from './db.js';

const spinner = document.getElementById('loading-spinner');

async function fetchRestaurants(token) {
    spinner.style.display = 'block'; // Display spinner while fetching data

    const cache = await caches.open('foufoufood-cache-v1');
    const cacheKey = new Request('http://localhost:3000/restaurants', {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`
        })
    });

    try {
        const response = await fetch(cacheKey);
        const responseClone = response.clone(); // Clone the response before reading its body
        const data = await response.json();
        displayRestaurants(data);
        await cache.put(cacheKey, responseClone);

        // Prefetch and cache all restaurant pages and their menus
        await Promise.all(data.map(async (restaurant) => {
            const restaurantRequest = new Request(`http://localhost:3000/restaurants/${restaurant._id}`, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`
                })
            });
            const menuRequest = new Request(`http://localhost:3000/restaurants/${restaurant._id}/menuitems`, {
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

                await cache.put(restaurantRequest, restaurantResponse.clone());
                await cache.put(menuRequest, menuResponse.clone());

                // Cache the restaurant and menu item pages
                const menuItems = await menuResponse.json();
                const menuItemUrls = menuItems.map(menuItem => `/menu.html?id=${menuItem._id}`);
                await cache.addAll([
                    `/restaurant.html?id=${restaurant._id}`,
                    ...menuItemUrls
                ]);

                // Fetch and display details of each menu item
                await Promise.all(menuItems.map(async (menuItem) => {
                    const menuItemRequest = new Request(`http://localhost:3000/menuitems/${menuItem._id}`, {
                        method: 'GET',
                        headers: new Headers({
                            'Authorization': `Bearer ${token}`
                        })
                    });

                    try {
                        const menuItemResponse = await fetch(menuItemRequest);
                        await cache.put(menuItemRequest, menuItemResponse.clone());
                    } catch (error) {
                        console.error(`Failed to fetch details for menu item ${menuItem._id}:`, error);
                    }
                }));
            } catch (error) {
                console.error(`Failed to prefetch data for restaurant ${restaurant._id}:`, error);
            }
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des restaurants :', error);
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            displayRestaurants(cachedData);
        } else {
            console.error('Aucune donnée en cache disponible');
        }
    } finally {
        spinner.style.display = 'none'; // Hide spinner after fetching data
    }
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
    await fetchRestaurants(token);
});