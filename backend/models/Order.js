const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        producto: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        cantidad: { type: Number, required: true },
        precioUnitario: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    
    nombreCompleto: { type: String, required: true },
    dni: { type: String, required: true },
    telefono: { type: String },
    direccion: { type: String, required: true }, // Guarda la dirección o "Retiro en local"
    tipoEntrega: { 
        type: String, 
        enum: ['local', 'domicilio'], 
        required: true 
    },
    medioPago: { 
        type: String, 
        enum: ['transferencia', 'efectivo'], 
        required: true 
    },

    estado: { 
        type: String, 
        enum: ['pendiente', 'pagado', 'enviado', 'entregado'], 
        default: 'pendiente' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);