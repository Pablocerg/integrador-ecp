import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // Siempre muestra éxito por políticas de seguridad de datos
                toast.success(data.message || 'Enlace enviado correctamente.');
                setEmail('');
            } else {
                toast.error(data.message || 'Ocurrió un error.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="bg-[#151515]/90 border border-white/5 p-8 rounded-2xl w-full max-w-md backdrop-blur-xl shadow-2xl">
                <h2 className="text-2xl font-black text-white text-center tracking-tight mb-2 uppercase">Recuperar Clave</h2>
                <p className="text-gray-400 text-xs text-center mb-6">
                    Ingresa tu correo y te enviaremos un enlace único para reestablecer tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#6A8E23] outline-none transition"
                            placeholder="tuemail@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-lg disabled:opacity-50">
                        {loading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    <Link to="/login" className="text-[#6A8E23] hover:underline font-bold">Volver al Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;