import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../hooks/useCart';

const Login = () => {
    const { syncCartWithServer } = useCart();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('nombre', data.user.nombre);
                localStorage.setItem('rol', data.user.rol || data.user.role || 'user');
                
                await syncCartWithServer();
                toast.success("¡Bienvenido a Pizzería KONE!");
                navigate('/'); 
            } else {
                setError(data.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            console.error("Error de conexión:", err); 
            setError('No se pudo conectar con el servidor. ¿Está el backend prendido?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
            <div className="bg-zinc-900 border border-white/10 p-10 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="text-center mb-10">
                    <h2 className="text-[#6A8E23] uppercase tracking-widest text-xs font-bold mb-2">Bienvenido de nuevo</h2>
                    <h1 className="text-3xl font-serif text-white italic">Iniciar Sesión</h1>
                </div>

                {error && (
                    <p className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-xs mb-6 text-center italic">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#6A8E23] outline-none transition"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#6A8E23] outline-none transition"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-[#6A8E23] transition">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    ¿No tienes cuenta? <Link to="/register" className="text-[#6A8E23] hover:underline font-bold">Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;