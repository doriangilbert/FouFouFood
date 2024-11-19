import {getToken, deleteToken, deleteUserId} from './db.js';

const authButtons = document.getElementById('auth-buttons');
const userButtons = document.getElementById('user-buttons');
const searchBar = document.getElementById('search-bar');

const token = await getToken();
console.log('Token:', token); // Add this line to check the token
if (token) {
    console.log('Token found');
    authButtons.style.display = 'none';
    userButtons.style.display = 'block';
    searchBar.style.display = 'block';
} else {
    console.log('No token found');
    authButtons.style.display = 'block';
    userButtons.style.display = 'none';
    searchBar.style.display = 'none';
}

export async function logout() {
    await deleteToken();
    await deleteUserId();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
            .then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister()
                        .then(() => {
                            console.log('Service worker désenregistré :', registration);
                        })
                        .catch(error => {
                            console.error('Erreur lors du désenregistrement du service worker :', error);
                        });
                });
            })
            .catch(error => {
                console.error('Erreur lors de l\'obtention des enregistrements du service worker :', error);
            });
    }
    window.location.href = '/';
}
