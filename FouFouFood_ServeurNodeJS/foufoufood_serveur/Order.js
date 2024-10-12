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