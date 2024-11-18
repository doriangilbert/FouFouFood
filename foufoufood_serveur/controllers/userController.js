const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const deliveryPartnerController = require('../controllers/deliveryPartnerController');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!updatedUser) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({error: err.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }
        res.json({message: 'Utilisateur supprimé avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({error: 'Identifiants incorrects'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({error: 'Identifiants incorrects'});
        }

        const token = jwt.sign({userId: user._id, role: user.role}, secret, {expiresIn: '1d'});
        res.status(200).json({token, tokenExpiration: Math.floor(Date.now() / 1000) + (24 * 60 * 60)}); // tokenExpiration : timestamp correspondant à la date de génération du token + 1 jour
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.register = async (req, res) => {
    const { role } = req.body;
    if (role === 'utilisateur') {
        await exports.createUser(req, res);
    } else if (role === 'livreur') {
        await deliveryPartnerController.createDeliveryPartner(req, res);
    } else {
        res.status(403).json({error: 'Accès interdit (le rôle doit être "utilisateur" ou "livreur")'});
    }
}