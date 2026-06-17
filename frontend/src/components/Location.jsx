import React from 'react';
import addressIcon from '../assets/location-icon.png';
import hoursIcon from '../assets/time-icon.png';
import phoneIcon from '../assets/phone-icon.png';

export default function Location() {
  
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3394.048744955375!2d-58.2355555!3d-32.4844444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afdb98e6c7478d%3A0x6b864a7c1b5a5e5a!2sAlberdi%20908%2C%20E3260%20Concepci%C3%B3n%20del%20Uruguay%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1710790000000!5m2!1ses-419!2sar";

  return (
    <section id="nosotros" className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-10">
          
          <div className="flex items-center gap-6">
            <img 
              src={addressIcon} 
              alt="Dirección" 
              className="w-16 h-16 object-contain" 
            />
            <div>
              <h4 className="font-bold text-xl text-zinc-100">Dirección</h4>
              <p className="text-zinc-400">Alberdi 908, E3260, Concepción del Uruguay, Entre Ríos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <img 
              src={hoursIcon} 
              alt="Horario" 
              className="w-16 h-16 object-contain" 
            />
            <div>
              <h4 className="font-bold text-xl text-zinc-100">Horario</h4>
              <p className="text-zinc-400">Abre todos los días a las 11:00 a 14:00 </p>
              <p className="text-zinc-400">Abre todos los días a las 20:00 a 24:00 </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <img 
              src={phoneIcon} 
              alt="Teléfono" 
              className="w-16 h-16 object-contain" 
            />
            <div>
              <h4 className="font-bold text-xl text-zinc-100">Teléfono</h4>
              <p className="text-zinc-400">03442 60-0104</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full h-450px rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500">
          <iframe 
            src={mapUrl}
            className="w-full h-full border-0"
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}