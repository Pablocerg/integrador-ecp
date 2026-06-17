export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-20 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl font-serif italic mb-6">Kone</h2>
          <p className="text-zinc-400 max-w-sm">Pizzería artesanal Italiana en Concepción del Uruguay. Ingredientes de primera calidad y recetas tradicionales desde 2020.</p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 tracking-widest uppercase text-sm">Contacto</h4>
          <p className="text-zinc-500 text-sm">Alberdi 908, E3260<br/>Concepción del Uruguay</p>
          <p className="text-zinc-500 text-sm mt-4">03442 60-0104</p>
          <p className="text-zinc-500 text-sm mt-4">pizzeriakone.soporte@gmail.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-zinc-600 text-xs">
        © 2026 Pizzeria Kone. Todos los derechos reservados.
      </div>
    </footer>
  );
}