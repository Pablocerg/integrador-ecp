const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', isAuth, orderController.createOrder);
router.get('/mis-pedidos', isAuth, orderController.getMisPedidos);
router.get('/', isAuth, isAdmin, orderController.getOrders);
router.get('/:id', isAuth, orderController.getOrderById);
router.put('/:id', isAuth, isAdmin, orderController.updateOrder);
router.delete('/:id', isAuth, isAdmin, orderController.deleteOrder);

module.exports = router;