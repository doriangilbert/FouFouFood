const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('admin'), userController.getUserById);
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);
router.put('/:id', authenticateToken, authorizeRoles('admin'), userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;