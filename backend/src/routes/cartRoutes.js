const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.crearCarrito);
router.post('/add', cartController.agregarProducto);

module.exports = router;