const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), restaurantController.getAllRestaurants);
router.get('/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), restaurantController.getRestaurantById);
router.post('/', authenticateToken, authorizeRoles('admin'), restaurantController.createRestaurant);
router.put('/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), restaurantController.updateRestaurant);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), restaurantController.deleteRestaurant);

module.exports = router;