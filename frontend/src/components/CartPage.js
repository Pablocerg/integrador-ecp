
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CartPage = ({ cart, setCart }) => {
    const total = cart.reduce((acc, item) => acc + item.precio, 0);

    const eliminarDelCarrito = (index) => {
        const nuevoCarrito = cart.filter((_, i) => i !== index);
        setCart(nuevoCarrito);
    };

    const finalizarCompra = async () => {
        if (cart.length === 0) return;

        try {
            const usuarioId = "69c8b1ffacf8e93bb76eb34c"; 

            // 1. Crear el carrito principal
            const resCarrito = await axios.post('http://localhost:5001/api/carrito', { usuarioId });
            const cartId = resCarrito.data._id;

            // 2. Procesar cada producto: Guardar en carrito y actualizar stock
            await Promise.all(cart.map(async (producto) => {
                // Agregar producto al carrito en la DB
                await axios.post('http://localhost:5001/api/carrito/add', {
                    cartId: cartId,
                    productoId: producto._id,
                    cantidad: 1
                });

                await axios.put(`http://localhost:5001/api/productos/stock/${producto._id}`, {
                    cantidad: 1 
                });
            }));

            alert("¡Pedido enviado y stock actualizado con éxito!");
            setCart([]); 
        } catch (error) {
            console.error("Error al finalizar la compra:", error);
            alert("Hubo un problema al procesar tu pedido. Revisa la consola.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-light fw-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Tu Pedido</h2>
            
            {cart.length === 0 ? (
                <div className="text-center py-5 bg-dark border border-secondary rounded pizza-card">
                    <h4 className="text-white">Tu carrito está vacío </h4>
                    <Link to="/" className="btn btn-marca mt-3">Ver Menú</Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-8">
                        {cart.map((item, index) => (
                            <div key={index} className="card pizza-card mb-3 shadow-sm border-secondary">
                                <div className="row g-0 align-items-center">
                                    <div className="col-3 p-2">
                                        <img 
                                            src={`/${item.imagenUrl || item.imagen}`} 
                                            className="img-fluid rounded" 
                                            alt={item.nombre} 
                                            style={{ height: '80px', objectFit: 'cover', width: '100%' }} 
                                        />
                                    </div>
                                    <div className="col-6">
                                        <div className="card-body py-2">
                                            <h6 className="card-title text-light mb-0">{item.nombre}</h6>
                                            <p className="text-success fw-bold mb-0">${item.precio}</p>
                                        </div>
                                    </div>
                                    <div className="col-3 text-center">
                                        <button 
                                            className="btn btn-sm btn-outline-danger border-0" 
                                            onClick={() => eliminarDelCarrito(index)}
                                        >
                                            ✕ Quitar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                        <div className="card pizza-card p-4 shadow-lg border-secondary">
                            <h5 className="text-light mb-4 border-bottom border-secondary pb-2">Resumen</h5>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="text-white">Total a pagar:</span>
                                <span className="fs-4 fw-bold text-success">${total}</span>
                            </div>
                            <button 
                                className="btn btn-marca w-100 py-3 fw-bold text-uppercase"
                                onClick={finalizarCompra}
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;