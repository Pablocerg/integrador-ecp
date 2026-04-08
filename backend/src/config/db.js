const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB Conectado...');
    } catch (error) {
        console.error(' Error en la conexión:', error.message);
        process.exit(1); // Manejo básico de errores 
    }
};

module.exports = conectarDB;