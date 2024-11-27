async function fetchData(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'text/html'
            }
        });
        if (!response.ok) {
            throw new Error('La réponse du réseau n\'était pas correcte');
        }
        const data = await response.text();
        document.getElementById('content').innerHTML = data;

        // Update links to be absolute
        const links = document.querySelectorAll('#content a');
        links.forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http')) {
                    await fetchData(`http://localhost:3000${href}`);
                } else {
                    await fetchData(href);
                }
            });
        });
    } catch (error) {
        console.error('Il y a eu un problème avec votre opération de récupération:', error);
    }
}

fetchData('http://localhost:3000/data');