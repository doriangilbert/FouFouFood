/*
const { DataFactory } = require('rdf-data-factory');
const { Writer } = require('n3');

const factory = new DataFactory();

function generateRDF(data) {
    const writer = new Writer({ prefixes: { ex: 'http://localhost:3000/data/' } });

    if (data.restaurants) {
        data.restaurants.forEach(restaurant => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/type'),
                    factory.literal('restaurant')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/name'),
                    factory.literal(restaurant.name)
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/address'),
                    factory.literal(restaurant.address)
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/cuisine'),
                    factory.literal(restaurant.cuisine)
                )
            );
            // Add more quads for other restaurant properties if needed
        });
    }

    if (data.menus) {
        data.menus.forEach(menu => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/type'),
                    factory.literal('menu')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/name'),
                    factory.literal(menu.name)
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/price'),
                    factory.literal(menu.price.toString())
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/restaurantId'),
                    factory.literal(menu.restaurantId)
                )
            );
            // Add more quads for other menu properties if needed
        });
    }

    if (data.orders) {
        data.orders.forEach(order => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/order/${order.id}`),
                    factory.namedNode('http://localhost:3000/data/type'),
                    factory.literal('order')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/order/${order.id}`),
                    factory.namedNode('http://localhost:3000/data/total'),
                    factory.literal(order.total.toString())
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/order/${order.id}`),
                    factory.namedNode('http://localhost:3000/data/customerId'),
                    factory.literal(order.customerId)
                )
            );
            // Add more quads for other order properties if needed
        });
    }

    return writer.end((error, result) => {
        if (error) {
            console.error(error);
            return '';
        }
        return result;
    });
}

module.exports = { generateRDF };
*/

const { DataFactory } = require('rdf-data-factory');
const { Writer } = require('n3');

const factory = new DataFactory();

async function generateRDF(data) {
    const writer = new Writer({ prefixes: { ex: 'http://localhost:3000/data/' } });

    if (data.restaurants) {
        data.restaurants.forEach(restaurant => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/type'),
                    factory.literal('restaurant')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/name'),
                    factory.literal(restaurant.name)
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/address'),
                    factory.literal(restaurant.address)
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/restaurant/${restaurant.id}`),
                    factory.namedNode('http://localhost:3000/data/cuisine'),
                    factory.literal(restaurant.cuisine)
                )
            );
        });
    }

    if (data.menus) {
        data.menus.forEach(menu => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/type'),
                    factory.literal('menu')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/name'),
                    factory.literal(menu.name)
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/price'),
                    factory.literal(menu.price?.toString() || '')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/menu/${menu.id}`),
                    factory.namedNode('http://localhost:3000/data/restaurantId'),
                    factory.literal(menu.restaurantId?.toString() || '')
                )
            );
        });
    }

    if (data.orders) {
        data.orders.forEach(order => {
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/order/${order.id}`),
                    factory.namedNode('http://localhost:3000/data/type'),
                    factory.literal('order')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/order/${order.id}`),
                    factory.namedNode('http://localhost:3000/data/total'),
                    factory.literal(order.total?.toString() || '')
                )
            );
            writer.addQuad(
                factory.quad(
                    factory.namedNode(`http://localhost:3000/data/order/${order.id}`),
                    factory.namedNode('http://localhost:3000/data/customerId'),
                    factory.literal(order.customerId?.toString() || '')
                )
            );
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