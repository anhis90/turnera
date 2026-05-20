import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Scissors, ChevronDown, Search, Check, Clock } from 'lucide-react';
import { SERVICES, CATEGORIES } from '../data/services';

export const ServiceSelect = ({ selectedService, setSelectedService }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter services by search term
  const filteredServices = SERVICES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (service) => {
    setSelectedService(service);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <section className={`card-premium relative transition-all duration-300 ${isOpen ? 'z-40' : 'z-10'}`} ref={dropdownRef}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet shadow-inner">
          <Layout size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-serif text-brand-dark">3. Servicio</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">¿Qué vamos a realizar?</p>
        </div>
      </div>

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-gray-50 border-2 text-left p-5 pl-14 pr-12 rounded-3xl outline-none transition-all font-bold text-sm cursor-pointer flex items-center justify-between select-none ${
            isOpen ? 'border-brand-violet/30 bg-white shadow-lg' : 'border-transparent hover:bg-gray-100/50'
          }`}
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-violet/60">
            <Scissors size={20} />
          </div>
          <span className={selectedService ? 'text-brand-dark font-black' : 'text-gray-400'}>
            {selectedService ? selectedService.name : 'Seleccionar un servicio...'}
          </span>
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-violet' : ''}`} 
          />
        </button>

        {/* Dropdown Options Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 mt-3 bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-30 overflow-hidden"
            >
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-50 relative">
                <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Buscar servicio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:bg-white focus:border-brand-violet/20 font-bold text-xs"
                />
              </div>

              {/* Categorized Options List */}
              <div className="max-h-72 overflow-y-auto p-4 space-y-4">
                {Object.keys(CATEGORIES).map(catKey => {
                  const catName = CATEGORIES[catKey];
                  const catServices = filteredServices.filter(s => s.category === catName);

                  if (catServices.length === 0) return null;

                  return (
                    <div key={catKey} className="space-y-2">
                      <h4 className="font-black text-[9px] text-brand-violet/60 uppercase tracking-[0.2em] px-3 mt-2">
                        {catName}
                      </h4>
                      <div className="space-y-1">
                        {catServices.map(s => {
                          const isSelected = selectedService?.id === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleSelect(s)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left font-bold text-xs cursor-pointer ${
                                isSelected 
                                  ? 'bg-brand-violet/5 text-brand-violet font-black' 
                                  : 'hover:bg-gray-50 text-gray-700 hover:text-brand-dark'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isSelected && <Check size={14} className="text-brand-violet" />}
                                <span>{s.name}</span>
                              </div>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                                isSelected ? 'bg-brand-violet/10 text-brand-violet' : 'bg-gray-100 text-gray-500'
                              }`}>
                                ${s.price.toLocaleString()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {filteredServices.length === 0 && (
                  <div className="py-8 text-center text-xs text-gray-400 font-bold">
                    No se encontraron servicios
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedService && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="mt-6 p-6 bg-brand-violet/[0.03] rounded-3xl border border-brand-violet/10 flex items-center gap-4 shadow-sm"
        >
          <img src={selectedService.image} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" alt="srv" />
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-brand-violet text-sm truncate">{selectedService.name}</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mt-1">
              <Clock size={12} />
              <span>{selectedService.duration}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-brand-dark">${selectedService.price.toLocaleString()}</p>
          </div>
        </motion.div>
      )}
    </section>
  );
};

