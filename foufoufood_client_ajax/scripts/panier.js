// Fonction pour récupérer les éléments du panier depuis le stockage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Fonction pour afficher les éléments du panier
function displayCartItems() {
    const cartItems = getCartItems();
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Vider la liste existante

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Quantité : ${item.quantity}</p>
                    <p class="card-text">Prix : ${item.price}$</p>
                </div>
            </div>
        `;

        cartList.appendChild(cartItem);
    });
}

// Charger les éléments du panier au chargement de la page
document.addEventListener('DOMContentLoaded', displayCartItems);