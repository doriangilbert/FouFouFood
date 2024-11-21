const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin'), orderController.getAllOrders);
router.get('/:id', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), orderController.getOrderById);
router.post('/', authenticateToken, authorizeRoles('utilisateur', 'livreur', 'restaurant', 'admin'), orderController.createOrder);
router.put('/:id', authenticateToken, authorizeRoles('livreur', 'restaurant', 'admin'), orderController.updateOrder);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), orderController.deleteOrder);
router.put('/:id/assign', authenticateToken, authorizeRoles('admin'), orderController.assignDeliveryPartner);
router.put('/:id/status', authenticateToken, authorizeRoles('livreur', 'restaurant', 'admin'), orderController.changeOrderStatus);

module.exports = router;