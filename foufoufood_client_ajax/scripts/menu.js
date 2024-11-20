import {getToken} from './db.js';

// Récupérer l'ID depuis l'URL
function getMenuIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function fetchMenu(token, menuId) {
        fetch(`http://localhost:3000/menuitems/${menuId}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        }).then(response => response.json())
            .then(data => displayMenu(data))
            .catch(error => console.error('Erreur:', error));
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

    fetchMenu(token, menuId);
});

// Charger les restaurants au chargement de la page
document.addEventListener("DOMContentLoaded", fetchMenu);