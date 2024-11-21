import {getToken} from './db.js';

const spinner = document.getElementById('loading-spinner');

// Récupérer l'ID depuis l'URL
function getMenuIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

async function fetchMenu(token, menuId) {
    if (!menuId) {
        console.error('Menu ID is undefined');
        return;
    }

    spinner.style.display = 'block'; // Display spinner while fetching data

    const cache = await caches.open('foufoufood-cache-v1');
    const menuRequest = new Request(`http://localhost:3000/menuitems/${menuId}`, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`
        })
    });

    try {
        const response = await fetch(menuRequest);
        const responseClone = response.clone();
        const data = await responseClone.json();
        displayMenu(data);
        await cache.put(menuRequest, response);
    } catch (error) {
        console.error('Erreur lors de la récupération du menu :', error);
        const cachedResponse = await cache.match(menuRequest);
        if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            displayMenu(cachedData);
        } else {
            console.error('Aucune donnée en cache disponible');
        }
    } finally {
        spinner.style.display = 'none'; // Hide spinner after fetching data
    }
}

// Mettre à jour le DOM avec les informations du menu
function displayMenu(menu) {
    // Remplir les informations principales
    document.getElementById("menu-name").textContent = menu.name;
    document.getElementById("menu-description").textContent = menu.description;
    document.getElementById("menu-price").textContent = `${menu.price}$`;
}

// Chargement initial de la page
document.addEventListener('DOMContentLoaded', async function () {
    const token = await getToken();
    const menuId = getMenuIdFromUrl();

    if (menuId) {
        await fetchMenu(token, menuId);
    } else {
        console.error('ID du menu non défini');
    }
});

// Charger les restaurants au chargement de la page
document.addEventListener("DOMContentLoaded", fetchMenu);