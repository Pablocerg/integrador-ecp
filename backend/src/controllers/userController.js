const User = require('../models/User');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const nuevoUsuario = new User(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario); // Respuesta en formato JSON
    } catch (error) {
        // Manejo básico de errores
        res.status(400).json({ mensaje: "Error al registrar usuario", error: error.message });
    }
};