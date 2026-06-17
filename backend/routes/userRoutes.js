const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/self-admin', userController.updateOwnRoleToAdmin); // Ruta para cambiar rol propio
router.get('/me', isAuth, userController.getMe);
router.put('/me', isAuth, userController.updateMe);
router.get('/', isAuth, isAdmin, userController.getUsers);
router.get('/:id', isAuth, userController.getUserById);
router.put('/:id', isAuth, isAdmin, userController.updateUser);
router.delete('/:id', isAuth, isAdmin, userController.deleteUser);
router.put('/:id/restore', isAuth, isAdmin, userController.restoreUser);
router.put('/:id/role', isAuth, isAdmin, userController.updateUserRole);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/contact', userController.contactEmail);

module.exports = router;