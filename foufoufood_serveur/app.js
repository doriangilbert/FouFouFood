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
app.get('/users', async (req, res) => {
  //res.send(`<h1>Utilisateurs</h1><br> ${JSON.stringify(simulator.users)}`);
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Créer un nouvel utilisateur
app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Route des restaurants
app.get('/restaurants', async (req, res) => {
  //res.send(`<h1>Restaurants</h1><br> ${JSON.stringify(simulator.restaurants)}`);
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route des livreurs
app.get('/deliverypartners', async (req, res) => {
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
app.get('/orders', async (req, res) => {
  //res.send(`<h1>Commandes</h1><br> ${JSON.stringify(simulator.orders)}`);
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

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

    res.status(200).json({ message: 'Connecté' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

