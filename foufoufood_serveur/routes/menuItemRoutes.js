const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const {authenticateToken, authorizeRoles} = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), menuItemController.getAllMenuItems);
router.get('/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), menuItemController.getMenuItemById);
router.post('/', authenticateToken, authorizeRoles('admin'), menuItemController.createMenuItem);
router.put('/:id', authenticateToken, authorizeRoles('admin'), menuItemController.updateMenuItem);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), menuItemController.deleteMenuItem);

module.exports = router;