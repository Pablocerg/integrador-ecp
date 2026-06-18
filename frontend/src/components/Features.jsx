import React from 'react';
import leavesIcon from '../assets/leaves-icon.png';
import ovenIcon from '../assets/oven-icon.png';
import chefIcon from '../assets/chef-icon.png';

export default function Features() {
  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
        
        <div className="flex flex-col items-center">
          <img 
            src={leavesIcon} 
            alt="Ingredientes naturales" 
            className="w-24 h-24 mb-6 object-contain" 
          />
          <h3 className="text-2xl font-bold text-zinc-100 mb-4">Recetas Tradicionales</h3>
          <p className="text-zinc-400 leading-relaxed">
            Seguimos métodos artesanales probados por generaciones, respetando la auténtica tradición italiana.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <img 
            src={ovenIcon} 
            alt="Horno tradicional" 
            className="w-24 h-24 mb-6 object-contain" 
          />
          <h3 className="text-2xl font-bold text-zinc-100 mb-4">Horno a Leña</h3>
          <p className="text-zinc-400 leading-relaxed">
            Nuestro horno tradicional alcanza la temperatura perfecta para lograr esa corteza crujiente y sabor ahumado.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <img 
            src={chefIcon} 
            alt="Nuestro Chef" 
            className="w-24 h-24 mb-6 object-contain" 
          />
          <h3 className="text-2xl font-bold text-zinc-100 mb-4">Pasión por la Calidad</h3>
          <p className="text-zinc-400 leading-relaxed">
            Cada pizza es elaborada con dedicación y amor por nuestro equipo, garantizando una experiencia memorable.
          </p>
        </div>

      </div>
    </section>
  );
}