import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Recibimos cart y setCart desde las props de App.js
const ProductList = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/productos`);
                setProductos(res.data);
            } catch (err) {
                console.error("Error al traer productos", err);
            }
        };
        fetchProductos();
    }, []);

    const agregarAlCarrito = (producto) => {
        // Ahora setCart sí será una función válida
        setCart([...cart, producto]); 
    };

    return (
        <>
            <div className="text-center mb-5">
                <p className="text-muted text-uppercase mb-1 small">Nuestras Recomendaciones</p>
                <h2 className="text-light fw-bold" style={{ fontFamily: 'Georgia, serif' }}>Especialidades de la Casa</h2>
            </div>
            
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {productos.map(p => (
                    <div className="col" key={p._id}>
                        <div className="card h-100 pizza-card shadow border-0">
                            <img 
                                src={`/${p.imagenUrl || p.imagen}`} 
                                className="card-img-top" 
                                alt={p.nombre}
                                style={{ height: '240px', objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => navigate(`/producto/${p._id}`)}
                            />
                            <div className="card-body text-center">
                                <h5 className="text-light fw-bold">{p.nombre}</h5>
                                <p className="text-success fw-bold">${p.precio}</p>
                                <button 
                                    className="btn btn-marca w-100"
                                    onClick={() => agregarAlCarrito(p)}
                                    disabled={p.stock <= 0}
                                >
                                    {p.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProductList;