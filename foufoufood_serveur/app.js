const express = require('express');
const app = express();
const mongoose = require("mongoose");
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const { Server } = require('socket.io');
const http = require('http');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const restaurantMenuItemRoutes = require('./routes/restaurantMenuItemRoutes');
const deliveryPartnerRoutes = require('./routes/deliveryPartnerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const {setupSocketIO} = require('./utils/socketUtils');

app.use(express.json()); // Pour parser les corps de requêtes JSON

// Connexion à MongoDB
const uri = process.env.DB_URI; // Récupérer l'URI de la base de données depuis les variables d'environnement
mongoose.connect(uri)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error(err));

// Créer le serveur HTTP
const server = http.createServer(app);

// Créer le serveur Socket.IO
const io = new Server(server);
app.set('io', io);

app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/menuitems', menuItemRoutes);
app.use('/restaurants', restaurantMenuItemRoutes);
app.use('/deliverypartners', deliveryPartnerRoutes);
app.use('/orders', orderRoutes);
app.use('/search', searchRoutes);
app.use('/notifications', notificationRoutes);

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <html>
        <head>
            <title>Bienvenue sur FouFouFood</title>
        </head>
        <body>
            <h1>Bienvenue sur FouFouFood, votre application de livraison de repas!</h1>
            <h2>API</h2>
            <p>Vous pouvez accéder à l'API en utilisant l'adresse suivante suivie de la route souhaitée :</p>
            <strong>http://localhost:3000/</strong>
            <h2>Notifications</h2>
            <p>Vous pouvez accéder aux notifications en utilisant l'adresse suivante suivie de l'identifant de l'utilisateur souhaité :</p>
            <strong> http://localhost:8080/notifications</strong>
            <h2>Note importante</h2>
            <p>Hormis les deux routes précédentes et la route de connexion, toutes les autres routes doivent être accédées de manière authentifiée avec un token généré suite à la connexion par la route suivante :</p>
            <strong>POST http://localhost:3000/users/login</strong
        </body>
    </html>
`);
});

setupSocketIO(io);

app.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000 (API)');
});

server.listen(8080, () => {
  console.log('Serveur en écoute sur le port 8080 (Notifications)');
});