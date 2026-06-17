const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { activo } = req.query;
        const filter = {};
        if (activo !== undefined) {
            filter.activo = activo === 'false' ? false : true;
        } else {
            filter.activo = true;
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catálogo" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product || !product.activo) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener producto" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, stock, imagenUrl } = req.body;
        
        // Validar campos requeridos y rangos
        if (!nombre || !descripcion || !precio || !categoria || stock === undefined) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }
        if (precio <= 0) {
            return res.status(400).json({ message: "El precio debe ser mayor a 0" });
        }
        if (stock < 0) {
            return res.status(400).json({ message: "El stock no puede ser negativo" });
        }
        
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error });
    }
};
exports.restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const restoredProduct = await Product.findByIdAndUpdate(
            id,
            { activo: true },
            { new: true }
        );

        if (!restoredProduct) {
            return res.status(404).json({ message: "El producto no existe" });
        }

        res.json({
            message: "Producto reactivado correctamente",
            product: restoredProduct
        });
    } catch (error) {
        res.status(500).json({ message: "Error al restaurar el producto", error });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Validar precio y stock si se actualizan
        if (updates.precio !== undefined && updates.precio <= 0) {
            return res.status(400).json({ message: "El precio debe ser mayor a 0" });
        }
        if (updates.stock !== undefined && updates.stock < 0) {
            return res.status(400).json({ message: "El stock no puede ser negativo" });
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar producto", error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const productDeleted = await Product.findByIdAndUpdate(
            id, 
            { activo: false }, 
            { new: true }
        );

        if (!productDeleted) {
            return res.status(404).json({ message: "El producto no existe" });
        }

        res.json({ 
            message: "Producto desactivado correctamente (Baja Lógica)", 
            productDeleted 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error });
    }
};