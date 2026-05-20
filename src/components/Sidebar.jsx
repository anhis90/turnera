import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Sparkles, Home, ClipboardList, Layout, 
  Camera, Info, Settings, ChevronLeft 
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, onClick, isCollapsed }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm group relative overflow-hidden ${
      active 
        ? 'bg-brand-violet text-white shadow-xl shadow-brand-violet/40' 
        : 'text-white/40 hover:bg-white/5 hover:text-white'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active" 
        className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-violet-dark -z-10"
      />
    )}
    <span className={`${active ? 'text-white' : 'group-hover:text-white'} transition-colors`}>{icon}</span>
    {!isCollapsed && <span>{label}</span>}
    {active && !isCollapsed && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

export const Sidebar = ({ view, setView, isSidebarOpen, setIsSidebarOpen, isAdmin, setIsAdmin }) => {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-brand-dark text-white p-6 flex flex-col z-50 shadow-2xl transition-all duration-500 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="absolute -right-3 top-10 bg-brand-violet text-white p-1 rounded-full shadow-xl z-50 hover:scale-110 transition-transform"
      >
        {isSidebarOpen ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
      </button>

      <div className="flex flex-col items-center mb-10 overflow-hidden">
        <motion.div 
          whileHover={{ rotate: 15 }} 
          className="w-14 h-14 bg-gradient-to-tr from-brand-violet to-brand-pink-dark rounded-2xl flex items-center justify-center mb-4 shadow-xl cursor-pointer"
          onClick={() => setView('booking')}
        >
          <Sparkles size={28} className="text-white" />
        </motion.div>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h1 className="text-2xl font-bold font-serif tracking-tight">Turnera</h1>
            <p className="text-[9px] text-brand-pink-dark font-black tracking-[0.3em] uppercase mt-1">Estética Premium</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem icon={<Home size={20}/>} label="Inicio" active={view === 'booking'} onClick={() => setView('booking')} isCollapsed={!isSidebarOpen} />
        <SidebarItem icon={<ClipboardList size={20}/>} label="Mis Turnos" active={view === 'my-bookings'} onClick={() => setView('my-bookings')} isCollapsed={!isSidebarOpen} />
        <SidebarItem icon={<Layout size={20}/>} label="Servicios" active={view === 'services'} onClick={() => setView('services')} isCollapsed={!isSidebarOpen} />
        <SidebarItem icon={<Camera size={20}/>} label="Galería" active={view === 'gallery'} onClick={() => setView('gallery')} isCollapsed={!isSidebarOpen} />
        <SidebarItem icon={<Sparkles size={20}/>} label="Promociones" active={view === 'promotions'} onClick={() => setView('promotions')} isCollapsed={!isSidebarOpen} />
        <SidebarItem icon={<Info size={20}/>} label="Sobre Nosotros" active={view === 'about'} onClick={() => setView('about')} isCollapsed={!isSidebarOpen} />
      </nav>

      <div className="pt-8 border-t border-white/10 space-y-4">
        <button 
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm group relative overflow-hidden ${
            view === 'admin' 
              ? 'bg-brand-violet text-white shadow-xl shadow-brand-violet/40' 
              : 'bg-brand-violet/10 text-white/90 border border-brand-violet/20 hover:bg-brand-violet/20'
          }`} 
          onClick={() => {
            setIsAdmin(true);
            setView('admin');
          }}
        >
          <Settings size={18} className={view === 'admin' ? 'text-white' : 'text-brand-violet'} />
          {isSidebarOpen && <span>Panel Admin</span>}
          {view === 'admin' && isSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-50" />}
        </button>
      </div>
    </aside>
  );
};
