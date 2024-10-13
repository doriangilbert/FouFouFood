const mongoose = require('mongoose');

// Schéma pour les livreurs
const deliveryPartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicle: String,
    location: {
        lat: Number,
        lng: Number
    },
    status: String
});

// Méthode pour assigner une commande à un livreur
deliveryPartnerSchema.methods.assignOrder = async function(orderId) {
    const Order = mongoose.model('Order');
    const order = await Order.findById(orderId);
    if (order) {
        order.deliveryPartner = this._id;
        order.status = 'En livraison';
        order.updatedAt = new Date();
        await order.save();
    }
};

// Création du modèle pour les livreurs
const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

module.exports = DeliveryPartner;

/*
class DeliveryPartner {
    constructor(id, name, vehicle, location, status) {
        this.id = id;
        this.name = name;
        this.vehicle = vehicle;
        this.location = location;
        this.status = status;
    }

    assignOrder(order) {
        order.deliveryPartner = this.id;
        order.status = 'En livraison';
        order.updatedAt = new Date()
    }
}

module.exports = DeliveryPartner;
*/