import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await res.json();
            
            if (res.ok) {
                toast.success("Usuario creado. ¡Ya puedes iniciar sesión!");
                navigate('/login');
            } else {
                setError(data.message || "Error al registrar");
            }
        } catch (err) {
            
            console.error("Error en la conexión:", err); 
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4 pt-20">
            <div className="bg-zinc-900 border border-white/10 p-10 rounded-2xl w-full max-w-md shadow-2xl">
                <h1 className="text-3xl font-serif text-white italic text-center mb-8">Crear Cuenta</h1>
                
                {error && (
                    <p className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-xs mb-6 text-center italic">
                        {error} 
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="Nombre completo"
                        className="w-full bg-black/50 border border-white/10 p-3 text-white rounded-lg focus:border-[#6A8E23] outline-none transition"
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required
                    />
                    <input 
                        type="email" placeholder="Email"
                        className="w-full bg-black/50 border border-white/10 p-3 text-white rounded-lg focus:border-[#6A8E23] outline-none transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input 
                        type="password" placeholder="Contraseña"
                        className="w-full bg-black/50 border border-white/10 p-3 text-white rounded-lg focus:border-[#6A8E23] outline-none transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <button className="w-full bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-lg mt-4">
                        Registrarme
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;