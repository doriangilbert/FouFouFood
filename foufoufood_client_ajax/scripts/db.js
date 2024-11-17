function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('authDB', 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('tokens', { keyPath: 'id' });
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

export async function storeToken(token) {
    const db = await openDatabase();
    const tx = db.transaction('tokens', 'readwrite');
    const store = tx.objectStore('tokens');
    store.put({ id: 'authToken', token });
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
    return tokenData ? tokenData.token : null;
}

export async function deleteToken() {
    const db = await openDatabase();
    const tx = db.transaction('tokens', 'readwrite');
    const store = tx.objectStore('tokens');
    store.delete('authToken');
    await tx.complete;
    console.log('Token deleted from IndexedDB');
}