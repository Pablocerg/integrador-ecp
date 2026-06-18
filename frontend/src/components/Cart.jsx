import { useCart } from '../hooks/useCart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Debes iniciar sesión para proceder al pago');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif italic mb-4">Tu Carrito Está Vacío</h1>
                    <p className="text-gray-400">Agrega algunas pizzas deliciosas para comenzar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-serif italic text-center mb-16 tracking-tight">Tu Carrito</h1>

                <div className="space-y-6">
                    {cart.map((item) => (
                        <div key={item._id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                            <img
                                src={item.imagenUrl}
                                alt={item.nombre}
                                className="w-24 h-24 object-cover rounded-lg"
                            />

                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{item.nombre}</h3>
                                <p className="text-gray-400 text-sm">{item.descripcion}</p>
                                <p className="text-[#6A8E23] font-bold mt-2">${item.precio}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="w-8 text-center font-semibold">{item.quantity}</span>

                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-bold">${(item.precio * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:text-red-400 mt-2 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-zinc-900 border border-white/5 rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Total del Pedido</h2>
                        <span className="text-3xl font-bold text-[#6A8E23]">${getTotal().toFixed(2)}</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={clearCart}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-full font-bold uppercase text-sm tracking-[0.2em] transition-colors"
                        >
                            Vaciar Carrito
                        </button>

                        <button
                            onClick={handleCheckout}
                            className="flex-1 bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-4 rounded-full font-bold uppercase text-sm tracking-[0.2em] transition-colors"
                        >
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;