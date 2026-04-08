const express = require('express');// Importa Express para crear el router
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.crearCarrito);
router.post('/add', cartController.agregarProducto);

module.exports = router;