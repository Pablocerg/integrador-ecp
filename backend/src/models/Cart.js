    const mongoose = require('mongoose');

    const cartSchema = new mongoose.Schema({
        usuarioId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        productos: [
            {
                productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                cantidad: { type: Number, default: 1 }
            }
        ]
    }, { timestamps: true });

    module.exports = mongoose.model('Cart', cartSchema);