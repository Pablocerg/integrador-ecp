import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || '¡Contraseña cambiada con éxito!');
                navigate('/login');
            } else {
                toast.error(data.message || 'El enlace expiró o es inválido.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="bg-[#151515]/90 border border-white/5 p-8 rounded-2xl w-full max-w-md backdrop-blur-xl shadow-2xl">
                <h2 className="text-2xl font-black text-white text-center tracking-tight mb-2 uppercase">Nueva Contraseña</h2>
                <p className="text-gray-400 text-xs text-center mb-6">
                    Establece tu nueva credencial de ingreso de único uso.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Nueva contraseña</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#6A8E23] outline-none transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Confirmar contraseña</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#6A8E23] outline-none transition"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-lg disabled:opacity-50">
                        {loading ? 'Cambiando...' : 'Restablecer Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;