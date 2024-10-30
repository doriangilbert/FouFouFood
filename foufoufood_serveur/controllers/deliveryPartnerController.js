const DeliveryPartner = require('../models/DeliveryPartner');

exports.getAllDeliveryPartners = async (req, res) => {
    try {
        const deliveryPartners = await DeliveryPartner.find();
        res.json(deliveryPartners);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getDeliveryPartnerById = async (req, res) => {
    try {
        const deliveryPartner = await DeliveryPartner.findById(req.params.id);
        if (!deliveryPartner) {
            return res.status(404).json({message: 'Livreur non trouvé'});
        }
        res.json(deliveryPartner);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.createDeliveryPartner = async (req, res) => {
    const newDeliveryPartner = new DeliveryPartner(req.body);
    try {
        const savedDeliveryPartner = await newDeliveryPartner.save();
        res.json(savedDeliveryPartner);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.updateDeliveryPartner = async (req, res) => {
    try {
        const updatedDeliveryPartner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedDeliveryPartner) {
            return res.status(404).json({message: 'Livreur non trouvé'});
        }
        res.json(updatedDeliveryPartner);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.deleteDeliveryPartner = async (req, res) => {
    try {
        const deletedDeliveryPartner = await DeliveryPartner.findByIdAndDelete(req.params.id);
        if (!deletedDeliveryPartner) {
            return res.status(404).json({message: 'Livreur non trouvé'});
        }
        res.json({message: 'Livreur supprimé avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};