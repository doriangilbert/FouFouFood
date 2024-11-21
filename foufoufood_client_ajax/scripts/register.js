import { storeToken, storeUserId } from './db.js';

const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');
const spinner = document.getElementById('loading-spinner');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const vehicle = role === 'livreur' ? document.getElementById('vehicle').value.trim() : null;

    // Validation des champs obligatoires
    if (!role || !name || !email || !password) {
        errorMessage.textContent = 'Veuillez remplir tous les champs obligatoires.';
        errorMessage.style.display = 'block';
        return;
    }

    spinner.style.display = 'block';

    const userData = {
        role,
        name,
        email,
        password,
        phone,
        address,
        vehicle
    };

    try {
        const response = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = 'login.html';
        } else {
            // Gestion des erreurs renvoyées par le serveur
            const errorData = await response.json().catch(() => ({ message: 'Aucune réponse JSON valide du serveur' }));
            console.error('Erreur reçue du serveur:', errorData);
            errorMessage.textContent = errorData.message || `Erreur lors de l'inscription. Veuillez vérifier vos informations. (Code HTTP: ${response.status})`;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        // Gestion des erreurs de connexion
        errorMessage.textContent = 'Erreur de connexion au serveur.';
        errorMessage.style.display = 'block';
        console.error("Erreur lors de l'inscription :", error);
    } finally {
        spinner.style.display = 'none';
    }
});