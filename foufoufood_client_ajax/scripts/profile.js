import {getToken, getUserId} from './db.js';

const spinner = document.getElementById('loading-spinner');

document.addEventListener('DOMContentLoaded', async () => {
    spinner.style.display = 'block'; // Display spinner while fetching data

    const cache = await caches.open('foufoufood-cache-v1');
    const userId = await getUserId();
    if (userId) {
        const token = await getToken();
        const userRequest = new Request(`http://localhost:3000/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        try {
            const response = await fetch(userRequest);
            const responseClone = response.clone();
            if (response.ok) {
                const userData = await responseClone.json();
                displayUserInfo(userData);
                await cache.put(userRequest, response);
            } else {
                console.error('Échec de la récupération des données utilisateur :', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur :', error);
            const cachedResponse = await cache.match(userRequest);
            if (cachedResponse) {
                const cachedData = await cachedResponse.json();
                displayUserInfo(cachedData);
            } else {
                console.error('Aucune donnée en cache disponible');
            }
        } finally {
            spinner.style.display = 'none'; // Hide spinner after fetching data
        }
    } else {
        console.error('Aucun ID utilisateur trouvé dans IndexedDB');
    }
});

function displayUserInfo(userData) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = '';

    const fields = [
        { key: '_id', label: 'Identifiant' },
        { key: 'name', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Numéro de téléphone' },
        { key: 'address', label: 'Adresse' },
        { key: 'role', label: 'Rôle' }
    ];

    if (userData.role === 'livreur') {
        fields.push(
            { key: 'vehicle', label: 'Véhicule' },
            { key: 'status', label: 'Statut' }
        );
    }

    fields.forEach(field => {
        if (userData[field.key]) {
            userInfoDiv.innerHTML += `<p><strong>${field.label} :</strong> ${userData[field.key]}</p>`;
        }
    });
}