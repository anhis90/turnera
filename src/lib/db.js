import { supabase } from './supabase';

const BOOKINGS_KEY = 'turnera_bookings';

// Initial seed bookings to show in the system when empty
const SEED_BOOKINGS = [
  {
    id: 1,
    customer: "Anabela García",
    phone: "1122334455",
    service: "Uñas Gel",
    date: new Date().toISOString(), // Today
    time: "10:00",
    status: "Confirmado",
    payment: "Pagado",
    receipt: "comprobante_anabela.png",
    receiptData: null, // Seed doesn't have image data
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 2,
    customer: "Sofía Martínez",
    phone: "1199887766",
    service: "Botox Capilar",
    date: new Date().toISOString(), // Today
    time: "14:00",
    status: "Pendiente",
    payment: "Validando",
    receipt: "transferencia_sofia.pdf",
    receiptData: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const db = {
  /**
   * Get all bookings (local + optional Supabase merge)
   */
  async getBookings() {
    // 1. Try to fetch from Supabase if keys are configured
    if (this._isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('date', { ascending: true });

        if (!error && data) {
          // Sync local storage with fetched data
          localStorage.setItem(BOOKINGS_KEY, JSON.stringify(data));
          return data.map(b => ({ ...b, date: new Date(b.date) }));
        }
      } catch (e) {
        console.warn("Supabase fetch failed, falling back to local database", e);
      }
    }

    // 2. Local Storage Fallback
    const saved = localStorage.getItem(BOOKINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(b => ({ ...b, date: new Date(b.date) }));
      } catch (e) {
        console.error("Error parsing local bookings, resetting...", e);
      }
    }

    // Initialize with seed data if empty
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(SEED_BOOKINGS));
    return SEED_BOOKINGS.map(b => ({ ...b, date: new Date(b.date) }));
  },

  /**
   * Create a new booking
   */
  async createBooking(booking) {
    const newBooking = {
      id: booking.id || Date.now(),
      customer: booking.customer,
      phone: booking.phone,
      service: booking.service,
      date: new Date(booking.date).toISOString(),
      time: booking.time,
      status: booking.status || "Pendiente",
      payment: booking.payment || "Validando",
      receipt: booking.receipt || "",
      receiptData: booking.receiptData || null, // Base64 data for visual inspection
      createdAt: new Date().toISOString()
    };

    // Save locally
    const current = await this.getBookings();
    const updated = [...current, newBooking];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));

    // Try to sync with Supabase
    if (this._isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('bookings')
          .insert([newBooking]);
        if (error) console.error("Supabase insert error:", error);
      } catch (e) {
        console.warn("Supabase sync failed, booking saved locally only", e);
      }
    }

    return { ...newBooking, date: new Date(newBooking.date) };
  },

  /**
   * Update booking status and payment status
   */
  async updateBookingStatus(id, status, paymentStatus) {
    const current = await this.getBookings();
    const updated = current.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: status !== undefined ? status : b.status,
          payment: paymentStatus !== undefined ? paymentStatus : b.payment,
          date: new Date(b.date).toISOString() // Convert to ISO before saving
        };
      }
      return { ...b, date: new Date(b.date).toISOString() };
    });

    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));

    // Try to sync update to Supabase
    if (this._isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({
            status: status,
            payment: paymentStatus
          })
          .eq('id', id);
        if (error) console.error("Supabase update error:", error);
      } catch (e) {
        console.warn("Supabase sync failed, updated locally", e);
      }
    }

    return updated.map(b => ({ ...b, date: new Date(b.date) }));
  },

  /**
   * Cancel booking from customer side
   */
  async cancelBooking(id) {
    return this.updateBookingStatus(id, 'Cancelado', 'Rechazado');
  },

  /**
   * Delete booking physically from database
   */
  async deleteBooking(id) {
    const current = await this.getBookings();
    const updated = current
      .filter(b => b.id !== id)
      .map(b => ({ ...b, date: new Date(b.date).toISOString() }));

    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));

    if (this._isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);
        if (error) console.error("Supabase delete error:", error);
      } catch (e) {
        console.warn("Supabase sync failed, deleted locally", e);
      }
    }

    return updated.map(b => ({ ...b, date: new Date(b.date) }));
  },

  /**
   * Check if a specific slot is already taken on a given day
   */
  async isSlotBooked(date, time) {
    const bookings = await this.getBookings();
    const checkDate = new Date(date);
    return bookings.some(b => 
      b.status !== 'Cancelado' &&
      b.time === time &&
      this._isSameDate(new Date(b.date), checkDate)
    );
  },

  /**
   * Helper to check if Supabase is actually configured with non-placeholder credentials
   */
  _isSupabaseConfigured() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && anon && url !== 'your-project-url' && anon !== 'your-anon-key';
  },

  /**
   * Date helper to compare absolute year/month/day
   */
  _isSameDate(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
};
