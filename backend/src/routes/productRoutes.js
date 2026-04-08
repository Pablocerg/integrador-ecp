const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Definición de rutas según api RESTful para productos
router.get('/', productController.obtenerProductos);
router.get('/:id', productController.obtenerProductoPorId);
router.post('/', productController.crearProducto);
router.put('/:id', productController.editarProducto);
router.delete('/:id', productController.bajaLogicaProducto); // Implementa la Baja Lógica

module.exports = router;