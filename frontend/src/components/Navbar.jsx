import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useCart } from '../hooks/useCart';
import { getRoleFromToken } from '../utils/auth';
import logo from '../assets/kone-logo-tight.png'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getItemCount } = useCart();
    
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    const roleFromToken = getRoleFromToken();
    const storedRole = localStorage.getItem('rol') || localStorage.getItem('role');
    const rol = (roleFromToken || storedRole)?.trim().toLowerCase();
    const isAdmin = ['admin', 'administrador'].some((adminRole) => rol?.includes(adminRole) || nombre?.toLowerCase().includes(adminRole));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleNavClick = (section) => {
        if (location.pathname === '/') {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/', { state: { scrollTo: section } });
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-transparent text-white p-6 flex justify-between items-center bg-linear-to-b from-black/70 to-transparent">
            <div className="flex items-center gap-4">
                <Link title="Inicio" to="/">
                    <img 
                        src={logo} 
                        alt="Logo Kone" 
                        className="w-24 h-auto object-contain cursor-pointer" 
                    />
                </Link>
            </div>
            
           
<div className="hidden md:flex gap-8 font-medium uppercase text-xs tracking-[0.2em]">
    <button 
        onClick={() => handleNavClick('inicio')} 
        className="hover:text-[#6A8E23] transition-colors"
    >
        Inicio
    </button>
    
    <button 
        onClick={() => handleNavClick('menu')} 
        className="hover:text-[#6A8E23] transition-colors"
    >
        MENÚ
    </button>
    
    <button 
        onClick={() => handleNavClick('nosotros')} 
        className="hover:text-[#6A8E23] transition-colors"
    >
        Nosotros
    </button>
</div>

            <div className="flex gap-6 items-center">
                {token ? (
                    <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                        <Link to="/orders" className="text-[10px] uppercase tracking-widest hover:text-[#6A8E23] transition-colors">
                            Mis Pedidos
                        </Link>
                        <Link to="/profile" className="text-[10px] uppercase tracking-widest hover:text-[#6A8E23] transition-colors">
                            Mi Perfil
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className="text-[10px] uppercase tracking-widest hover:text-[#6A8E23] transition-colors">
                                Admin
                            </Link>
                        )}
                        <span className="text-[10px] uppercase tracking-widest text-[#6A8E23] font-bold">
                            Hola, {nombre}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="hover:text-red-500 transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" title="Iniciar Sesión">
                        <User className="w-5 h-5 cursor-pointer hover:text-[#6A8E23] transition-colors" />
                    </Link>
                )}

                <Link to="/cart" className="relative cursor-pointer group">
                    <ShoppingCart className="w-5 h-5 group-hover:text-[#6A8E23] transition-colors" />
                    {getItemCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#6A8E23] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                            {getItemCount()}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;