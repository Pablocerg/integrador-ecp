import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Recibimos cart y setCart desde las props de App.js
const ProductList = ({ cart, setCart }) => {
    const [productos, setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/productos');
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
                                onClick={() => setSelectedProduct(p)}
                                data-bs-toggle="modal"
                                data-bs-target="#detalleModal"
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

            {/* MODAL DE DETALLE */}
            <div className="modal fade" id="detalleModal" tabIndex="-1" aria-hidden="true" style={{zIndex: 1055}}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-dark text-light border-secondary">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title">{selectedProduct?.nombre}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-center">
                            <img src={`/${selectedProduct?.imagenUrl || selectedProduct?.imagen}`} className="img-fluid rounded mb-3" alt="" />
                            <p><span className="badge bg-marca">{selectedProduct?.categoria}</span></p>
                            <p className="text-white">{selectedProduct?.descripcion}</p>
                            <h3 className="text-success">${selectedProduct?.precio}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductList;