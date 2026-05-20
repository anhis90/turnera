import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';

export const Promotions = () => {
  const promotions = [
    {
      id: 'general',
      title: 'Belleza y Estética',
      image: '/images/placas/general.png',
      description: 'Todo lo que necesitás para realzar tu belleza en un solo lugar.'
    },
    {
      id: 'unas',
      title: 'Uñas Perfectas',
      image: '/images/placas/unas.png',
      description: 'Realzá tus manos con diseños prolijos, modernos y duraderos.'
    },
    {
      id: 'peluqueria',
      title: 'Peluquería Premium',
      image: '/images/placas/peluqueria.png',
      description: 'Cuidamos tu cabello con tratamientos profesionales para que luzca sano.'
    },
    {
      id: 'pestanas',
      title: 'Mirada Perfecta',
      image: '/images/placas/pestanas.png',
      description: 'Realzá tu mirada con servicios profesionales y resultados delicados.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {promotions.map((promo) => (
          <motion.div 
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-violet/10 group"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-center">
                <a 
                  href={promo.image} 
                  download={`Placa_Turnera_${promo.title}.png`}
                  className="flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-colors"
                >
                  <Download size={16} /> Descargar
                </a>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-brand-dark transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black text-brand-dark font-serif">{promo.title}</h3>
              <p className="text-gray-500 font-medium mt-2 leading-relaxed">{promo.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
