const { DataFactory } = require('rdf-data-factory');
const { Writer } = require('n3');

const factory = new DataFactory();

async function generateRDF(data) {
    const writer = new Writer({ prefixes: { ex: 'http://localhost:3000/data/' } });

    // Toutes les routes rdf GET pour les restaurants
    if (data.restaurants) {
        data.restaurants.forEach(restaurant => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:restaurant/${restaurant.id}`),
                    factory.namedNode('ex:type'),
                    factory.literal('restaurant')
                )
            );
            // On affiche le nom du restaurant
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:restaurant/${restaurant.id}`),
                    factory.namedNode('ex: Le nom :'),
                    factory.literal(restaurant.name)
                )
            );
            // On affiche l'adresse du restaurant
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:restaurant/${restaurant.id}`),
                    factory.namedNode('ex: L\'adresse :'),
                    factory.literal(restaurant.address)
                )
            );
            // Et on affiche le type de cuisine du restaurant
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:restaurant/${restaurant.id}`),
                    factory.namedNode('ex: Le type de cuisine :'),
                    factory.literal(restaurant.cuisine)
                )
            );
        });
    }

    // Les routes rdf GET pour les menus
    if (data.menus && !data.orders) {
        data.menus.forEach(menu => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:menu/${menu.id}`),
                    factory.namedNode('ex:type'),
                    factory.literal('menu')
                )
            );
            // On affiche le nom du menu
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:menu/${menu.id}`),
                    factory.namedNode('ex: Le nom :'),
                    factory.literal(menu.name)
                )
            );
            // On regarde si le prix est indique puis on l'affiche
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:menu/${menu.id}`),
                    factory.namedNode('ex: Le prix :'),
                    factory.literal(`${menu.price?.toString() || ''}$`)
                )
            );
            // On verifie si le menu est bien relie a un restaurant, puis on affiche l'Id du restaurant.
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:menu/${menu.id}`),
                    factory.namedNode('ex: L\'Id du restaurant :'),
                    factory.literal(menu.restaurantId?.toString() || '')
                )
            );
        });
    }

    // Pour tout ce qui concerne les routes rdf GET des commandes
    if (data.orders && data.menus) {
        data.orders.forEach(order => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:commande/${order.id}`),
                    factory.namedNode('ex:type'),
                    factory.literal('commande')
                )
            );
            // On verifie si la commande a bien un prix total, puis on affiche ce prix.
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:commande/${order.id}`),
                    factory.namedNode('ex: Le prix total :'),
                    factory.literal(`${order.totalPrice?.toString() || ''}$`)
                )
            );
            // On verifie si la commande est bien reliee a un utilisateur, puis on affiche l'Id de l'utilisateur.
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`ex:commande/${order.id}`),
                    factory.namedNode('ex: L\'Id du client :'),
                    factory.literal(order.userId?.toString() || '')
                )
            );

            // On affiche les menus de la commande avec leur quantite
            order.items.forEach((item, index) => {
                const menu = data.menus.find(menu => menu.id.toString() === item.item.toString());
                if (menu) {
                    writer.addQuad(
                        factory.quad(
                            factory.namedNode(`ex:commande/${order.id}`),
                            factory.namedNode(`ex: Menu ${index + 1} :`),
                            factory.literal(`${item.quantity} x ${menu.name}`)
                        )
                    );
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        writer.end((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = { generateRDF };