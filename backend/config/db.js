    const mongoose = require('mongoose');

    /**
     * Conecta a MongoDB Atlas usando MONGO_URI del archivo .env
     * Se ejecuta al iniciar el servidor.
     */
    const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB conectado con éxito');
    } catch (error) {
        console.error(' Error en la conexión a MongoDB:', error.message);
        process.exit(1); 
    }
    };

    module.exports = connectDB;