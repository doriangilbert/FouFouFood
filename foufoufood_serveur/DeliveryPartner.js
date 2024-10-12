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