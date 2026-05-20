import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar as CalendarIcon, TrendingUp, CheckCircle2, 
  Clock, Trash2, Search, Filter, Check, X,
  Eye, Download, ClipboardList, AlertCircle, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ icon: Icon, label, value, trend, color }) => {
  const iconBgMap = {
    'brand-violet': 'bg-brand-violet/10 text-brand-violet',
    'yellow-500': 'bg-yellow-500/10 text-yellow-500',
    'green-500': 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="card-premium relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color === 'brand-violet' ? 'bg-brand-violet/5' : color === 'yellow-500' ? 'bg-yellow-500/5' : 'bg-green-500/5'} rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150`}></div>
      <div className="flex items-start justify-between relative z-10">
        <div className={`p-4 rounded-2xl ${iconBgMap[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-brand-dark mt-1">{value}</h3>
      </div>
    </div>
  );
};

export const AdminPanel = ({ bookings, setBookings }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [activeReceipt, setActiveReceipt] = useState(null); // stores booking object for modal

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'Pendiente').length;
    const confirmed = bookings.filter(b => b.status === 'Confirmado').length;
    return { total, pending, confirmed };
  }, [bookings]);

  const updateStatus = (id, newStatus, newPayment) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { 
          ...b, 
          status: newStatus !== undefined ? newStatus : b.status,
          payment: newPayment !== undefined ? newPayment : b.payment
        };
      }
      return b;
    }));
    // If active modal is the updated booking, update its state
    if (activeReceipt && activeReceipt.id === id) {
      setActiveReceipt(prev => ({
        ...prev,
        status: newStatus !== undefined ? newStatus : prev.status,
        payment: newPayment !== undefined ? newPayment : prev.payment
      }));
    }
  };

  const deleteBooking = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva de forma permanente?')) {
      setBookings(prev => prev.filter(b => b.id !== id));
      if (activeReceipt && activeReceipt.id === id) {
        setActiveReceipt(null);
      }
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        b.customer.toLowerCase().includes(search.toLowerCase()) || 
        b.phone.includes(search);
      const matchesStatus = 
        statusFilter === 'Todos' || 
        b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  return (
    <div className="space-y-10 pb-20">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard icon={ClipboardList} label="Total Reservas" value={stats.total} trend="+8%" color="brand-violet" />
        <StatCard icon={Clock} label="Pendientes" value={stats.pending} color="yellow-500" />
        <StatCard icon={CheckCircle2} label="Confirmadas" value={stats.confirmed} color="green-500" />
      </div>

      {/* Bookings Table */}
      <section className="card-premium !p-0 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold font-serif text-brand-dark">Gestión de Turnos</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Administrá y validá las reservas entrantes</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente o celular..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-brand-violet/20 focus:bg-white transition-all text-sm font-bold outline-none"
              />
            </div>
            
            {/* Status Filter Pill Selector */}
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto select-none border border-gray-100">
              {['Todos', 'Pendiente', 'Confirmado', 'Cancelado'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st 
                      ? 'bg-brand-violet text-white shadow-md' 
                      : 'text-gray-400 hover:text-brand-dark'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">Servicio</th>
                <th className="px-8 py-5">Fecha & Hora</th>
                <th className="px-8 py-5">Estado Pago</th>
                <th className="px-8 py-5">Estado Reserva</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => (
                <motion.tr 
                  layout
                  key={booking.id} 
                  className="group hover:bg-brand-violet/[0.01] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-violet/5 flex items-center justify-center text-brand-violet font-black text-xs">
                        {booking.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{booking.customer}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{booking.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-brand-violet bg-brand-violet/5 px-3 py-1 rounded-full">
                      {booking.service}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {format(new Date(booking.date), "d 'de' MMM", { locale: es })}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{booking.time} hs</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      booking.payment === 'Pagado' ? 'bg-green-100 text-green-600' : 
                      booking.payment === 'Rechazado' ? 'bg-red-100 text-red-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      Seña: {booking.payment === 'Validando' ? 'Validando' : booking.payment === 'Pagado' ? 'Pagado' : 'Rechazado'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      booking.status === 'Confirmado' ? 'bg-green-100 text-green-600' : 
                      booking.status === 'Cancelado' ? 'bg-red-100 text-red-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {booking.status === 'Pendiente' && (
                        <>
                          <button 
                            onClick={() => updateStatus(booking.id, 'Confirmado', 'Pagado')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                            title="Confirmar Reserva y Seña"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => updateStatus(booking.id, 'Cancelado', 'Rechazado')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            title="Rechazar y Cancelar"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setActiveReceipt(booking)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-brand-violet hover:bg-brand-violet/10 rounded-lg transition-colors cursor-pointer"
                        title="Ver Comprobante"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <ClipboardList size={40} />
            </div>
            <p className="text-gray-400 font-medium">No se encontraron reservas</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal for Receipt Verification */}
      <AnimatePresence>
        {activeReceipt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/85 backdrop-blur-md z-[210] flex items-center justify-center p-4"
            onClick={() => setActiveReceipt(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-brand-dark font-serif">Comprobante de Seña</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                    Cliente: {activeReceipt.customer} — {activeReceipt.phone}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveReceipt(null)}
                  className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Receipt Preview */}
              <div className="p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[300px] border-b border-gray-50">
                {activeReceipt.receiptData ? (
                  activeReceipt.receiptData.startsWith('data:application/pdf') || activeReceipt.receipt.endsWith('.pdf') ? (
                    <div className="text-center space-y-4 py-8">
                      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <FileText size={40} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 truncate max-w-xs mx-auto">
                          {activeReceipt.receipt || 'comprobante.pdf'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                          Documento PDF Adjunto
                        </p>
                      </div>
                      <a 
                        href={activeReceipt.receiptData} 
                        download={activeReceipt.receipt || 'comprobante_reserva.pdf'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-violet text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-colors shadow-md shadow-brand-violet/20"
                      >
                        <Download size={14} /> Descargar PDF
                      </a>
                    </div>
                  ) : (
                    <div className="relative group max-h-[400px] overflow-hidden rounded-2xl shadow-md border border-gray-200">
                      <img 
                        src={activeReceipt.receiptData} 
                        alt="Comprobante de pago" 
                        className="max-w-full h-auto max-h-[350px] object-contain block"
                      />
                      <a 
                        href={activeReceipt.receiptData} 
                        download={activeReceipt.receipt || 'comprobante_seña.png'}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full text-brand-dark shadow-lg hover:bg-brand-violet hover:text-white transition-all"
                        title="Descargar comprobante"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  )
                ) : (
                  <div className="text-center space-y-4 py-8 text-gray-400">
                    <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle size={40} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Comprobante de Semilla / Sin Datos</p>
                      <p className="text-[10px] uppercase font-black tracking-wider mt-1">
                        Archivo de demostración: {activeReceipt.receipt || 'comprobante_demo.png'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-white flex justify-between items-center gap-4">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    activeReceipt.status === 'Confirmado' ? 'bg-green-100 text-green-600' : 
                    activeReceipt.status === 'Cancelado' ? 'bg-red-100 text-red-600' : 
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    Reserva: {activeReceipt.status}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    activeReceipt.payment === 'Pagado' ? 'bg-green-100 text-green-600' : 
                    activeReceipt.payment === 'Rechazado' ? 'bg-red-100 text-red-600' : 
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    Pago: {activeReceipt.payment}
                  </span>
                </div>

                {activeReceipt.status === 'Pendiente' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(activeReceipt.id, 'Confirmado', 'Pagado')}
                      className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <Check size={14} /> Aprobar Seña
                    </button>
                    <button
                      onClick={() => updateStatus(activeReceipt.id, 'Cancelado', 'Rechazado')}
                      className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <X size={14} /> Rechazar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

