import { Navigate } from 'react-router-dom';

/** Redirige al login si no hay sesión; si adminOnly=true, redirige al inicio si el rol no es admin. */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly) {
        const rol = localStorage.getItem('rol');
        if (!rol || (!rol.toLowerCase().includes('admin') && rol !== 'administrador')) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
