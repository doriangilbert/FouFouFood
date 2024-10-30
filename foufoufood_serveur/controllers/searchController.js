const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

exports.searchRestaurants = async (req, res) => {
    try {
        const {name, cuisine} = req.body;
        const query = {};

        if (name) {
            query.name = {$regex: name, $options: 'i'};
        }
        if (cuisine) {
            query.cuisine = {$regex: cuisine, $options: 'i'};
        }

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.searchMenuItems = async (req, res) => {
    try {
        const {name, category, restaurantId} = req.body;
        const query = {};

        if (name) {
            query.name = {$regex: name, $options: 'i'};
        }
        if (category) {
            query.category = {$regex: category, $options: 'i'};
        }
        if (restaurantId) {
            query.restaurantId = restaurantId;
        }

        const menuItems = await MenuItem.find(query);
        res.json(menuItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};