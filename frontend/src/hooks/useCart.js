import { useContext } from 'react';
import { CartContext } from '../contexts/cartContext';

/** Hook de acceso al contexto del carrito. Lanza error si se usa fuera de CartProvider. */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
