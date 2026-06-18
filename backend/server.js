require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');

const app = express();

// Conexi�n a MongoDB
connectDB();

app.use(cors()); // Permitir conexi�n desde el frontend en desarrollo
app.use(express.json());

app.use('/images', express.static('images'));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Servidor de la Pizzer�a KONE funcionando' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
