const mongoose = require('mongoose');

// Schéma pour les commandes
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, quantity: { type: Number, required: true } }],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Création du modèle pour les commandes
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

/*
class Order {
    constructor(id, userId, restaurantId, items, totalPrice, status, deliveryAddress, deliveryPartner, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
        this.deliveryAddress = deliveryAddress;
        this.deliveryPartner = deliveryPartner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Order;
*/