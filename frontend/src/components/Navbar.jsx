import React from 'react';
import { Link } from 'react-router-dom'; // Importante para la navegación sin recargar
import logo from '../assets/kone-logo-tight.jpeg'; // Asegúrate de que la ruta sea correcta
const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div className="container">
       
        <div className="flex items-center gap-4">
                <Link title="Inicio" to="/">
                    <img 
                        src={logo}
                        alt="Logo Kone" 
                        style={{ width: '120px', height: 'auto' }} // Ajusta los '120px' a tu gusto
                        className="img-fluid" 
                    />
                </Link>
            </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-collapse justify-content-end navbar-nav w-100">
            <li className="nav-item">
              <Link className="nav-link" to="/">MENÚ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">CONTACTO</Link> {/* <-- NUEVO BOTÓN */}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/registro">REGISTRARSE</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/carrito">
              {/* Esta es la línea que dibuja el carrito */}
              <i className="bi bi-cart fs-4"></i> 
              <span className="badge bg-success rounded-pill position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </span>
            </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;