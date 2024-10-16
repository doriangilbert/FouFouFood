const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    role: {
        type: String,
        enum: ['utilisateur', 'livreur', 'restaurant', 'admin'],
        required: true,
        default: 'utilisateur'
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

// Middleware pour hacher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

// Création du modèle pour les utilisateurs
const User = mongoose.model('User', userSchema);

module.exports = User;

/*
class User {
    constructor(id, name, email, password, phone, address, isAdmin, orders) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.isAdmin = isAdmin;
        this.orders = orders;
    }
}

module.exports = User;
*/