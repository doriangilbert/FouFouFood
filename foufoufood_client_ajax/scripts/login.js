import {storeToken, storeUserId} from './db.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const spinner = document.getElementById('loading-spinner');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    spinner.style.display = 'block';

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            await storeToken(data.token, data.tokenExpiration);
            await storeUserId(data.userId);
            window.location.href = 'home.html';
        } else {
            errorMessage.textContent = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Erreur de connexion au serveur.';
        errorMessage.style.display = 'block';
        console.error("Erreur lors de la connexion :", error);
    } finally {
        spinner.style.display = 'none';
    }
});