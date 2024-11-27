const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const { generateRDF } = require('../utils/rdfUtils');

exports.getData = async (req, res) => {
    const accept = req.headers.accept;
    if (accept.includes('text/html')) {
        res.send(`
            <html lang="fr">
                <head>
                    <title>FouFouFood | API Web Sémantique</title>
                </head>
                <body>
                    <h1>FouFouFood - API Web Sémantique</h1>
                    <p>Utilisez les routes suivantes pour accéder aux données :</p>
                    <ul>
                        <li><a href="/data/restaurants">/data/restaurants</a></li>
                        <li><a href="/data/menuitems">/data/menuitems</a></li>
                        <li><a href="/data/orders">/data/orders</a></li>
                    </ul>
                </body>
            </html>
        `);
    } else if (accept === 'application/rdf+xml') {
        /*
        const data = {
            restaurants: await Restaurant.find(),
            menus: await MenuItem.find(),
            orders: await Order.find()
        };
        const rdf = generateRDF(data);
        res.type('application/rdf+xml').send(rdf);
        */
    } else {
        res.status(406).send('Non Acceptable. Veuillez spécifier un en-tête Accept valide, tel que text/html ou application/rdf+xml.');
    }
};

exports.getRestaurants = async (req, res) => {
    const accept = req.headers.accept;
    try {
        const restaurants = await Restaurant.find();
        if (accept.includes('text/html')) {
            res.send(`
                <html lang="fr">
                    <head>
                        <title>Liste des Restaurants</title>
                    </head>
                    <body>
                        <h1>Liste des Restaurants</h1>
                        <ul>
                            ${restaurants.map(restaurant => `
                                <li>
                                    ID: ${restaurant._id}<br>
                                    Nom: ${restaurant.name}<br>
                                    Adresse: ${restaurant.address}<br>
                                    Cuisine: ${restaurant.cuisine}<br>
                                    <a href="/data/restaurants/${restaurant._id}">Voir les détails et consulter le menu</a>
                                </li><br>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `);
        } else if (accept === 'application/rdf+xml') {
            /*
            const data = { restaurants };
            const rdf = generateRDF(data);
            res.type('application/rdf+xml').send(rdf);
            */
        } else {
            res.status(406).send('Non Acceptable. Veuillez spécifier un en-tête Accept valide, tel que text/html ou application/rdf+xml.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMenus = async (req, res) => {
    const accept = req.headers.accept;
    try {
        const menus = await MenuItem.find();
        if (accept.includes('text/html')) {
            res.send(`
                <html lang="fr">
                    <head>
                        <title>Liste des Éléments de Menu</title>
                    </head>
                    <body>
                        <h1>Liste des Éléments de Menu</h1>
                        <ul>
                            ${menus.map(menu => `
                                <li>
                                    ID: ${menu._id}<br>
                                    Nom: ${menu.name}<br>
                                    Description: ${menu.description}<br>
                                    Prix: ${menu.price}€<br>
                                    Catégorie: ${menu.category}<br>
                                    Restaurant: ${menu.restaurantId}<br>
                                    <a href="/data/restaurants/${menu.restaurantId}">Voir les détails du restaurant</a>
                                </li><br>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `);
        } else if (accept === 'application/rdf+xml') {
            /*
            const data = { menus };
            const rdf = generateRDF(data);
            res.type('application/rdf+xml').send(rdf);
            */
        } else {
            res.status(406).send('Non Acceptable. Veuillez spécifier un en-tête Accept valide, tel que text/html ou application/rdf+xml.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    const accept = req.headers.accept;
    try {
        const orders = await Order.find();
        if (accept.includes('text/html')) {
            res.send(`
                <html lang="fr">
                    <head>
                        <title>Commandes</title>
                    </head>
                    <body>
                        <h1>Commandes</h1>
                        <ul>
                            ${orders.map(order => `
                                <li>
                                    ID de la commande : ${order.id}<br>
                                    ID du client : ${order.userId}<br>
                                    ID du restaurant : ${order.restaurantId}<br>
                                    Items : ${order.items.map(item => `ID: ${item.item}, Quantité: ${item.quantity}`).join(', ')}<br>
                                    Total : ${order.totalPrice}€<br>
                                    Statut : ${order.status}<br>
                                    Adresse de livraison : ${order.deliveryAddress}<br>
                                    ID du livreur : ${order.deliveryPartnerId}<br>
                                    Date de création : ${order.createdAt}<br>
                                    <a href="/data/restaurants/${order.restaurantId}">Voir les détails du restaurant</a>
                                </li><br>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `);
        } else if (accept === 'application/rdf+xml') {
            /*
            const data = { orders };
            const rdf = generateRDF(data);
            res.type('application/rdf+xml').send(rdf);
            */
        } else {
            res.status(406).send('Non Acceptable. Veuillez spécifier un en-tête Accept valide, tel que text/html ou application/rdf+xml.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    const accept = req.headers.accept;
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        if (accept.includes('text/html')) {
            res.send(`
                <html lang="fr">
                    <head>
                        <title>${restaurant.name}</title>
                    </head>
                    <body>
                        <h1>${restaurant.name}</h1>
                        <p>ID : ${restaurant._id}</p>
                        <p>Adresse : ${restaurant.address}</p>
                        <p>Cuisine : ${restaurant.cuisine}</p>
                        <p>Téléphone : ${restaurant.phone}</p>
                        <p>Heures d'ouverture : ${restaurant.openingHours}</p>
                        <p>Éléments de menu : ${restaurant.menu.join(', ')}</p>
                        <p>Note : ${restaurant.rating}</p>
                        <p>Avis : ${restaurant.reviews.join(', ')}</p>
                        <a href="/data/menuitems/${restaurant._id}">Voir les éléments du menu</a>
                    </body>
                </html>
            `);
        } else if (accept === 'application/rdf+xml') {
            /*
            const data = { restaurants: [restaurant] };
            const rdf = generateRDF(data);
            res.type('application/rdf+xml').send(rdf);
            */
        } else {
            res.status(406).send('Non Acceptable. Veuillez spécifier un en-tête Accept valide, tel que text/html ou application/rdf+xml.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMenuItemsByRestaurant = async (req, res) => {
    const accept = req.headers.accept;
    try {
        const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
        if (accept.includes('text/html')) {
            res.send(`
                <html lang="fr">
                    <head>
                        <title>Éléments du Menu</title>
                    </head>
                    <body>
                        <h1>Éléments du Menu pour le Restaurant ${req.params.restaurantId}</h1>
                        <ul>
                            ${menuItems.map(item => `
                                <li>
                                    ID: ${item._id}<br>
                                    Nom: ${item.name}<br>
                                    Description: ${item.description}<br>
                                    Prix: ${item.price}€<br>
                                    Catégorie: ${item.category}
                                </li><br>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `);
        } else if (accept === 'application/rdf+xml') {
            /*
            const data = { menu: menuItems };
            const rdf = generateRDF(data);
            res.type('application/rdf+xml').send(rdf);
            */
        } else {
            res.status(406).send('Non Acceptable. Veuillez spécifier un en-tête Accept valide, tel que text/html ou application/rdf+xml.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};