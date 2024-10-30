const Restaurant = require('../models/Restaurant');

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({message: 'Restaurant non trouvé'});
        }
        res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.createRestaurant = async (req, res) => {
    const newRestaurant = new Restaurant(req.body);
    try {
        const savedRestaurant = await newRestaurant.save();
        res.json(savedRestaurant);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err.message});
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedRestaurant) {
            return res.status(404).json({message: 'Restaurant non trouvé'});
        }
        res.json(updatedRestaurant);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({message: 'Restaurant non trouvé'});
        }
        res.json({message: 'Restaurant supprimé avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};