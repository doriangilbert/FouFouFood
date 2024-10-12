class MenuItem {
    constructor(id, name, description, price, category, image, restaurantId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.restaurantId = restaurantId;
    }
}

module.exports = MenuItem;