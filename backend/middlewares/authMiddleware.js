const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    let token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: "No hay token, permiso denegado" });
    }

    // Remover prefijo "Bearer " si existe
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_pizeria');
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error al validar token:", error.message);
        res.status(401).json({ message: "Token no válido" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && (req.user.rol === 'admin' || req.user.rol === 'administrador' || (req.user.rol && req.user.rol.toLowerCase().includes('admin')))) {
        next();
    } else {
        console.error("Acceso admin denegado. Rol del usuario:", req.user?.rol);
        res.status(403).json({ message: "Acceso denegado, se requiere rol de administrador. Rol actual: " + (req.user?.rol || 'sin rol') });
    }
};


