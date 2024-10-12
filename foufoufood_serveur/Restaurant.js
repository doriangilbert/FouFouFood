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