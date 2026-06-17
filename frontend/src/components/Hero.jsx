import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const bgImage = "http://localhost:5000/images/fondo_1.jpeg";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative h-screen w-full flex items-center overflow-hidden bg-zinc-900">
            <div className="absolute inset-0 z-0">
                <img 
                    src={bgImage} 
                    alt="Horno a leña" 
                    className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute bottom-[38%] right-[32%] flex z-80">
                    <div className="vapor">
                        <span style={{ "--i": 1 }}></span>
                        <span style={{ "--i": 3 }}></span>
                        <span style={{ "--i": 16 }}></span>
                        <span style={{ "--i": 5 }}></span>
                        <span style={{ "--i": 13 }}></span>
                        <span style={{ "--i": 20 }}></span>
                    </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 px-8 md:px-24 max-w-4xl text-white pt-20">
                <p className="text-[#6A8E23] uppercase tracking-[0.4em] font-bold mb-4 text-xs md:text-sm">
                    Pizzería Artesanal
                </p>
                
                <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 leading-[1.1]">
                    El Sabor de la <br /> 
                    <span className="italic font-light text-white/90 text-4xl md:text-7xl">Tradición</span>
                </h1>
                
                <p className="text-base md:text-lg text-gray-300 mb-10 max-w-md leading-relaxed">
                    Pizzas elaboradas con ingredientes frescos y masa madre, horneadas en horno a leña para un sabor auténtico e inigualable. ¡Descubre su sabor en cada bocado!
                </p>

                <div className="flex flex-wrap gap-5">
                
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-[#6A8E23] hover:bg-[#5a7a1e] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all cursor-pointer"
                    >
                        HEY !! Regístrate para usar el carrito !!! 
                        
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;