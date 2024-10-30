const express = require('express');
const router = express.Router();
const deliveryPartnerController = require('../controllers/deliveryPartnerController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin'), deliveryPartnerController.getAllDeliveryPartners);
router.get('/:id', authenticateToken, authorizeRoles('admin'), deliveryPartnerController.getDeliveryPartnerById);
router.post('/', authenticateToken, authorizeRoles('admin'), deliveryPartnerController.createDeliveryPartner);
router.put('/:id', authenticateToken, authorizeRoles('admin'), deliveryPartnerController.updateDeliveryPartner);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deliveryPartnerController.deleteDeliveryPartner);

module.exports = router;