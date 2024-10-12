const express = require('express');
const app = express();
const Simulator = require('./Simulator');


simulator = new Simulator()
simulator.startSimulation()


// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.send('<h1>Bienvenue sur FouFouFood, votre application de livraison de repas!</h1><br>');
});

// Route des utilisateurs
app.get('/users', (req, res) => {
  res.send(`<h1>Utilisateurs</h1><br> ${JSON.stringify(simulator.users)}`);
});

// Route des restaurants
app.get('/restaurants', (req, res) => {
  res.send(`<h1>Restaurants</h1><br> ${JSON.stringify(simulator.restaurants)}`);
});

// Route des livreurs
app.get('/deliverypartners', (req, res) => {
  res.send(`<h1>Livreurs</h1><br> ${JSON.stringify(simulator.deliveryPartners)}`);
});

// Route des commandes
app.get('/orders', (req, res) => {
  res.send(`<h1>Commandes</h1><br> ${JSON.stringify(simulator.orders)}`);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

