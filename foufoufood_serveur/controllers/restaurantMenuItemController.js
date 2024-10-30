const MenuItem = require('../models/MenuItem');

exports.getAllRestaurantMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({restaurantId: req.params.restaurantId});
        res.json(menuItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getRestaurantMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findOne({_id: req.params.id, restaurantId: req.params.restaurantId});
        if (!menuItem) {
            return res.status(404).json({message: 'Item de menu non trouvé'});
        }
        res.json(menuItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.createRestaurantMenuItem = async (req, res) => {
    const newMenuItem = new MenuItem({...req.body, restaurantId: req.params.restaurantId});
    try {
        const savedMenuItem = await newMenuItem.save();
        res.json(savedMenuItem);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.updateRestaurantMenuItem = async (req, res) => {
    try {
        const updatedMenuItem = await MenuItem.findOneAndUpdate(
            {_id: req.params.id, restaurantId: req.params.restaurantId},
            req.body,
            {new: true, runValidators: true}
        );
        if (!updatedMenuItem) {
            return res.status(404).json({message: 'Item de menu non trouvé'});
        }
        res.json(updatedMenuItem);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err.message});
    }
};

exports.deleteRestaurantMenuItem = async (req, res) => {
    try {
        const deletedMenuItem = await MenuItem.findOneAndDelete({
            _id: req.params.id,
            restaurantId: req.params.restaurantId
        });
        if (!deletedMenuItem) {
            return res.status(404).json({message: 'Item de menu non trouvé'});
        }
        res.json({message: 'Item de menu supprimé avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};
