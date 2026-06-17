import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { toast } from 'react-toastify';
import pizzaApi from '../api/pizzaApi';
import { ArrowLeft } from 'lucide-react';

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const data = await pizzaApi.get(`/products/${id}`);
                console.log('Producto cargado:', data);
                setProducto(data);
                setError('');
            } catch (err) {
                console.error('Error al cargar el producto:', err);
                setError('No se pudo cargar el producto. Intenta más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const handleAddToCart = () => {
        if (producto) {
            for (let i = 0; i < cantidad; i++) {
                addToCart(producto);
            }
            toast.success(`${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de ${producto.nombre} agregadas al carrito!`);
            setCantidad(1);
        }
    };

    const decrementarCantidad = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
    };

    const incrementarCantidad = () => {
        setCantidad(cantidad + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <p className="text-white text-xl">Cargando producto...</p>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center px-6">
                <p className="text-red-500 text-xl mb-6">{error || 'Producto no encontrado'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-3 px-6 rounded-full font-bold uppercase text-sm tracking-widest transition-all"
                >
                    <ArrowLeft size={20} />
                    Volver al inicio
                </button>
            </div>
        );
    }

    const precioTotal = (producto.precio * cantidad).toFixed(2);

    return (
        <div className="min-h-screen bg-[#1A1A1A] py-12 px-6">
            <div className="max-w-6xl mx-auto">
                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-900/50 rounded-3xl p-8 md:p-12 border border-white/5">
                    
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl bg-zinc-800">
                            {producto.imagenUrl ? (
                                <img
                                    src={producto.imagenUrl}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('Error al cargar la imagen:', e);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <p>Imagen no disponible</p>
                                </div>
                            )}
                            <span className="absolute top-4 right-4 bg-[#6A8E23] text-white text-sm font-bold py-2 px-4 rounded-full">
                                ${producto.precio}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="text-[#6A8E23] uppercase tracking-[0.2em] text-xs font-bold mb-3">
                                {producto.categoria}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-serif text-white italic mb-6 tracking-tight">
                                {producto.nombre}
                            </h1>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                {producto.descripcion}
                            </p>

                            <div className="bg-black/50 rounded-xl p-6 mb-8 border border-white/10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm uppercase tracking-widest">Categoría</p>
                                        <p className="text-white font-semibold mt-2">{producto.categoria}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm uppercase tracking-widest">Stock</p>
                                        <p className={`font-semibold mt-2 ${producto.stock > 10 ? 'text-[#6A8E23]' : producto.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {producto.stock > 0 ? `${producto.stock} unidades` : 'Sin stock'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-black/50 rounded-xl p-6 mb-6 border border-white/10">
                                <p className="text-gray-300 uppercase tracking-widest text-sm font-semibold mb-4">
                                    Cantidad
                                </p>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={decrementarCantidad}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white w-12 h-12 rounded-lg font-bold text-xl transition-colors"
                                        aria-label="Disminuir cantidad"
                                    >
                                        -
                                    </button>
                                    <span className="text-white text-2xl font-bold w-12 text-center">
                                        {cantidad}
                                    </span>
                                    <button
                                        onClick={incrementarCantidad}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white w-12 h-12 rounded-lg font-bold text-xl transition-colors"
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="bg-linear-to-r from-[#6A8E23] to-[#5a7a1e] rounded-2xl p-6 mb-6">
                                <p className="text-white/80 uppercase tracking-widest text-xs font-semibold mb-2">
                                    Total ({cantidad} {cantidad === 1 ? 'unidad' : 'unidades'})
                                </p>
                                <p className="text-white text-4xl font-bold">
                                    ${precioTotal}
                                </p>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-5 rounded-full font-bold uppercase text-sm tracking-[0.2em] transition-all active:scale-95 shadow-lg mb-4"
                            >
                                Agregar al Carrito
                            </button>

                            <button
                                onClick={() => navigate('/#menu')}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all"
                            >
                                Ver más productos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;
