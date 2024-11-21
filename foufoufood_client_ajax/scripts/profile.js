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
                await displayUserOrders(userData.orders, token);
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            const cachedResponse = await cache.match(userRequest);
            if (cachedResponse) {
                const cachedData = await cachedResponse.json();
                displayUserInfo(cachedData);
                await displayUserOrders(cachedData.orders, token);
            } else {
                console.error('No cached data available');
            }
        } finally {
            spinner.style.display = 'none'; // Hide spinner after fetching data
        }
    } else {
        console.error('No user ID found in IndexedDB');
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

async function fetchMenuDetails(menuId, token) {
    const response = await fetch(`http://localhost:3000/menuitems/${menuId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        return response.json();
    } else {
        console.error('Failed to fetch menu details:', response.statusText);
        return null;
    }
}

async function displayUserOrders(orderIds, token) {
    const ordersDiv = document.getElementById('user-orders');
    ordersDiv.innerHTML = '';

    for (let i = 0; i < orderIds.length; i++) {
        const orderId = orderIds[i];
        const orderRequest = new Request(`http://localhost:3000/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        try {
            const response = await fetch(orderRequest);
            if (response.ok) {
                const orderData = await response.json();
                const restaurantRequest = new Request(`http://localhost:3000/restaurants/${orderData.restaurantId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const restaurantResponse = await fetch(restaurantRequest);
                if (restaurantResponse.ok) {
                    const restaurantData = await restaurantResponse.json();
                    const orderElement = document.createElement('div');
                    orderElement.className = 'order-item';
                    orderElement.style.backgroundColor = 'white'; // White background
                    orderElement.style.border = '1px solid black'; // Black border
                    orderElement.style.padding = '10px';
                    orderElement.style.marginBottom = '10px';

                    let orderContent = `<h5>Commande ${i + 1}:</h5>`;
                    orderContent += `<p><strong>ID de la commande :</strong> ${orderData._id}</p>`;
                    orderContent += `<p><strong>Restaurant :</strong> ${restaurantData.name}</p>`;
                    orderContent += `<p><strong>Adresse de livraison :</strong> ${orderData.deliveryAddress}</p>`;
                    orderContent += `<p><strong>Date et heure de la commande :</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>`;

                    for (const item of orderData.items) {
                        const menuDetails = await fetchMenuDetails(item.item, token);
                        if (menuDetails) {
                            const totalPrice = menuDetails.price * item.quantity;
                            orderContent += `<p>${item.quantity} x ${menuDetails.name}: ${totalPrice}$</p>`;
                        } else {
                            orderContent += `<p>${item.quantity} x Nom du menu inconnu: Prix inconnu</p>`;
                        }
                    }
                    orderContent += `<p><strong>Statut :</strong> ${orderData.status}</p>`;
                    orderElement.innerHTML = orderContent;
                    ordersDiv.appendChild(orderElement);
                } else {
                    console.error('Failed to fetch restaurant data:', restaurantResponse.statusText);
                }
            } else {
                console.error('Failed to fetch order data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    }
}