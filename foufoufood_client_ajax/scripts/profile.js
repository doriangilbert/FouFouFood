import {getToken, getUserId} from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userId = await getUserId();
        if (userId) {
            const token = await getToken();
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                displayUserInfo(userData);
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } else {
            console.error('No user ID found in IndexedDB');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

function displayUserInfo(userData) {
    const userInfoDiv = document.getElementById('user-info');

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