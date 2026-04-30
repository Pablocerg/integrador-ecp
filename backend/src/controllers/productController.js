const Product = require('../models/Product');

// ● Obtener todos los productos (Solo los activos)
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Product.find({ activo: true });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", error });
    }
};

// ● Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (!producto || !producto.activo) {// Verifica si el producto existe y está activo
            return res.status(404).json({ mensaje: "Producto no encontrado o inactivo" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: "ID no válido", error });
    }
};

// ● Crear producto
exports.crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear el producto", error });
    }
};

// ● Editar producto
exports.editarProducto = async (req, res) => {
    try {
        const productoActualizado = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al editar", error });
    }
};

// ● Baja lógica (Cambia /activo/ a false)
exports.bajaLogicaProducto = async (req, res) => {
    try {
        const productoInactivado = await Product.findByIdAndUpdate(
            req.params.id, 
            { activo: false }, 
            { new: true }
        );
        if (!productoInactivado) return res.status(404).json({ mensaje: "Producto no encontrado" });
        res.json({ mensaje: "Producto dado de baja correctamente", productoInactivado });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en la baja lógica", error });
    }
};