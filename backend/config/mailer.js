const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // false para 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendResetEmail = async (email, link) => {
    const mailOptions = {
        from: `"Pizzería KONE" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Recuperación de Contraseña - Pizzería KONE',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; rounded-lg">
                <h2 style="color: #6A8E23; text-align: center;">Pizzería KONE</h2>
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para ingresar una nueva clave:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background-color: #6A8E23; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 14px;">Restablecer Contraseña</a>
                </div>
                <p style="color: #666; font-size: 12px;">Este enlace es de <strong>único uso</strong> y vencerá en <strong>20 minutos</strong>.</p>
                <p style="color: #999; font-size: 11px; border-t: 1px solid #eee; pt: 10px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

const sendOrderStatusEmail = async (order, usuarioEmail, usuarioNombre) => {
    const itemsHtml = order.items.map(item =>
        `<li style="padding: 4px 0; border-bottom: 1px solid #eee;">
            <strong>${item.producto?.nombre || 'Producto'}</strong> — x${item.cantidad} — $${item.precioUnitario}
        </li>`
    ).join('');

    const entregaText = order.tipoEntrega === 'domicilio'
        ? `A domicilio — <strong>${order.direccion}</strong>`
        : 'Retiro en local — <strong>Pizzería KONE</strong>';

    const mailOptions = {
        from: `"Pizzería KONE" <${process.env.MAIL_FROM}>`,
        to: usuarioEmail,
        subject: ` Pedido #${order._id.toString().slice(-8).toUpperCase()} en camino — Pizzería KONE`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #6A8E23; margin: 0;"> Pizzería KONE</h1>
                </div>
                <h2 style="color: #333; text-align: center;">¡Tu pedido está en camino!</h2>
                <p style="color: #555;">Hola <strong>${usuarioNombre}</strong>,</p>
                <p style="color: #555;">Te confirmamos que tu pedido <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> ya fue despachado y está en camino. 🎉</p>

                <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <h3 style="color: #6A8E23; margin: 0 0 12px 0;"> Detalle del pedido</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${itemsHtml}
                    </ul>
                    <p style="font-size: 18px; font-weight: bold; text-align: right; margin: 12px 0 0 0; border-top: 2px solid #6A8E23; padding-top: 12px;">
                        Total: <span style="color: #6A8E23;">$${order.total}</span>
                    </p>
                </div>

                <div style="background: #f0f7e6; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <h3 style="color: #6A8E23; margin: 0 0 8px 0;"> Tipo de entrega</h3>
                    <p style="margin: 0; color: #555;">${entregaText}</p>
                </div>

                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 24px;">
                    Pizzería KONE — <em>Sabor que enamora</em>
                </p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail, sendOrderStatusEmail };