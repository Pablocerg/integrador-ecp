import React from 'react';

import iconIngredientes from '../assets/icon-ingredientes.png';
import iconDelivery from '../assets/icon-delivery.png';
import iconCalidad from '../assets/icon-calidad.png';
import iconPrecios from '../assets/icon-precios.png';

export default function Benefits() {
  const items = [
    { title: "Ingredientes Frescos", desc: "Seleccionados diariamente", icon: iconIngredientes },
    { title: "Delivery Rápido", desc: "Caliente a tu puerta", icon: iconDelivery },
    { title: "Alta Calidad", desc: "Garantía en cada bocado", icon: iconCalidad },
    { title: "Precios Justos", desc: "Calidad accesible", icon: iconPrecios },
  ];

  return (
    <section className="bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center border border-zinc-100">
            
            
            <img 
              src={item.icon} 
              alt={item.title} 
              className="w-12 h-12 mb-3 object-contain" 
            />
            

            <h4 className="font-bold text-green-400 text-sm uppercase tracking-wider">{item.title}</h4>
            <p className="text-xs text-white mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}