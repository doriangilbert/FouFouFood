const mongoose = require('mongoose');

// Schéma pour les éléments de menu
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});

// Création du modèle pour les éléments de menu
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;

/*
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
*/