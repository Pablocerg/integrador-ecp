// Archivo principal del servidor Express
require('dotenv').config();// Carga las variables de entorno desde el archivo .env
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
const Product = require('./models/Product'); 

const app = express();
conectarDB();

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
    res.json({ mensaje: "API de Tienda Online funcionando" });
});

app.use('/api/productos', require('./routes/productRoutes'));
app.use('/api/usuarios', require('./routes/userRoutes'));
app.use('/api/carrito', require('./routes/cartRoutes'));


app.put('/api/productos/stock/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        
        const productoActualizado = await Product.findOneAndUpdate(
            { _id: id, stock: { $gte: cantidad } }, 
            { $inc: { stock: -cantidad } }, 
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(400).json({ message: "No hay suficiente stock disponible" });
        }

        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar stock", error });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});