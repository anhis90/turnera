import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Calendar as CalendarIcon, Clock, Sparkles,
  CheckCircle2, Menu, X, Phone, MapPin, Eye, FileText,
  Lock, ShieldCheck, LogOut
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import { Sidebar } from './components/Sidebar';
import { Calendar } from './components/Calendar';
import { TimeSlots } from './components/TimeSlots';
import { ServiceSelect } from './components/ServiceSelect';
import { BookingForm } from './components/BookingForm';
import { ServiceCard } from './components/ServiceCard';
import { AdminPanel } from './components/AdminPanel';
import { Gallery } from './components/Gallery';
import { Promotions } from './components/Promotions';

// Data & DB
import { SERVICES } from './data/services';
import { db } from './lib/db';

function App() {
  // Global State
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('booking');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin authentication state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const ADMIN_PASSWORD = 'turnera2026';

  const handleAdminAccess = () => {
    if (isAdmin) {
      setView('admin');
      return;
    }
    setShowAdminLogin(true);
    setAdminPassword('');
    setAdminError('');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setView('admin');
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Contraseña incorrecta. Acceso denegado.');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setView('booking');
  };

  // Booking State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [uploadData, setUploadData] = useState({ file: null, preview: null, name: '', type: '', receiptData: null });

  // Private search state for "Mis Turnos"
  const [myBookingsPhone, setMyBookingsPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  // Local-first persistence state
  const [bookings, setBookings] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load bookings from Local-First DB layer
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await db.getBookings();
        setBookings(data);
      } catch (e) {
        console.error("Failed to load bookings:", e);
      }
    };
    loadBookings();
  }, []);

  // Middleware wrapper that intercepts state setters from AdminPanel and MyBookings
  // to coordinate both React state updates and persistent DB changes (local + cloud sync)
  const handleSetBookings = async (updater) => {
    try {
      const current = await db.getBookings();
      const next = typeof updater === 'function' ? updater(current) : updater;

      // Update UI State immediately for high responsiveness
      setBookings(next);

      // A. Sync deletions
      const deleted = current.filter(c => !next.some(n => n.id === c.id));
      for (const d of deleted) {
        await db.deleteBooking(d.id);
      }

      // B. Sync updates (status or payment modification)
      const modified = next.filter(n => {
        const c = current.find(x => x.id === n.id);
        return c && (c.status !== n.status || c.payment !== n.payment);
      });
      for (const m of modified) {
        await db.updateBookingStatus(m.id, m.status, m.payment);
      }
    } catch (e) {
      console.error("Failed to update and sync bookings:", e);
    }
  };

  // Derived State
  const allTimeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const reservedForSelectedDate = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'Cancelado' && isSameDay(new Date(b.date), selectedDate))
      .map(b => b.time);
  }, [selectedDate, bookings]);

  const canSubmit = selectedService && selectedDate && selectedTime && formData.name && formData.phone && uploadData.file;

  // Handlers
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newBooking = {
      id: Date.now(),
      customer: formData.name,
      phone: formData.phone,
      service: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      status: "Pendiente",
      payment: "Validando",
      receipt: uploadData.name,
      receiptData: uploadData.receiptData // Send base64 data to DB!
    };

    try {
      const saved = await db.createBooking(newBooking);
      setBookings(prev => [...prev, saved]);
      setIsSuccess(true);

      // Auto-login to "Mis Turnos" using the phone number they just booked with!
      setMyBookingsPhone(formData.phone);
      setPhoneInput(formData.phone);

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setView('my-bookings');
        setSelectedService(null);
        setSelectedTime(null);
        setFormData({ name: '', phone: '' });
        setUploadData({ file: null, preview: null, name: '', type: '', receiptData: null });
      }, 3000);
    } catch (e) {
      console.error("Booking creation failed:", e);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar tu turno?')) {
      try {
        const updatedList = await db.cancelBooking(id);
        setBookings(updatedList);
      } catch (e) {
        console.error("Failed to cancel booking:", e);
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans selection:bg-brand-violet/20">

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          view={view}
          setView={setView}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isAdmin={isAdmin}
          handleAdminAccess={handleAdminAccess}
          handleAdminLogout={handleAdminLogout}
        />
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-brand-dark flex items-center justify-between px-6 z-[60] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-violet rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <h1 className="text-xl font-bold font-serif text-white tracking-tight">Turnera</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 bg-brand-dark z-[55] pt-24 px-6 flex flex-col"
          >
            <nav className="flex-1 space-y-4">
              {['booking', 'my-bookings', 'services', 'gallery', 'promotions', 'about'].map(v => (
                <button
                  key={v}
                  onClick={() => { setView(v); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left p-6 rounded-2xl font-black text-lg uppercase tracking-widest ${view === v ? 'bg-brand-violet text-white' : 'text-white/40'}`}
                >
                  {v === 'booking' ? 'Inicio' : v === 'my-bookings' ? 'Mis Turnos' : v === 'services' ? 'Servicios' : v === 'gallery' ? 'Galería' : v === 'promotions' ? 'Promociones' : 'Nosotros'}
                </button>
              ))}
            </nav>
            <div className="pb-10 border-t border-white/10 pt-6">
              <button
                onClick={() => { handleAdminAccess(); setIsMobileMenuOpen(false); }}
                className="w-full p-6 rounded-2xl bg-brand-violet/10 border border-brand-violet/20 text-brand-violet font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Lock size={18} />
                {isAdmin ? 'Panel Administrador' : 'Acceso Admin'}
              </button>
              {isAdmin && (
                <button
                  onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full mt-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Cerrar Sesión Admin
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-1 p-6 md:p-12 pt-28 lg:pt-12 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark font-serif tracking-tight leading-none">
              {view === 'booking' ? "Reserva tu Turno" :
                view === 'my-bookings' ? "Tus Reservas" :
                  view === 'services' ? "Nuestros Servicios" :
                    view === 'gallery' ? "Nuestra Galería" :
                      view === 'promotions' ? "Promociones y Ofertas" :
                        view === 'admin' ? "Administración" : "Nuestra Historia"}
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-1.5 w-12 bg-brand-violet rounded-full"></div>
              <p className="text-gray-400 font-bold tracking-tight text-sm md:text-base uppercase tracking-[0.1em]">
                {view === 'admin' ? "Gestión profesional de citas" : "Estética & Bienestar Premium"}
              </p>
            </div>
          </div>
          {view !== 'booking' && view !== 'admin' && (
            <button
              onClick={() => setView('booking')}
              className="flex items-center gap-3 px-8 py-5 rounded-[2rem] bg-brand-violet text-white font-black text-xs hover:bg-brand-dark transition-all shadow-2xl shadow-brand-violet/30 uppercase tracking-widest"
            >
              <Plus size={20} /> Nuevo Turno
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {view === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-8 space-y-8">
                <Calendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  setSelectedTime={setSelectedTime}
                />
                <TimeSlots
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  reservedSlots={reservedForSelectedDate}
                  allTimeSlots={allTimeSlots}
                />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <ServiceSelect
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                />
                <BookingForm
                  formData={formData}
                  setFormData={setFormData}
                  uploadData={uploadData}
                  setUploadData={setUploadData}
                  onSubmit={handleBookingSubmit}
                  canSubmit={canSubmit}
                />
              </div>
            </motion.div>
          )}

          {view === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20"
            >
              {SERVICES.map(s => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  onSelect={(srv) => { setSelectedService(srv); setView('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              ))}
            </motion.div>
          )}

          {view === 'my-bookings' && (
            <motion.div key="my-bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {!myBookingsPhone ? (
                <div className="max-w-md mx-auto card-premium py-12 px-8 text-center space-y-6 bg-white border border-gray-100 shadow-xl rounded-[2.5rem]">
                  <div className="w-16 h-16 bg-brand-violet/5 text-brand-violet rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Phone size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-serif text-brand-dark">Consulta tus Turnos</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      Ingresa tu número de celular registrado para ver el historial y estado de tus citas.
                    </p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setMyBookingsPhone(phoneInput); }} className="space-y-4">
                    <div className="relative group">
                      <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-violet transition-colors" />
                      <input
                        required
                        type="tel"
                        placeholder="Tu número de celular"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-violet/20 focus:bg-white p-5 pl-14 rounded-3xl outline-none transition-all font-bold text-sm text-brand-dark"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-brand-violet text-white font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all cursor-pointer shadow-md shadow-brand-violet/10"
                    >
                      Buscar Reservas
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-brand-violet/[0.03] border border-brand-violet/5 rounded-3xl gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Mostrando turnos para el celular:</p>
                      <h4 className="text-base font-black text-brand-dark mt-1">{myBookingsPhone}</h4>
                    </div>
                    <button
                      onClick={() => { setMyBookingsPhone(''); setPhoneInput(''); }}
                      className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-brand-violet uppercase tracking-widest hover:bg-brand-violet/5 transition-all shadow-sm cursor-pointer"
                    >
                      Consultar otro número
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {bookings.filter(b => b.phone.trim() === myBookingsPhone.trim()).map(b => (
                      <div key={b.id} className="card-premium relative overflow-hidden group border-none shadow-xl bg-white">
                        <div className="absolute top-0 right-0 p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${b.status === 'Confirmado' ? 'bg-green-100 text-green-600' :
                              b.status === 'Cancelado' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-600'
                            }`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-5 mb-8">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-brand-violet/5 flex items-center justify-center text-brand-violet shadow-inner">
                            <Sparkles size={28} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-800 text-lg leading-none">{b.customer}</h4>
                            <p className="text-[10px] text-brand-violet font-black uppercase tracking-[0.2em] mt-2">{b.service}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                          <div className="flex items-center gap-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                            <CalendarIcon size={16} className="text-brand-violet/40" />
                            {format(new Date(b.date), "d MMM", { locale: es })}
                          </div>
                          <div className="flex items-center gap-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                            <Clock size={16} className="text-brand-violet/40" />
                            {b.time} HS
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-gray-400">
                          <span>Seña: {b.payment === 'Pagado' ? 'Aprobada ($1.000)' : b.payment === 'Rechazado' ? 'Rechazada' : 'Validando...'}</span>
                        </div>

                        {b.status === 'Pendiente' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="w-full mt-6 py-4 rounded-2xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                          >
                            Cancelar Reserva
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {bookings.filter(b => b.phone.trim() === myBookingsPhone.trim()).length === 0 && (
                    <div className="py-32 text-center space-y-8">
                      <div className="w-24 h-24 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-center mx-auto text-brand-violet/20">
                        <CalendarIcon size={48} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">No tienes reservas registradas</h3>
                        <p className="text-gray-400 mt-2">¿Quieres agendar tu primer momento de bienestar?</p>
                      </div>
                      <button
                        onClick={() => setView('booking')}
                        className="px-10 py-5 bg-brand-violet text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-brand-violet/30 transition-all cursor-pointer"
                      >
                        Reservar Ahora
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === 'gallery' && <Gallery key="gallery" />}

          {view === 'promotions' && <Promotions key="promotions" />}

          {view === 'admin' && isAdmin && <AdminPanel bookings={bookings} setBookings={handleSetBookings} />}

          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <span className="text-brand-violet font-black text-xs uppercase tracking-[0.4em] bg-brand-violet/5 px-4 py-2 rounded-full">Nuestra Identidad</span>
                  <h3 className="text-6xl md:text-7xl lg:text-8xl font-black font-serif text-brand-dark leading-[0.9] tracking-tighter">Elevamos la <br /> belleza a un <br /> <span className="text-brand-gold italic">arte.</span></h3>
                </div>
                <p className="text-xl text-gray-500 leading-relaxed font-medium max-w-lg">Turnera nació como un santuario de estética donde la precisión técnica se encuentra con la calidez humana. Cada tratamiento es una obra diseñada exclusivamente para realzar tu esencia única.</p>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { v: '8+', l: 'Años' },
                    { v: '15k', l: 'Citas' },
                    { v: '100%', l: 'Amor' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-8 bg-white rounded-[2.5rem] shadow-xl shadow-brand-violet/5 border border-brand-violet/5 group hover:bg-brand-violet transition-all duration-500">
                      <p className="text-4xl font-black text-brand-violet font-serif group-hover:text-white transition-colors">{stat.v}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-2 tracking-widest group-hover:text-white/60 transition-colors">{stat.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-10 bg-brand-violet/5 rounded-[5rem] group-hover:rotate-0 transition-transform -z-10 rotate-3 duration-1000"></div>
                <div className="relative rounded-[4rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1600948836101-f9ffdb59d3e1?auto=format&fit=crop&q=80&w=1000" className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="about" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp */}
        <a href="https://wa.me/1145282455" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 md:w-20 md:h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[100] group">
          <Phone size={28} className="md:w-8 md:h-8" />
          <motion.div initial={{ opacity: 0, x: 20 }} whileHover={{ opacity: 1, x: 0 }} className="absolute right-full mr-6 bg-white text-brand-dark px-8 py-4 rounded-[2rem] text-xs font-black shadow-2xl whitespace-nowrap text-brand-violet uppercase tracking-widest border border-brand-violet/10 pointer-events-none hidden md:block">
            ¿Tenés dudas? Chateemos
          </motion.div>
        </a>

        {/* Success Modal */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-brand-dark/95 backdrop-blur-md flex items-center justify-center z-[200] p-6">
              <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="card-premium max-w-md w-full py-24 text-center space-y-10 border-none bg-white shadow-[0_0_100px_rgba(109,40,217,0.3)]">
                <div className="w-40 h-40 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                  <CheckCircle2 size={80} />
                  <motion.div animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-green-100 rounded-full" />
                </div>
                <div className="space-y-6 px-4">
                  <h3 className="text-5xl font-black font-serif text-brand-dark leading-tight">¡Reserva Exitosa!</h3>
                  <p className="text-gray-400 font-medium italic text-lg">"Tu momento de belleza está confirmado. Te esperamos con amor."</p>
                </div>
                <div className="w-16 h-2 bg-brand-violet/20 rounded-full mx-auto animate-pulse"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Login Modal */}
        <AnimatePresence>
          {showAdminLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-dark/90 backdrop-blur-lg flex items-center justify-center z-[210] p-6"
              onClick={() => setShowAdminLogin(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-white rounded-[2.5rem] max-w-md w-full overflow-hidden shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-10 text-center space-y-8">
                  {/* Lock Icon */}
                  <div className="relative mx-auto w-20 h-20">
                    <div className="w-20 h-20 bg-brand-violet/10 text-brand-violet rounded-full flex items-center justify-center shadow-inner">
                      <Lock size={36} />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      className="absolute inset-0 bg-brand-violet/10 rounded-full"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-serif text-brand-dark">Acceso Administrador</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      Ingresá la contraseña para acceder al panel de gestión de turnos.
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleAdminLogin} className="space-y-5">
                    <div className="relative group">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-violet transition-colors" />
                      <input
                        id="admin-password"
                        name="admin-password"
                        required
                        type="password"
                        placeholder="Contraseña"
                        value={adminPassword}
                        onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                        autoFocus
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-violet/20 focus:bg-white p-5 pl-14 rounded-3xl outline-none transition-all font-bold text-sm text-brand-dark"
                      />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {adminError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-2xl"
                        >
                          <X size={14} />
                          {adminError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      className="w-full py-5 rounded-2xl bg-brand-violet text-white font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all cursor-pointer shadow-lg shadow-brand-violet/20 flex items-center justify-center gap-3"
                    >
                      <ShieldCheck size={18} />
                      Ingresar al Panel
                    </button>
                  </form>

                  <button
                    onClick={() => setShowAdminLogin(false)}
                    className="text-[10px] text-gray-400 hover:text-brand-violet font-black uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-32 border-t border-gray-100 pt-16 pb-24 text-center space-y-10">
          <div className="flex justify-center gap-12 text-xs font-black text-gray-300 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-brand-violet transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-violet transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-violet transition-colors">Pinterest</a>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-brand-violet" />
              <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.6em]">Turnera Premium Estética © 2026</p>
            </div>
            <p className="text-[9px] text-gray-200 font-bold uppercase tracking-[0.2em]">Diseñado para la excelencia en belleza</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
