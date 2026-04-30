const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    stock: { type: Number, required: true },
    imagenUrl: { type: String },
    activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);