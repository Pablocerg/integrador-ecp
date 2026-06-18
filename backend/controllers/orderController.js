const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderStatusEmail } = require('../config/mailer');


exports.createOrder = async (req, res) => {
    try {
        const { items, total, direccion, nombreCompleto, dni, telefono, tipoEntrega, medioPago } = req.body;
        const usuarioId = req.user._id || req.user.id; 

        // Validaciones básicas de ítems
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El pedido debe tener al menos un item" });
        }
        for (const item of items) {
            if (!item.producto || !item.cantidad || item.cantidad <= 0) {
                return res.status(400).json({ message: "Cada item debe tener producto y cantidad válida" });
            }
            if (!item.precio && !item.precioUnitario) {
                return res.status(400).json({ message: "Cada item debe tener un precio" });
            }
        }

        if (!nombreCompleto || !dni || !tipoEntrega || !medioPago) {
            return res.status(400).json({ message: "Faltan campos obligatorios para procesar la compra." });
        }
        if (tipoEntrega === 'domicilio' && !direccion) {
            return res.status(400).json({ message: "Para envíos a domicilio se requiere una dirección válida." });
        }

        // Descontar stock atómicamente y revertir ante fallo
        const itemsDescontados = [];
        for (const item of items) {
            const producto = await Product.findOneAndUpdate(
                { _id: item.producto, stock: { $gte: item.cantidad } },
                { $inc: { stock: -item.cantidad } },
                { new: true }
            );
            if (!producto) {
                for (const dec of itemsDescontados) {
                    await Product.findByIdAndUpdate(dec.producto, {
                        $inc: { stock: dec.cantidad }
                    });
                }
                return res.status(400).json({
                    message: `No hay stock suficiente de uno de los productos`
                });
            }
            itemsDescontados.push({
                producto: item.producto,
                cantidad: item.cantidad,
                precioUnitario: item.precio || item.precioUnitario
            });
        }

        const newOrder = new Order({
            usuario: usuarioId,
            items: itemsDescontados,
            total,
            nombreCompleto,
            dni,
            telefono,
            direccion: tipoEntrega === 'local' ? 'Retira en local' : direccion,
            tipoEntrega,
            medioPago
        });
        await newOrder.save().catch(async (saveError) => {
            for (const item of itemsDescontados) {
                await Product.findByIdAndUpdate(item.producto, {
                    $inc: { stock: item.cantidad }
                });
            }
            throw saveError;
        });

        res.status(201).json({ message: "Pedido realizado con éxito", newOrder });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Error al procesar el pedido", error: error.message });
    }
};

exports.getMisPedidos = async (req, res) => {
    try {
        const usuarioId = req.user._id || req.user.id;
        const pedidos = await Order.find({ usuario: usuarioId })
                                .populate('items.producto', 'nombre precio imagenUrl');
        res.json(pedidos);
    } catch (error) {
        console.error("Error al traer historial:", error);
        res.status(500).json({ message: "Error al traer el historial", error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
                                  .populate('usuario', 'nombre email')
                                  .populate('items.producto', 'nombre precio');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener órdenes" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
                                 .populate('usuario', 'nombre email')
                                 .populate('items.producto', 'nombre precio imagenUrl');
        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener orden" });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const validEstados = ['pendiente', 'pagado', 'enviado', 'entregado'];
        if (!validEstados.includes(estado)) {
            return res.status(400).json({ message: "Estado inválido" });
        }
        
        const updatedOrder = await Order.findByIdAndUpdate(id, { estado }, { new: true })
                                        .populate('usuario', 'nombre email')
                                        .populate('items.producto', 'nombre precio');
        if (!updatedOrder) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        // Enviar correo al cliente si el pedido pasa a "enviado"
        if (estado === 'enviado' && updatedOrder.usuario?.email) {
            sendOrderStatusEmail(
                updatedOrder,
                updatedOrder.usuario.email,
                updatedOrder.usuario.nombre || 'Cliente'
            ).catch(err => console.error('Error al enviar correo de pedido enviado:', err));
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar orden", error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        res.json({ message: "Orden eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar orden" });
    }
};