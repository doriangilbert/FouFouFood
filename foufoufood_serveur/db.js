const mongoose = require('mongoose');
const User = require('./User');
const Order = require('./Order');
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const DeliveryPartner = require('./DeliveryPartner');
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env

// URI pour la connexion à l'instance MongoDB locale
const db_uri = process.env.DB_URI; // Récupérer l'URI de la base de données à partir des variables d'environnement

// Fonction pour connecter à MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(db_uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Terminer le processus si la connexion échoue
    }
}

// Fonction pour fermer la connexion MongoDB
async function closeDatabaseConnection() {
    try {
        await mongoose.connection.close();
        console.log('Connexion à MongoDB fermée');
    } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion:', err);
    }
}

// Fonction pour ajouter des données d'échantillon
async function addSampleData() {
    try {
        // Supprimer les collections existantes
        await mongoose.connection.dropCollection('users');
        await mongoose.connection.dropCollection('orders');
        await mongoose.connection.dropCollection('restaurants');
        await mongoose.connection.dropCollection('menuitems');
        await mongoose.connection.dropCollection('deliverypartners');

        // Création des utilisateurs
        const users = [
            new User({
                //_id: '301',
                name: 'Ménélik Ado',
                email: 'menelik@example.com',
                password: 'password123',
                phone: '123 456 7890',
                address: '123 Rue Nairobi',
                isAdmin: false,
                orders: []
            }),
            new User({
                //_id: '302',
                name: 'Jane Smith',
                email: 'janesmith@example.com',
                password: 'password456',
                phone: '456 123 7890',
                address: '456 Oak Ave',
                isAdmin: false,
                orders: []
            }),
            new User({
                //_id: '303',
                name: 'Michael Dollar',
                email: 'michaeldollar@example.com',
                password: 'password789',
                phone: '124 356 7890',
                address: '789 Pine St',
                isAdmin: false,
                orders: []
            }),
            new User({
                //_id: '304',
                name: 'Mustafa Amadou',
                email: 'mustafa@example.com',
                password: 'password012',
                phone: '123 496 7890',
                address: '1011 Douala Avenue',
                isAdmin: false,
                orders: []
            }),
            new User({
                //_id: '305',
                name: 'Hui Chang',
                email: 'huichang@example.com',
                password: 'password345',
                phone: '123 456 7000',
                address: '北京路123號',
                isAdmin: false,
                orders: []
            }),
            new User({
                //_id: '306',
                name: 'Bertrand Fabi',
                email: 'fabib@example.com',
                password: 'password678',
                phone: '123 123 7890',
                address: '1415 Rue Champlain',
                isAdmin: false,
                orders: []
            })
        ];

        // Sauvegarde des utilisateurs
        for (const user of users) {
            await user.save();
        }

        // Création des restaurants et des éléments de menu
        const restaurants = [
            new Restaurant({
                //_id: '1',
                name: 'Pizza Hut',
                address: '123 Main St',
                cuisine: 'Italian',
                phone: '555-1212',
                openingHours: '10:00-22:00',
                menu: [
                    /*new MenuItem({
                        //_id: '101',
                        name: 'Poutine',
                        description: 'Poutine régulière',
                        price: 10.99,
                        category: 'principal',
                        image: 'poutine.jpg',
                        //restaurantId: '1'
                    }),
                    new MenuItem({
                        //_id: '102',
                        name: 'Ndolè',
                        description: 'Ndolè crevettes',
                        price: 12.99,
                        category: 'principal',
                        image: 'ndole.jpg',
                        //restaurantId: '1'
                    }),
                    new MenuItem({
                        //_id: '103',
                        name: 'Végétarienne',
                        description: 'Pizza végé',
                        price: 11.99,
                        category: 'pizza',
                        image: 'vegetarienne.jpg',
                        //restaurantId: '1'
                    })*/
                ],
                rating: 4.5,
                reviews: []
            }),
            new Restaurant({
                //_id: '2',
                name: 'Burger King',
                address: '456 Elm St',
                cuisine: 'Fast Food',
                phone: '555-4545',
                openingHours: '11:00-23:00',
                menu: [
                    /*new MenuItem({
                        //_id: '201',
                        name: 'Whopper',
                        description: 'Classic burger',
                        price: 8.99,
                        category: 'burger',
                        image: 'whopper.jpg',
                        //restaurantId: '2'
                    }),
                    new MenuItem({
                        //_id: '202',
                        name: 'Ailes de poulet',
                        description: 'Ailes de poulet élevé aux grains',
                        price: 5.99,
                        category: 'chicken',
                        image: 'ailes.jpg',
                        //restaurantId: '2'
                    }),
                    new MenuItem({
                        //_id: '203',
                        name: 'Frittes',
                        description: 'French fries',
                        price: 2.99,
                        category: 'side',
                        image: 'fries.jpg',
                        //restaurantId: '2'
                    })*/
                ],
                rating: 3.8,
                reviews: []
            })
        ];

        // Sauvegarde des restaurants et des éléments de menu
        for (const restaurant of restaurants) {
            await restaurant.save();
            let menuItems;
            if (restaurant.name === 'Pizza Hut') {
                menuItems = [
                    new MenuItem({
                        name: 'Poutine',
                        description: 'Poutine régulière',
                        price: 10.99,
                        category: 'principal',
                        image: 'poutine.jpg',
                        restaurantId: restaurant._id
                    }),
                    new MenuItem({
                        name: 'Ndolè',
                        description: 'Ndolè crevettes',
                        price: 12.99,
                        category: 'principal',
                        image: 'ndole.jpg',
                        restaurantId: restaurant._id
                    }),
                    new MenuItem({
                        name: 'Végétarienne',
                        description: 'Pizza végé',
                        price: 11.99,
                        category: 'pizza',
                        image: 'vegetarienne.jpg',
                        restaurantId: restaurant._id
                    })
                ];
            } else if (restaurant.name === 'Burger King') {
                menuItems = [
                    new MenuItem({
                        name: 'Whopper',
                        description: 'Classic burger',
                        price: 8.99,
                        category: 'burger',
                        image: 'whopper.jpg',
                        restaurantId: restaurant._id
                    }),
                    new MenuItem({
                        name: 'Ailes de poulet',
                        description: 'Ailes de poulet élevé aux grains',
                        price: 5.99,
                        category: 'chicken',
                        image: 'ailes.jpg',
                        restaurantId: restaurant._id
                    }),
                    new MenuItem({
                        name: 'Frittes',
                        description: 'French fries',
                        price: 2.99,
                        category: 'side',
                        image: 'fries.jpg',
                        restaurantId: restaurant._id
                    })
                ];
            }
            for (const menuItem of menuItems) {
                await menuItem.save();
                restaurant.menu.push(menuItem._id);
            }
            await restaurant.save();
        }

        // Création des livreurs
        const deliveryPartners = [
            new DeliveryPartner({
                //_id: '401',
                name: 'Bobby Ali',
                vehicle: 'Vélo',
                location: { lat: 45.5, lng: -73.6 },
                status: 'Disponible'
            }),
            new DeliveryPartner({
                //_id: '402',
                name: 'Alice Zhang',
                vehicle: 'Moto',
                location: { lat: 45.4, lng: -73.7 },
                status: 'Disponible'
            }),
            new DeliveryPartner({
                //_id: '403',
                name: 'Charlie Cooper',
                vehicle: 'Voiture',
                location: { lat: 45.6, lng: -73.5 },
                status: 'Disponible'
            }),
            new DeliveryPartner({
                //_id: '404',
                name: 'David Bowie',
                vehicle: 'Vélo',
                location: { lat: 45.5, lng: -73.8 },
                status: 'Disponible'
            })
        ];

        // Sauvegarde des livreurs
        for (const deliveryPartner of deliveryPartners) {
            await deliveryPartner.save();
        }

        console.log("Données d'échantillon ajoutées avec succès");
    } catch (err) {
        console.error('Erreur lors de l\'ajout des données:', err);
    }
}

// Exécution du script
(async () => {
    await connectToDatabase();
    await closeDatabaseConnection();
})();