import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Scissors, Heart, Star, Palette, Droplets, Zap, Eye, UserCheck, Calendar as CalendarIcon, Clock, User, Phone, Upload, CreditCard, ClipboardList, CheckCircle2 } from 'lucide-react';

const IconMap = { Scissors, Sparkles, Heart, Star, Palette, Droplets, Zap, Eye, UserCheck, CalendarIcon, Clock, User, Phone, Upload, CreditCard, ClipboardList, CheckCircle2 };

export const ServiceCard = ({ service, onSelect }) => {
  const Icon = IconMap[service.icon] || Sparkles;
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="card-premium !p-0 overflow-hidden group border-none shadow-xl bg-white flex flex-col h-full"
    >
      <div className="h-52 overflow-hidden relative">
        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={service.name} />
        <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors"></div>
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-xs font-black text-brand-violet shadow-lg">
          ${service.price.toLocaleString()}
        </div>
        <div className="absolute top-4 left-4 bg-brand-violet/90 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
          {service.category}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet shadow-inner">
              <Icon size={20} />
            </div>
            <h4 className="font-black text-gray-800 text-lg leading-tight">{service.name}</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 font-medium">{service.description}</p>
          <div className="flex items-center gap-4 text-[10px] font-black text-brand-violet/60 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Clock size={12}/> {service.duration}</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Calidad Premium</span>
          </div>
        </div>
        <button 
          onClick={() => onSelect(service)}
          className="w-full mt-8 py-4 rounded-2xl bg-brand-violet text-white text-[11px] font-black hover:bg-brand-dark hover:shadow-2xl hover:shadow-brand-violet/30 transition-all uppercase tracking-widest active:scale-95 shadow-xl shadow-brand-violet/10 cursor-pointer"
        >
          Reservar Turno
        </button>
      </div>
    </motion.div>
  );
};

