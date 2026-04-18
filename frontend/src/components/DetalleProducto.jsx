import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetalleProducto = ({ cart, setCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/productos/${id}`);
                setProducto(res.data);
            } catch (err) {
                console.error("Error al traer el producto", err);
                setError("Producto no encontrado");
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    const agregarAlCarrito = (producto) => {
        setCart([...cart, producto]);
        alert("Producto agregado al carrito");
    };

    if (loading) return <div className="text-center text-light">Cargando...</div>;
    if (error) return <div className="text-center text-light">{error}</div>;

    return (
        <div className="container py-5">
            <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
                ← Volver
            </button>
            <div className="row">
                <div className="col-md-6">
                    <img 
                        src={`/${producto.imagenUrl || producto.imagen}`} 
                        className="img-fluid rounded" 
                        alt={producto.nombre} 
                    />
                </div>
                <div className="col-md-6 text-light">
                    <h2 className="fw-bold">{producto.nombre}</h2>
                    <p className="badge bg-marca mb-3">{producto.categoria}</p>
                    <p className="mb-4">{producto.descripcion}</p>
                    <h3 className="text-success mb-4">${producto.precio}</h3>
                    <button 
                        className="btn btn-marca w-100"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock <= 0}
                    >
                        {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;