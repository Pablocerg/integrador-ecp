const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', productController.getProducts);
router.post('/', isAuth, isAdmin, productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', isAuth, isAdmin, productController.updateProduct);
router.delete('/:id', isAuth, isAdmin, productController.deleteProduct);
router.put('/:id/restore', isAuth, isAdmin, productController.restoreProduct);
module.exports = router;