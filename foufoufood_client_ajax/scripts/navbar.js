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
    window.location.href = '/';
}
