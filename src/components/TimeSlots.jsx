import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';

export const TimeSlots = ({ selectedDate, selectedTime, setSelectedTime, reservedSlots, allTimeSlots }) => {
  
  // Calculate if each slot is in the past (if today is selected)
  const isSlotInPast = useMemo(() => {
    const today = new Date();
    const isTodaySelected = 
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    return (timeStr) => {
      if (!isTodaySelected) return false;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hours, minutes, 0, 0);
      return slotTime < today;
    };
  }, [selectedDate]);

  return (
    <section className="card-premium">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet shadow-inner">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-serif text-brand-dark">2. Elegí un horario</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            Disponibles para {format(selectedDate, "eeee d 'de' MMMM", { locale: es })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {allTimeSlots.map(t => {
          const inPast = isSlotInPast(t);
          const isReserved = reservedSlots.includes(t) || inPast;
          const isSelected = selectedTime === t;
          
          return (
            <button
              key={`slot-${t}`}
              type="button"
              disabled={isReserved}
              onClick={() => setSelectedTime(t)}
              className={`flex flex-col items-center justify-center h-20 rounded-3xl border-2 transition-all duration-300 ${
                isSelected 
                  ? 'bg-brand-violet border-brand-violet text-white shadow-xl scale-105 z-10' 
                  : isReserved 
                    ? 'bg-rose-50/50 border-rose-100/50 text-rose-400 cursor-not-allowed opacity-60' 
                    : 'bg-emerald-50/40 border-emerald-100/50 text-emerald-700 hover:border-brand-violet/30 hover:bg-brand-violet/[0.02] cursor-pointer'
              }`}
            >
              <span className="text-lg font-black tracking-tighter">{t}</span>
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isSelected ? 'text-white/60' : 'opacity-60'}`}>
                {inPast ? 'Pasado' : isReserved ? 'Ocupado' : 'Libre'}
              </span>
              {!isReserved && !isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
              )}
              {isReserved && (
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

