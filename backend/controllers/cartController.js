const Cart = require('../models/Cart');
const Product = require('../models/Product');

/** Obtiene el carrito del usuario autenticado */
exports.getCart = async (req, res) => {
    try {
        const usuarioId = req.user._id || req.user.id;
        let cart = await Cart.findOne({ usuario: usuarioId })
                            .populate('items.producto', 'nombre precio descripcion imagenUrl stock');
        if (!cart) {
            cart = { items: [] };
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
    }
};

/** Agrega un producto al carrito o incrementa su cantidad */
exports.addToCart = async (req, res) => {
    try {
        const usuarioId = req.user._id || req.user.id;
        const { producto, cantidad } = req.body;

        if (!producto || !cantidad || cantidad <= 0) {
            return res.status(400).json({ message: 'Producto y cantidad válida son requeridos' });
        }

        const product = await Product.findById(producto);
        if (!product || !product.activo) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let cart = await Cart.findOne({ usuario: usuarioId });
        if (!cart) {
            cart = new Cart({ usuario: usuarioId, items: [] });
        }

        const existingIndex = cart.items.findIndex(item => item.producto.toString() === producto);
        const currentCantidad = existingIndex >= 0 ? cart.items[existingIndex].cantidad : 0;
        const newCantidad = currentCantidad + cantidad;

        if (newCantidad > product.stock) {
            return res.status(400).json({
                message: `Stock insuficiente. Stock disponible: ${product.stock}`
            });
        }

        if (existingIndex >= 0) {
            cart.items[existingIndex].cantidad = newCantidad;
        } else {
            cart.items.push({ producto, cantidad });
        }

        await cart.save();
        await cart.populate('items.producto', 'nombre precio descripcion imagenUrl stock');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
    }
};

/** Actualiza la cantidad de un producto en el carrito (0 lo elimina) */
exports.updateQuantity = async (req, res) => {
    try {
        const usuarioId = req.user._id || req.user.id;
        const { productId } = req.params;
        const { cantidad } = req.body;

        if (cantidad === undefined || cantidad < 0) {
            return res.status(400).json({ message: 'Cantidad válida es requerida' });
        }

        const cart = await Cart.findOne({ usuario: usuarioId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const existingIndex = cart.items.findIndex(item => item.producto.toString() === productId);
        if (existingIndex < 0) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        if (cantidad === 0) {
            cart.items.splice(existingIndex, 1);
        } else {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            if (cantidad > product.stock) {
                return res.status(400).json({
                    message: `Stock insuficiente. Stock disponible: ${product.stock}`
                });
            }
            cart.items[existingIndex].cantidad = cantidad;
        }

        await cart.save();
        await cart.populate('items.producto', 'nombre precio descripcion imagenUrl stock');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar cantidad', error: error.message });
    }
};

/** Elimina un producto del carrito */
exports.removeFromCart = async (req, res) => {
    try {
        const usuarioId = req.user._id || req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ usuario: usuarioId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const existingIndex = cart.items.findIndex(item => item.producto.toString() === productId);
        if (existingIndex < 0) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.items.splice(existingIndex, 1);
        await cart.save();

        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar del carrito', error: error.message });
    }
};

/** Vacía completamente el carrito del usuario */
exports.clearCart = async (req, res) => {
    try {
        const usuarioId = req.user._id || req.user.id;
        const cart = await Cart.findOne({ usuario: usuarioId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Carrito vaciado', items: [] });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar carrito', error: error.message });
    }
};
