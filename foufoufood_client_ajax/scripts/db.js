function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('foufoufood-db', 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('tokens', { keyPath: 'id' });
            db.createObjectStore('ids', { keyPath: 'id' });
            console.log('Database upgrade needed, object store created');
        };
        request.onsuccess = event => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };
        request.onerror = event => {
            console.error('Database error:', event.target.error);
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
    console.log('Token stored in IndexedDB');
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
    console.log('Token retrieved from IndexedDB:', tokenData);

    if (tokenData && Math.floor(Date.now() / 1000) <= tokenData.tokenExpiration) {
        return tokenData.token;
    } else {
        if (tokenData) {
            const deleteTx = db.transaction('tokens', 'readwrite');
            const deleteStore = deleteTx.objectStore('tokens');
            deleteStore.delete('authToken');
            await deleteTx.complete;
            console.log('Expired token deleted from IndexedDB');
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
    console.log('Token deleted from IndexedDB');
}

export async function storeUserId(userId) {
    const db = await openDatabase();
    const tx = db.transaction('ids', 'readwrite');
    const store = tx.objectStore('ids');
    store.put({ id: 'userId', userId });
    await tx.complete;
    console.log('User ID stored in IndexedDB');
}

export async function getUserId() {
    const db = await openDatabase();
    const tx = db.transaction('ids', 'readonly');
    const store = tx.objectStore('ids');
    const userIdData = await new Promise((resolve, reject) => {
        const request = store.get('userId');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    console.log('User ID retrieved from IndexedDB:', userIdData);

    return userIdData ? userIdData.userId : null;
}

export async function deleteUserId() {
    const db = await openDatabase();
    const tx = db.transaction('ids', 'readwrite');
    const store = tx.objectStore('ids');
    store.delete('userId');
    await tx.complete;
    console.log('User ID deleted from IndexedDB');
}