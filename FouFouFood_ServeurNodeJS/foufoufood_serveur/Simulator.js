const DeliveryPartner = require('./DeliveryPartner')
const Order = require('./Order')
const User = require('./User')
const MenuItem = require('./MenuItem')
const Restaurant = require('./Restaurant')

class Simulator {
    constructor() {

        this.users = [
            new User('301', 'Ménélik Ado', 'menelik@example.com', 'password123', '123 456 7890', '123 Rue Nairobi', false, []),
            new User('302', 'Jane Smith', 'janesmith@example.com', 'password456', '456 123 7890', '456 Oak Ave', false, []),
            new User('303', 'Michael Dollar', 'michaeldollar@example.com', 'password789', '124 356 7890', '789 Pine St', false, []),
            new User('304', 'Mustafa Amadou', 'mustafa@example.com', 'password012', '123 496 7890', '1011 Douala Avenue', false, []),
            new User('305', 'Hui Chang', 'huichang@example.com', 'password345', '123 456 7000', '北京路123號', false, []),
            new User('306', 'Bertrand Fabi', 'fabib@example.com', 'password678', '123 123 7890', '1415 Rue Champlain', false, [])
        ];

        this.restaurants = [
            new Restaurant('1', 'Pizza Hut', '123 Main St', 'Italian', '555-1212', '10:00-22:00', [
                new MenuItem('101', 'Poutine', 'Poutine régulière', 10.99, 'principal', 'poutine.jpg', '1'),
                new MenuItem('102', 'Ndolè', 'Ndolè crevettes', 12.99, 'principal', 'ndole.jpg', '1'),
                new MenuItem('103', 'Végétarienne', 'Pizza végé', 11.99, 'pizza', 'vegetarienne.jpg', '1')
            ], 4.5, []),
            new Restaurant('2', 'Burger King', '456 Elm St', 'Fast Food', '555-4545', '11:00-23:00', [
                new MenuItem('201', 'Whopper', 'Classic burger', 8.99, 'burger', 'whopper.jpg', '2'),
                new MenuItem('202', 'Ailes de poulet', 'Ailes de poulet élevé aux grains', 5.99, 'chicken', 'ailes.jpg', '2'),
                new MenuItem('203', 'Frittes', 'French fries', 2.99, 'side', 'fries.jpg', '2')
            ], 3.8, [])
        ];

        this.deliveryPartners = [
            new DeliveryPartner('401', 'Bobby Ali', 'Vélo', { lat: 45.5, lng: -73.6 }, 'Disponible'),
            new DeliveryPartner('402', 'Alice Zhang', 'Moto', { lat: 45.4, lng: -73.7 }, 'Disponible'),
            new DeliveryPartner('403', 'Charlie Cooper', 'Voiture', { lat: 45.6, lng: -73.5 }, 'Disponible'),
            new DeliveryPartner('404', 'David Bowie', 'Vélo', { lat: 45.5, lng: -73.8 }, 'Disponible')
        ];

        this.orders = [];
        this.intervalId = null;
    }

    startSimulation() {
        console.log('Début de la simulation...')
        // Placer une commande toutes les 5 secondes
        this.intervalId = setInterval(() => {
            // Tirer au hazard un utilisateur qui n'a pas encore passé de commande
            const user = this.users.find(user => user.orders.length === 0);
            if (user) {
                // Tirer au hazard un restaurant
                const restaurant = this.restaurants[Math.floor(Math.random() * this.restaurants.length)];
                // Plats dans la commande (entre 1 et 2) + coût
                const n_items = Math.floor(Math.random() * 2) + 1
                const items = this.getRandomItems(restaurant.menu, n_items);
                console.log(`Random items: ${JSON.stringify(items)}`);

                // const totalPrice = items.reduce((total, item) => total + item.price, 0);
                const totalPrice = this.computeTotalPrice(items)

                const order = new Order(
                    // générer un ID unique
                    crypto.randomUUID(),
                    user.id,
                    restaurant.id,
                    items,
                    totalPrice,
                    'En cours',
                    user.address,
                    null,
                    new Date(),
                    new Date()
                );
                user.orders.push(order);
                this.orders.push(order);

                console.log(`Commande ${order.id} passée par ${user.name}. \n Détails de la commande: \n ${JSON.stringify(order)}`);
    
                // Trouver un livreur disponible aléatoirement
                const availableDeliveryPartners = this.deliveryPartners.filter(deliveryPartner => deliveryPartner.status === 'Disponible');
                if (availableDeliveryPartners.length > 0) {
                    const randomDeliveryPartner = availableDeliveryPartners[Math.floor(Math.random() * availableDeliveryPartners.length)];
                    randomDeliveryPartner.status = 'Occupé';
                    randomDeliveryPartner.assignOrder(order);
                    console.log(`Commande ${order.id} assignée à ${randomDeliveryPartner.name} pour livraison`);
    
                    // Simuler la livraison avec un délai aléatoire Entre 5 et 10 secondes
                    setTimeout(() => {
                        order.status = 'Livrée';
                        randomDeliveryPartner.status = 'Disponible';
                        console.log(`Commande ${order.id} livrée à ${user.name} par ${randomDeliveryPartner.name}`);
                        this.checkSimulationEnd();
                    }, Math.random() * 5000 + 5000);
                } else {
                    console.log('Aucun livreur disponible pour cette commande.');
                }
            }
        }, 5000);
    }

    checkSimulationEnd() {
        if (this.users.every(user => user.orders.length > 0) && this.orders.every(order => order.status === 'Livrée')) {
            clearInterval(this.intervalId);
            console.log('\n############## État du système à la fin de la simulation #############\n')
            console.log(`\nUtilisateurs:\n\n ${JSON.stringify(this.users)} `)
            console.log(`\nRestaurants:\n\n ${JSON.stringify(this.restaurants)} `)
            console.log(`\nLivreurs:\n\n ${JSON.stringify(this.deliveryPartners)} `)
            console.log(`\nCommandes:\n\n ${JSON.stringify(this.orders)} `)
            console.log('\nSimulation terminée !');
        }
    }

    getRandomItems(list, numberOfItems) {
        // Copie de la liste pour ne pas modifier l'original
        const shuffled = [...list];
      
        // Mélange aléatoirement la liste
        shuffled.sort(() => 0.5 - Math.random());
      
        // Retourne les `numberOfItems` premiers éléments
        return shuffled.slice(0, numberOfItems);
    }

    computeTotalPrice(orders) {
        let total = 0;
        for (let i = 0; i < orders.length; i++) {
          total += orders[i].price;
        }
        return total;
      }
}


module.exports = Simulator;