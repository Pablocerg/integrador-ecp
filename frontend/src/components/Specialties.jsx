import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { toast } from 'react-toastify';
import pizzaApi from '../api/pizzaApi';

const Specialties = () => {
    const [pizzas, setPizzas] = useState([]);
    const [error, setError] = useState('');
    const { addToCart } = useCart();
    
    const [visible, setVisible] = useState(6);

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const data = await pizzaApi.get('/products');
                setPizzas(data);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los productos. ¿Está el backend prendido?');
            }
        };

        fetchPizzas();
    }, []);

    const handleAddToCart = (pizza) => {
        addToCart(pizza);
        toast.success(`${pizza.nombre} agregada al carrito!`);
    };

    const loadMoreProducts = () => {
        setVisible((prevValue) => prevValue + 6);
    };

    return (
        <section className="bg-black/80 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                
                <div className="text-center mb-16">
                    <h2 className="text-[#6A8E23] uppercase tracking-[0.3em] text-xs font-bold mb-3">
                        Nuestra Selección
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-serif text-white italic">
                        Especialidades de la Casa
                    </h1>
                    <div className="w-24 h-2px bg-[#6A8E23] mx-auto mt-6"></div>
                </div>

                {error && (
                    <p className="text-red-500 text-center italic bg-red-500/10 p-4 rounded-xl max-w-md mx-auto border border-red-500/20">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {pizzas.slice(0, visible).map((pizza) => (
                        <div 
                            key={pizza._id} 
                            className="bg-zinc-900/50 border border-white/5 rounded-[30px] overflow-hidden hover:border-[#6A8E23]/30 transition-all duration-500 group shadow-xl backdrop-blur-xs flex flex-col h-full"
                        >
                            <div className="relative aspect-4/3 overflow-hidden bg-black">
                                <img 
                                    src={pizza.imagenUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591"} 
                                    alt={pizza.nombre} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-[#6A8E23] font-bold text-sm">
                                        ${pizza.precio}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1 justify-between">
                                <div>
                                    <span className="text-[#6A8E23]/80 text-xs uppercase tracking-widest font-semibold">
                                        {pizza.categoria}
                                    </span> 
                                    <br />  
                                    <Link to={`/producto/${pizza._id}`}>
                                        <h3 className="text-xl font-serif text-white mb-1 hover:text-[#6A8E23] transition-colors inline-block">
                                            {pizza.nombre}
                                        </h3>
                                    </Link>
                                    
                                    <p className="text-gray-400 text-sm leading-relaxed mt-3 mb-8 h-16 overflow-hidden">
                                        {pizza.descripcion}
                                    </p>
                                </div>
                                
                                <div className="flex gap-3 mt-auto">
                                    <button 
                                        onClick={() => handleAddToCart(pizza)}
                                        className="flex-1 bg-[#6A8E23] hover:bg-[#5a7a1e] text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all active:scale-95 cursor-pointer"
                                    >
                                        Al Carrito
                                    </button>
                                    <Link 
                                        to={`/producto/${pizza._id}`}
                                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center text-center"
                                    >
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {visible < pizzas.length && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={loadMoreProducts}
                            className="bg-[#6A8E23] hover:bg-[#5a7a1e] text-white px-10 py-4 rounded-full font-bold uppercase text-sm tracking-[0.15em] transition-all duration-300 shadow-xl hover:shadow-[#6A8E23]/20 active:scale-95 cursor-pointer"
                        >
                            Ver más productos
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Specialties;