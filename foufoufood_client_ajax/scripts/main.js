import { getToken } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = await getToken();
    console.log('Token:', token); // Add this line to check the token
    if (token && ['/index.html', '/', '/login.html', '/register.html'].includes(window.location.pathname)) {
        window.location.href = 'home.html'; // Redirect to home.html if token is found
    } else if (!token && !['/index.html', '/', '/login.html', '/register.html'].includes(window.location.pathname)) {
        window.location.href = 'index.html'; // Redirect to index.html if no token is found
    }
});