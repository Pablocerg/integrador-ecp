const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Nombre, email y password son requeridos" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Formato de email inválido" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const newUser = new User({ nombre, email, password, rol });
        await newUser.save();

        res.status(201).json({
            message: "Usuario creado con éxito",
            user: { nombre: newUser.nombre, email: newUser.email, rol: newUser.rol }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user._id, rol: user.rol }, 
            process.env.JWT_SECRET || 'clave_secreta_pizeria', 
            { expiresIn: '1d' }
        );

        res.json({
            message: "Login exitoso",
            token,
            user: { nombre: user.nombre, rol: user.rol }
        });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { activo } = req.query;
        const filter = {};

        if (activo !== undefined) {
            filter.activo = activo === 'false' ? false : true;
        } else {
            filter.activo = true;
        }

        const users = await User.find(filter).select('-password'); // Excluir password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Validar email o password si se actualizan
        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email)) {
                return res.status(400).json({ message: "Formato de email inválido" });
            }
            const existingUser = await User.findOne({ email: updates.email });
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(400).json({ message: "El email ya está en uso" });
            }
        }
        if (updates.password && updates.password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }
        
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar usuario", error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndUpdate(id, { activo: false }, { new: true }).select('-password');
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario desactivado correctamente", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
};

exports.restoreUser = async (req, res) => {
    try {
        const { id } = req.params;
        const restoredUser = await User.findByIdAndUpdate(id, { activo: true }, { new: true }).select('-password');
        if (!restoredUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario reactivado correctamente", user: restoredUser });
    } catch (error) {
        res.status(500).json({ message: "Error al reactivar usuario" });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!rol) {
            return res.status(400).json({ message: "El rol es requerido" });
        }

        const validRoles = ['usuario', 'admin', 'administrador', 'user'];
        if (!validRoles.includes(rol.toLowerCase())) {
            return res.status(400).json({ message: "Rol no válido" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { rol },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Rol actualizado correctamente", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar rol", error });
    }
};

exports.updateOwnRoleToAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        user.rol = 'admin';
        await user.save();

        res.json({ 
            message: "Rol actualizado a admin correctamente", 
            user: { nombre: user.nombre, email: user.email, rol: user.rol }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar rol", error });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'No autorizado' });

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del usuario', error });
    }
};

exports.updateMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'No autorizado' });

        const { nombre, email, currentPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).json({ message: 'Formato de email inválido' });
            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== userId) return res.status(400).json({ message: 'El email ya está en uso' });
            user.email = email;
        }

        if (nombre) user.nombre = nombre;

        if (newPassword || confirmPassword) {
            if (!currentPassword) return res.status(400).json({ message: 'Se requiere la contraseña actual para cambiar la contraseña' });
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) return res.status(401).json({ message: 'Contraseña actual incorrecta' });
            if (newPassword.length < 6) return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
            if (newPassword !== confirmPassword) return res.status(400).json({ message: 'La nueva contraseña y la confirmación no coinciden' });
            user.password = newPassword; // El pre-save de User.js la hashea automáticamente
        }

        await user.save();
        res.json({ message: 'Perfil actualizado correctamente', user: { nombre: user.nombre, email: user.email, rol: user.rol } });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil', error });
    }
};
const crypto = require('crypto');
const { sendResetEmail } = require('../config/mailer');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "El correo electrónico es requerido." });
        }

        const user = await User.findOne({ email });

        // Seguridad: respuesta idéntica exista o no el email, para no filtrar registros
        if (!user) {
            return res.json({ message: "Si el correo está registrado, se enviará un enlace de recuperación." });
        }

        const tokenReal = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(tokenReal).digest('hex');
        user.resetPasswordExpires = Date.now() + 20 * 60 * 1000;

        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const linkReset = `${frontendUrl}/reset-password/${tokenReal}`;

        await sendResetEmail(user.email, linkReset);

        res.json({ message: "Si el correo está registrado, se enviará un enlace de recuperación." });
    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ message: "Error interno del servidor al procesar la solicitud." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "El enlace de recuperación es inválido o ha expirado." });
        }

        user.password = password;

        // Token de único uso: se borra después de usarlo
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión." });
    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ message: "Error interno al restablecer la contraseña." });
    }
};

exports.contactEmail = async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Se envía a la casilla del administrador
            subject: `Nueva consulta web de: ${nombre}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #1A1A1A; color: #FFFFFF; max-w: 600px; margin: auto; border-radius: 10px;">
                    <h2 style="color: #6A8E23; text-transform: uppercase; border-b: 1px solid #333; padding-bottom: 10px;">Nueva Consulta - Pizzería KONE</h2>
                    <p><strong>Nombre del cliente:</strong> ${nombre}</p>
                    <p><strong>Email de contacto:</strong> <a href="mailto:${email}" style="color: #6A8E23;">${email}</a></p>
                    <div style="background-color: #000000; padding: 15px; border-radius: 8px; border-left: 4px solid #6A8E23; margin-top: 20px;">
                        <p style="margin: 0; font-style: italic;">"${mensaje}"</p>
                    </div>
                    <p style="font-size: 11px; color: #666; margin-top: 30px; text-align: center;">Este mensaje fue enviado automáticamente desde el formulario de contacto de tu sitio web.</p>
                </div>
            `
        };

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "¡Tu mensaje fue enviado con éxito!" });
    } catch (error) {
        console.error("Error en el formulario de contacto:", error);
        res.status(500).json({ message: "No se pudo procesar la consulta en este momento" });
    }
};