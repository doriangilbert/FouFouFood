const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/restaurants', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), searchController.searchRestaurants);
router.get('/menuitems', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), searchController.searchMenuItems);

module.exports = router;