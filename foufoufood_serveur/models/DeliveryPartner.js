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