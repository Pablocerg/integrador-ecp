import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pizzaApi from '../api/pizzaApi';

const MiPerfil = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const user = await pizzaApi.get('/users/me');
        setNombre(user.nombre || '');
        setEmail(user.email || '');
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        toast.error('No se pudo cargar tu perfil. Vuelve a iniciar sesión.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
      setError('La nueva contraseña y su confirmación deben coincidir');
      return;
    }

    if ((newPassword || confirmPassword) && !currentPassword) {
      setError('Debes ingresar tu contraseña actual para cambiarla');
      return;
    }

    const payload = {
      nombre,
      email,
    };

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
      payload.confirmPassword = confirmPassword;
    }

    try {
      setLoading(true);
      const response = await pizzaApi.put('/users/me', payload);
      toast.success(response.message || 'Perfil actualizado con éxito');
      // Actualiza nombre local si cambia
      localStorage.setItem('nombre', nombre);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-16 px-4">
      <div className="mx-auto max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
        <h1 className="text-3xl font-serif text-white italic mb-6">Mi Perfil</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#6A8E23]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#6A8E23]"
              required
            />
          </div>

          <div className="pt-6 border-t border-white/10">
            <h2 className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-4">Cambiar contraseña</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#6A8E23]"
                  placeholder="Contraseña actual"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#6A8E23]"
                  placeholder="Nueva contraseña"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#6A8E23]"
                  placeholder="Repite la contraseña"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6A8E23] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#5a7a1e] disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MiPerfil;
