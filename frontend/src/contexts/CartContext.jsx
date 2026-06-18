import { useState, useEffect } from 'react';
import { CartContext } from './cartContext.js';
import pizzaApi from '../api/pizzaApi';

/** Proveedor del contexto global del carrito. Sincroniza con MongoDB si el usuario está autenticado, o con localStorage si es anónimo. */
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isSynced, setIsSynced] = useState(false);

    const isLoggedIn = () => !!localStorage.getItem('token');

    /** Inicializa el carrito: fusiona carrito local con el del servidor al iniciar sesión. */
    useEffect(() => {
        const initCart = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const localItems = JSON.parse(savedCart);
                    if (localItems.length > 0) {
                        try {
                            for (const item of localItems) {
                                await pizzaApi.post('/cart/add', {
                                    producto: item._id,
                                    cantidad: item.quantity
                                });
                            }
                        } catch (e) {
                            console.error('Error merging local cart:', e);
                        }
                        localStorage.removeItem('cart');
                    }
                }
                try {
                    const data = await pizzaApi.get('/cart');
                    setCart(
                        data.items
                            ? data.items.map(item => ({
                                  _id: item.producto._id,
                                  nombre: item.producto.nombre,
                                  precio: item.producto.precio,
                                  descripcion: item.producto.descripcion,
                                  imagenUrl: item.producto.imagenUrl,
                                  stock: item.producto.stock,
                                  quantity: item.cantidad
                              }))
                            : []
                    );
                } catch {
                    setCart([]);
                }
            } else {
                const savedCart = localStorage.getItem('cart');
                setCart(savedCart ? JSON.parse(savedCart) : []);
            }
            setIsSynced(true);
        };
        initCart();
    }, []);

    useEffect(() => {
        if (isSynced && !localStorage.getItem('token')) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isSynced]);

    /** Agrega un producto al carrito. Si ya existe, incrementa la cantidad en 1. */
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
        if (isLoggedIn()) {
            pizzaApi.post('/cart/add', { producto: product._id, cantidad: 1 })
                .catch(err => console.error('Error syncing cart:', err));
        }
    };

    /** Elimina un producto del carrito por su ID. */
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
        if (isLoggedIn()) {
            pizzaApi.delete(`/cart/remove/${productId}`)
                .catch(err => console.error('Error syncing cart:', err));
        }
    };

    /** Actualiza la cantidad de un producto. Si quantity <= 0, lo elimina del carrito. */
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
        if (isLoggedIn()) {
            pizzaApi.put(`/cart/update/${productId}`, { cantidad: quantity })
                .catch(err => console.error('Error syncing cart:', err));
        }
    };

    /** Vacía el carrito por completo. */
    const clearCart = () => {
        setCart([]);
        if (isLoggedIn()) {
            pizzaApi.delete('/cart/clear')
                .catch(err => console.error('Error syncing cart:', err));
        }
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
    };

    const getItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const syncCartWithServer = async () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const localItems = JSON.parse(savedCart);
            if (localItems.length > 0) {
                try {
                    for (const item of localItems) {
                        await pizzaApi.post('/cart/add', {
                            producto: item._id,
                            cantidad: item.quantity
                        });
                    }
                } catch (e) {
                    console.error('Error merging local cart:', e);
                }
                localStorage.removeItem('cart');
            }
        }
        try {
            const data = await pizzaApi.get('/cart');
            setCart(
                data.items
                    ? data.items.map(item => ({
                          _id: item.producto._id,
                          nombre: item.producto.nombre,
                          precio: item.producto.precio,
                          descripcion: item.producto.descripcion,
                          imagenUrl: item.producto.imagenUrl,
                          stock: item.producto.stock,
                          quantity: item.cantidad
                      }))
                    : []
            );
        } catch {
            setCart([]);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotal,
            getItemCount,
            syncCartWithServer
        }}>
            {children}
        </CartContext.Provider>
    );
};