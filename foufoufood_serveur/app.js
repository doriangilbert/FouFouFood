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
app.get('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
app.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
app.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
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

// Récupérer tous les éléments de menu d'un restaurant
app.get('/restaurants/:restaurantId/menuitems', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Récupérer un élément de menu d'un restaurant
app.get('/restaurants/:restaurantId/menuitems/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({ _id: req.params.id, restaurant: req.params.restaurantId });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Créer un nouvel élément de menu pour un restaurant
app.post('/restaurants/:restaurantId/menuitems', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  const newMenuItem = new MenuItem({ ...req.body, restaurant: req.params.restaurantId });
  try {
    const savedMenuItem = await newMenuItem.save();
    res.json(savedMenuItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un élément de menu d'un restaurant
app.put('/restaurants/:restaurantId/menuitems/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.params.restaurantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedMenuItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un élément de menu d'un restaurant
app.delete('/restaurants/:restaurantId/menuitems/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurant: req.params.restaurantId });
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
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

// Obtenir les détails d'un livreur
app.get('/deliverypartners/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(req.params.id);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }
    res.json(deliveryPartner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Créer un nouveau livreur
app.post('/deliverypartners', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const newDeliveryPartner = new DeliveryPartner(req.body);
  try {
    const savedDeliveryPartner = await newDeliveryPartner.save();
    res.json(savedDeliveryPartner);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un livreur
app.put('/deliverypartners/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updatedDeliveryPartner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDeliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }
    res.json(updatedDeliveryPartner);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un livreur
app.delete('/deliverypartners/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedDeliveryPartner = await DeliveryPartner.findByIdAndDelete(req.params.id);
    if (!deletedDeliveryPartner) {
      return res.status(404).json({ message: 'Delivery Partner not found' });
    }
    res.json({ message: 'Delivery Partner deleted successfully' });
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

// Consulter les détails d'une commande
app.get('/orders/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Créer une nouvelle commande
app.post('/orders', authenticateToken, authorizeRoles('utilisateur', 'admin'), async (req, res) => {
  const { userId, restaurantId, items, deliveryAddress } = req.body;

  // Valider les données de la commande
  if (!userId || !restaurantId || !items || items.length === 0 || !deliveryAddress) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    // Calculer le prix total de la commande
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.item);
      if (!menuItem) {
        return res.status(404).json({ message: `MenuItem avec l'ID ${item.item} non trouvé` });
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
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour une commande
app.put('/orders/:id', authenticateToken, authorizeRoles('livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Assigner un livreur à une commande
app.put('/orders/:id/assign', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { deliveryPartnerId } = req.body;

  // Valider les données
  if (!deliveryPartnerId) {
    return res.status(400).json({ message: 'Delivery partner ID is required' });
  }

  try {
    // Vérifier si la commande existe
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Vérifier si le livreur existe
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    // Assigner le livreur à la commande
    order.deliveryPartnerId = deliveryPartnerId;
    order.updatedAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Changer le statut d'une commande
app.put('/orders/:id/status', authenticateToken, authorizeRoles('livreur', 'restaurant', 'admin'), async (req, res) => {
  const { status } = req.body;

  // Valider le nouveau statut
  if (!status) {
    return res.status(400).json({ message: 'Le statut est requis' });
  }

  try {
    // Vérifier si la commande existe
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Mettre à jour le statut de la commande
    order.status = status;
    order.updatedAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une commande
app.delete('/orders/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Rechercher des restaurants
app.get('/search/restaurants', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const { name, cuisine } = req.body;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Rechercher des éléments de menu
app.get('/search/menuitems', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), async (req, res) => {
  try {
    const { name, category, restaurantId } = req.body;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (restaurantId) {
      query.restaurantId = restaurantId; // Exact match
    }

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
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

