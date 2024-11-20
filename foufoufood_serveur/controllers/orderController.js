const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const {notifyUser} = require('../utils/socketUtils');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({message: 'Commande non trouvée'});
        }
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.createOrder = async (req, res) => {
    const {userId, restaurantId, items, deliveryAddress} = req.body;

    // Valider les données de la commande
    if (!userId || !restaurantId || !items || items.length === 0 || !deliveryAddress) {
        return res.status(400).json({message: 'Tous les champs sont requis'});
    }

    try {
        // Calculer le prix total de la commande
        let totalPrice = 0;
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.item);
            if (!menuItem) {
                return res.status(404).json({message: `MenuItem avec l'ID ${item.item} non trouvé`});
            }
            totalPrice += menuItem.price * item.quantity;
        }

        // Créer et enregistrer la commande
        const newOrder = new Order({
            userId,
            restaurantId,
            items,
            totalPrice,
            status: 'En attente',
            deliveryAddress,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedOrder = await newOrder.save();
        // Ajouter l'identifiant de la commande à la liste des commandes de l'utilisateur
        await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });
        res.status(201).json(savedOrder)

        // Notifier l'utilisateur de la création de la commande
        const io = req.app.get('io');
        const orderRestaurant = await Restaurant.findById(savedOrder.restaurantId);
        notifyUser(io, savedOrder.userId.toString(), {type: 'ORDER_CREATED', order: savedOrder, restaurant: orderRestaurant});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!updatedOrder) {
            return res.status(404).json({message: 'Commande non trouvée'});
        }
        res.json(updatedOrder);

        // Notifier l'utilisateur de la mise à jour de la commande
        const io = req.app.get('io');
        const orderRestaurant = await Restaurant.findById(updatedOrder.restaurantId);
        notifyUser(io, updatedOrder.userId.toString(), {type: 'ORDER_UPDATED', order: updatedOrder, restaurant: orderRestaurant});
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({message: 'Commande non trouvée'});
        }
        // Supprimer l'identifiant de la commande de la liste des commandes de l'utilisateur
        await User.findByIdAndUpdate(deletedOrder.userId, { $pull: { orders: deletedOrder._id } });
        res.json({message: 'Commande supprimée avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.assignDeliveryPartner = async (req, res) => {
    const {deliveryPartnerId} = req.body;

    // Valider les données
    if (!deliveryPartnerId) {
        return res.status(400).json({message: 'ID du livreur requis'});
    }

    try {
        // Vérifier si la commande existe
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({message: 'Commande non trouvée'});
        }

        // Vérifier si le livreur existe
        const deliveryPartner = await User.findOne({_id: deliveryPartnerId, role: 'livreur'});
        if (!deliveryPartner) {
            return res.status(404).json({message: 'Livreur non trouvé'});
        }

        // Assigner le livreur à la commande
        order.deliveryPartnerId = deliveryPartnerId;
        order.updatedAt = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);

        // Notifier le livreur de l'assignation de la commande
        const io = req.app.get('io');
        const orderRestaurant = await Restaurant.findById(order.restaurantId);
        notifyUser(io, order.deliveryPartnerId.toString(), {type: 'ORDER_ASSIGNED', order: updatedOrder, restaurant: orderRestaurant});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.changeOrderStatus = async (req, res) => {
    const {status} = req.body;

    // Valider le nouveau statut
    if (!status) {
        return res.status(400).json({message: 'Le statut est requis'});
    }

    try {
        // Vérifier si la commande existe
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({message: 'Commande non trouvée'});
        }

        // Mettre à jour le statut de la commande
        order.status = status;
        order.updatedAt = new Date();

        const updatedOrder = await order.save();
        res.json(updatedOrder);

        // Notifier l'utilisateur du changement de statut de la commande
        const io = req.app.get('io');
        const orderRestaurant = await Restaurant.findById(order.restaurantId);
        notifyUser(io, order.userId.toString(), {type: 'ORDER_STATUS_CHANGED', order: updatedOrder, restaurant: orderRestaurant});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};