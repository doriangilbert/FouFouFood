const mongoose = require('mongoose');

// Schéma pour les restaurants
const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    cuisine: String,
    phone: String,
    openingHours: String,
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
    rating: Number,
    reviews: [{ type: String }]
});

// Méthode pour ajouter un élément de menu à un restaurant
restaurantSchema.methods.addMenuItem = function(menuItem) {
    this.menu.push(menuItem);
    return this.save();
};

// Création du modèle pour les restaurants
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

/*
class Restaurant {
    constructor(id, name, address, cuisine, phone, openingHours, menu, rating, reviews) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.cuisine = cuisine;
        this.phone = phone;
        this.openingHours = openingHours;
        this.menu = menu;
        this.rating = rating;
        this.reviews = reviews;
    }

    addMenuItem(menuItem) {
        this.menu.push(menuItem);
    }
}

module.exports = Restaurant;
*/
