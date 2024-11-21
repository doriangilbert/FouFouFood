function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('foufoufood-db', 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('tokens', { keyPath: 'id' });
            db.createObjectStore('usersIds', { keyPath: 'id' });
            db.createObjectStore('cart', { keyPath: 'id' });
            db.createObjectStore('restaurantsIds', { keyPath: 'id' });
            console.log('Mise à niveau de la base de données nécessaire, création de l\'object store');
        };
        request.onsuccess = event => {
            console.log('Base de données ouverte avec succès');
            resolve(event.target.result);
        };
        request.onerror = event => {
            console.error('Erreur de la base de données :', event.target.error);
            reject(event.target.error);
        };
    });
}

export async function storeToken(token, tokenExpiration) {
    const db = await openDatabase();
    const tx = db.transaction('tokens', 'readwrite');
    const store = tx.objectStore('tokens');
    store.put({ id: 'authToken', token, tokenExpiration });
    await tx.complete;
    console.log('Jeton stocké dans IndexedDB');
}

export async function getToken() {
    const db = await openDatabase();
    const tx = db.transaction('tokens', 'readonly');
    const store = tx.objectStore('tokens');
    const tokenData = await new Promise((resolve, reject) => {
        const request = store.get('authToken');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    console.log('Jeton récupéré depuis IndexedDB :', tokenData);

    if (tokenData && Math.floor(Date.now() / 1000) <= tokenData.tokenExpiration) {
        return tokenData.token;
    } else {
        if (tokenData) {
            const deleteTx = db.transaction('tokens', 'readwrite');
            const deleteStore = deleteTx.objectStore('tokens');
            deleteStore.delete('authToken');
            await deleteTx.complete;
            console.log('Jeton expiré supprimé de IndexedDB');
            alert('Votre session a expiré. Vous allez être redirigé vers l\'accueil.');
            window.location.href = 'index.html';
        }
        return null;
    }
}

export async function deleteToken() {
    const db = await openDatabase();
    const tx = db.transaction('tokens', 'readwrite');
    const store = tx.objectStore('tokens');
    store.delete('authToken');
    await tx.complete;
    console.log('Jeton supprimé de IndexedDB');
}

export async function storeUserId(userId) {
    const db = await openDatabase();
    const tx = db.transaction('usersIds', 'readwrite');
    const store = tx.objectStore('usersIds');
    store.put({ id: 'userId', userId });
    await tx.complete;
    console.log('ID utilisateur stocké dans IndexedDB');
}

export async function getUserId() {
    const db = await openDatabase();
    const tx = db.transaction('usersIds', 'readonly');
    const store = tx.objectStore('usersIds');
    const userIdData = await new Promise((resolve, reject) => {
        const request = store.get('userId');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    console.log('ID utilisateur récupéré depuis IndexedDB :', userIdData);

    return userIdData ? userIdData.userId : null;
}

export async function deleteUserId() {
    const db = await openDatabase();
    const tx = db.transaction('usersIds', 'readwrite');
    const store = tx.objectStore('usersIds');
    store.delete('userId');
    await tx.complete;
    console.log('ID utilisateur supprimé de IndexedDB');
}

export async function storeCartItem(menuItemId, quantity) {
    const db = await openDatabase();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    store.put({ id: menuItemId, quantity });
    await tx.complete;
    console.log('Article du panier stocké dans IndexedDB');
}

export async function getCartItems() {
    const db = await openDatabase();
    const tx = db.transaction('cart', 'readonly');
    const store = tx.objectStore('cart');
    const items = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    console.log('Articles du panier récupérés depuis IndexedDB :', items);
    return items;
}

export async function deleteCartItem(menuItemId) {
    const db = await openDatabase();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    store.delete(menuItemId);
    await tx.complete;
    console.log('Article du panier supprimé de IndexedDB');
}

export async function clearCart() {
    const db = await openDatabase();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    store.clear();
    await tx.complete;
    console.log('Tous les articles du panier supprimés de IndexedDB');
}

export async function storeSelectedRestaurantId(restaurantId) {
    const db = await openDatabase();
    const tx = db.transaction('restaurantsIds', 'readwrite');
    const store = tx.objectStore('restaurantsIds');
    store.put({ id: 'selectedRestaurantId', restaurantId });
    await tx.complete;
    console.log('ID du restaurant sélectionné stocké dans IndexedDB');
}

export async function getSelectedRestaurantId() {
    const db = await openDatabase();
    const tx = db.transaction('restaurantsIds', 'readonly');
    const store = tx.objectStore('restaurantsIds');
    const restaurantIdData = await new Promise((resolve, reject) => {
        const request = store.get('selectedRestaurantId');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    console.log('ID du restaurant sélectionné récupéré depuis IndexedDB :', restaurantIdData);

    return restaurantIdData ? restaurantIdData.restaurantId : null;
}

export async function deleteSelectedRestaurantId() {
    const db = await openDatabase();
    const tx = db.transaction('restaurantsIds', 'readwrite');
    const store = tx.objectStore('restaurantsIds');
    store.delete('selectedRestaurantId');
    await tx.complete;
    console.log('ID du restaurant sélectionné supprimé de IndexedDB');
}