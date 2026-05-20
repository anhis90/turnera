import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import { CATEGORIES } from '../data/services';

const GALLERY_ITEMS = [
  // Uñas
  { id: 'g1', category: 'Uñas', title: 'Uñas Gel Soft Pink', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600', description: 'Acabado brillante y prolijo de alta duración.' },
  { id: 'g2', category: 'Uñas', title: 'Nail Art Abstracto', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344cc?auto=format&fit=crop&q=80&w=600', description: 'Diseño hecho a mano por nuestras especialistas.' },
  { id: 'g3', category: 'Uñas', title: 'Uñas esculpidas en Poly Gel', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600', description: 'Extensión premium con estructura ultrarresistente.' },
  { id: 'g4', category: 'Uñas', title: 'Manicura Semipermanente', image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=600', description: 'Color sólido perfecto de acabado natural.' },

  // Peluquería
  { id: 'g5', category: 'Peluquería', title: 'Alisado Espejo', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600', description: 'Lacio perfecto y brillo tridimensional.' },
  { id: 'g6', category: 'Peluquería', title: 'Balayage Iluminado', image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=600', description: 'Difuminado natural para iluminar tu rostro.' },
  { id: 'g7', category: 'Peluquería', title: 'Nutrición y Botox', image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600', description: 'Tratamiento intensivo que elimina el frizz.' },
  
  // Pestañas y Estética
  { id: 'g8', category: 'Pestañas y Estética', title: 'Extensiones de Pestañas 1 a 1', image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80&w=600', description: 'Mirada profunda y volumen delicado.' },
  { id: 'g9', category: 'Pestañas y Estética', title: 'Lifting de Pestañas', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600', description: 'Curvatura natural y tinte de pestañas propias.' },
  { id: 'g10', category: 'Pestañas y Estética', title: 'Perfilado de Cejas', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600', description: 'Diseño personalizado de acuerdo a tu rostro.' }
];

export const Gallery = () => {
  const [filter, setFilter] = useState('Todos');

  const filteredItems = GALLERY_ITEMS.filter(item => 
    filter === 'Todos' || item.category === filter
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 w-fit select-none">
        {['Todos', ...Object.values(CATEGORIES)].map((cat) => (
          <button 
            key={cat} 
            type="button"
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              filter === cat
                ? 'bg-brand-violet text-white shadow-lg shadow-brand-violet/20' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid relative rounded-[2.5rem] overflow-hidden group shadow-lg cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src={item.image} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 block" 
                alt={item.title} 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-dark/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 text-white">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-pink-dark mb-1">{item.category}</span>
                <h4 className="text-xl font-bold font-serif leading-tight">{item.title}</h4>
                <p className="text-[10px] opacity-70 font-medium mt-2 line-clamp-2 italic">"{item.description}"</p>
              </div>
              <div className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="py-32 text-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <Camera size={40} className="text-gray-200" />
          </div>
          <p className="text-gray-400 font-medium">No se encontraron imágenes en esta categoría</p>
        </div>
      )}
    </div>
  );
};

