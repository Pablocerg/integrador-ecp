const Cart = require('../models/Cart');

// ● Crear carrito (vinculado a un usuario)
exports.crearCarrito = async (req, res) => {
    try {
        const nuevoCarrito = new Cart({ usuarioId: req.body.usuarioId, productos: [] });
        await nuevoCarrito.save();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear carrito", error: error.message });
    }
};

// ● Agregar producto al carrito
exports.agregarProducto = async (req, res) => {
    try {
        const { cartId, productoId, cantidad } = req.body;
        const carrito = await Cart.findById(cartId);
        
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

       
        carrito.productos.push({ productoId, cantidad });
        await carrito.save();

        
        const carritoActualizado = await Cart.findById(cartId).populate('productos.productoId');
        res.json(carritoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al agregar producto", error: error.message });
    }
};