const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({message: 'Item de menu non trouvé'});
        }
        res.json(menuItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.createMenuItem = async (req, res) => {
    const newMenuItem = new MenuItem(req.body);
    try {
        const savedMenuItem = await newMenuItem.save();
        res.json(savedMenuItem);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedMenuItem) {
            return res.status(404).json({message: 'Item de menu non trouvé'});
        }
        res.json(updatedMenuItem);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedMenuItem) {
            return res.status(404).json({message: 'Item de menu non trouvé'});
        }
        res.json({message: 'Item de menu supprimé avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};