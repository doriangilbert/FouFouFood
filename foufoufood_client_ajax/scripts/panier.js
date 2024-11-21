import {getCartItems, getToken, clearCart, getUserId, getSelectedRestaurantId} from './db.js';

// Function to fetch item details from the database
async function fetchItemDetails(token, menuId) {
    try {
        const response = await fetch(`http://localhost:3000/menuitems/${menuId}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching item details:', error);
        alert('Failed to fetch item details. Please try again later.');
        return null;
    }
}

// Function to display cart items and total price
async function displayCartItems() {
    const token = await getToken();
    const cartItems = await getCartItems();
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Clear existing list

    let totalPrice = 0;

    if (cartItems.length === 0) {
        console.log('No items in the cart');
    }

    for (const item of cartItems) {
        console.log('Cart item:', item);

        if (!item.id || !item.quantity) {
            console.error('Invalid item structure:', item);
            continue;
        }

        const itemDetails = await fetchItemDetails(token, item.id);

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <p class="card-text">${itemDetails.name} : ${itemDetails.price}$ (Quantity: ${item.quantity})</p>
                </div>
            </div>
        `;

        cartList.appendChild(cartItem);

        // Add item price to total price
        totalPrice += itemDetails.price * item.quantity;
    }

    // Display total price
    const totalPriceElement = document.createElement('div');
    totalPriceElement.className = 'total-price';
    totalPriceElement.innerHTML = `<h5>Total: ${totalPrice}$</h5>`;
    cartList.appendChild(totalPriceElement);

    // Add the validate order button
    const validateOrderButton = document.createElement('button');
    validateOrderButton.className = 'btn btn-success';
    validateOrderButton.textContent = 'Valider la commande';
    validateOrderButton.addEventListener('click', () => submitOrder(token, cartItems, totalPrice));
    cartList.appendChild(validateOrderButton);
}

// Function to submit the order
async function submitOrder(token, cartItems, totalPrice) {
    const userId = await getUserId();
    const restaurantId = await getSelectedRestaurantId();

    if (!restaurantId) {
        console.error('Restaurant ID not found');
        alert('Error: Restaurant ID not found');
        return;
    }

    const order = {
        userId,
        restaurantId,
        items: cartItems.map(item => ({ item: item.id, quantity: item.quantity })),
        totalPrice,
        status: 'En livraison',
        deliveryAddress: '123 Main St, City, Country', // Replace with actual address
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliveryPartnerId: '672409fd29fe1d14a567a5d0' // Replace with actual delivery partner ID
    };

    try {
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        console.log('Order submitted successfully');
        await clearCart();
        alert('Order placed successfully!');
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Failed to submit order. Please try again later.');
    }
}

// Load cart items on page load
document.addEventListener('DOMContentLoaded', displayCartItems);