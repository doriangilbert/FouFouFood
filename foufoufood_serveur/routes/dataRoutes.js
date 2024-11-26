const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/', dataController.getData);
router.get('/restaurants', dataController.getRestaurants);
router.get('/menuitems', dataController.getMenus);
router.get('/orders', dataController.getOrders);
router.get('/restaurants/:id', dataController.getRestaurantById);
router.get('/menuitems/:restaurantId', dataController.getMenuItemsByRestaurant);

module.exports = router;