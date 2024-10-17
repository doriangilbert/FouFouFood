const express = require('express');
const app = express();
//const Simulator = require('./Simulator');
const mongoose = require("mongoose");
const User = require('./User');
const Order = require('./Order');
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const DeliveryPartner = require('./DeliveryPartner');
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json()); // Pour parser les corps de requêtes JSON

// Connexion à MongoDB
const uri = process.env.DB_URI; // Récupérer l'URI de la base de données depuis les variables d'environnement
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

/*
simulator = new Simulator()
simulator.startSimulation()
*/

// Route pour la page d'accueil
app.get('/', (req, res) => {
  //res.send('<h1>Bienvenue sur FouFouFood, votre application de livraison de repas!</h1><br>');
  res.send('Bienvenue sur FouFouFood, votre application de livraison de repas!');
});

// Route des utilisateurs
app.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  //res.send(`<h1>Utilisateurs</h1><br> ${JSON.stringify(simulator.users)}`);
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Consulter les détails d'un utilisateur
app.get('/users/:email', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Créer un nouvel utilisateur
app.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un utilisateur
app.put('/users/:email', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un utilisateur
app.delete('/users/:email', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.params.email });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route des restaurants
app.get('/restaurants', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  //res.send(`<h1>Restaurants</h1><br> ${JSON.stringify(simulator.restaurants)}`);
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Consulter les détails d'un restaurant
app.get('/restaurants/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Créer un nouveau restaurant
app.post('/restaurants', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const newRestaurant = new Restaurant(req.body);
  try {
    const savedRestaurant = await newRestaurant.save();
    res.json(savedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un restaurant
app.put('/restaurants/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(updatedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un restaurant
app.delete('/restaurants/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route des livreurs
app.get('/deliverypartners', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  //res.send(`<h1>Livreurs</h1><br> ${JSON.stringify(simulator.deliveryPartners)}`);
  try {
    const deliverypartners = await DeliveryPartner.find();
    res.json(deliverypartners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route des commandes
app.get('/orders', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  //res.send(`<h1>Commandes</h1><br> ${JSON.stringify(simulator.orders)}`);
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

const secret = process.env.JWT_SECRET;

// Se connecter
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const invalidTokens = []; // Liste noire des tokens invalidés

// Middleware pour vérifier si le token est valide et non invalidé
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  if (invalidTokens.includes(token)) {
    return res.status(401).json({ error: 'Token has been invalidated' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Vous pouvez utiliser req.user dans la route pour accéder aux infos utilisateur
    next(); // Continuer si le token est valide
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware pour vérifier si l'utilisateur possède l'un des rôles autorisés
function authorizeRoles(...roles) {
  return (req, res, next) => {
    // Autorise si l'utilisateur est un admin ou a un rôle autorisé
    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
      return next();
    }
    res.status(403).json({ message: 'Accès refusé : rôle non autorisé.' });
  };
}

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

