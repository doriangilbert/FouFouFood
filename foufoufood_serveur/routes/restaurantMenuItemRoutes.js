const express = require('express');
const router = express.Router();
const restaurantMenuItemController = require('../controllers/restaurantMenuItemController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/:restaurantId/menuitems', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), restaurantMenuItemController.getAllRestaurantMenuItems);
router.get('/:restaurantId/menuitems/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), restaurantMenuItemController.getRestaurantMenuItemById);
router.post('/:restaurantId/menuitems', authenticateToken, authorizeRoles('restaurant', 'admin'), restaurantMenuItemController.createRestaurantMenuItem);
router.put('/:restaurantId/menuitems/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), restaurantMenuItemController.updateRestaurantMenuItem);
router.delete('/:restaurantId/menuitems/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), restaurantMenuItemController.deleteRestaurantMenuItem);

module.exports = router;