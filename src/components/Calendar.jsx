import React, { useMemo, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const Calendar = ({ selectedDate, setSelectedDate, setSelectedTime }) => {
  // Separate the viewed month from the actual selected date
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate || new Date());

  // If selectedDate changes from another context, adjust currentMonth view to match
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const calendarDays = useMemo(() => {
    // Start week on Monday (1)
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const todayMidnight = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  return (
    <section className="card-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet shadow-inner">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-brand-dark">1. Seleccioná una fecha</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Elegí el día de tu visita</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white shadow-sm p-1 rounded-2xl border border-gray-100">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="p-3 text-gray-400 hover:text-brand-violet hover:bg-gray-50 rounded-xl transition-all"
          >
            <ChevronLeft size={20}/>
          </button>
          <span className="capitalize font-black text-brand-dark text-sm px-4 min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </span>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="p-3 text-gray-400 hover:text-brand-violet hover:bg-gray-50 rounded-xl transition-all"
          >
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-3 relative z-10">
        {dayNames.map((d, i) => (
          <div key={`d-${i}`} className="text-[10px] md:text-xs font-bold text-gray-400 py-3 uppercase tracking-[0.1em] md:tracking-[0.2em] text-center">
            <span className="hidden md:inline">{d}</span>
            <span className="inline md:hidden">{d.slice(0, 3)}</span>
          </div>
        ))}
        {calendarDays.map((day) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth() && day.getFullYear() === currentMonth.getFullYear();
          const isPast = day < todayMidnight;
          const isSel = selectedDate && isSameDay(day, selectedDate);
          const isTod = isToday(day);

          return (
            <button
              key={day.getTime()}
              type="button"
              onClick={() => { if(!isPast) { setSelectedDate(day); setSelectedTime(null); } }}
              disabled={isPast}
              className={`aspect-square flex flex-col items-center justify-center rounded-2xl md:rounded-3xl text-sm transition-all duration-300 relative ${
                isSel ? 'bg-brand-violet text-white shadow-2xl scale-105 z-10 font-bold' : 
                isTod ? 'bg-brand-violet/10 text-brand-violet font-black ring-2 ring-brand-violet/20' :
                !isCurrentMonth ? 'text-gray-300 opacity-40 hover:bg-gray-50/50' :
                isPast ? 'text-gray-200 cursor-not-allowed grayscale' : 'hover:bg-gray-50 text-gray-600 hover:text-brand-violet'
              }`}
            >
              <span className="font-bold">{format(day, 'd')}</span>
              {isTod && !isSel && <div className="w-1.5 h-1.5 rounded-full bg-brand-violet mt-1"></div>}
            </button>
          );
        })}
      </div>
    </section>
  );
};

