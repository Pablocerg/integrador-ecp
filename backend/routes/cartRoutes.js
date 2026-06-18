const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/authMiddleware');
const {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

router.get('/', isAuth, getCart);
router.post('/add', isAuth, addToCart);
router.put('/update/:productId', isAuth, updateQuantity);
router.delete('/remove/:productId', isAuth, removeFromCart);
router.delete('/clear', isAuth, clearCart);

module.exports = router;
