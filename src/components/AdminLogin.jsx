import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AdminLogin = ({ setIsAdmin, setView }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const envPass = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD;
  const ADMIN_PASSWORD = envPass || 'admin123';

  const submit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try { localStorage.setItem('isAdmin', 'true'); } catch (e) {}
      setView('admin');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/85 backdrop-blur-md z-[210] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-brand-dark font-serif">Acceso Administrador</h3>
            <p className="text-xs text-gray-400 mt-1">Ingresá la contraseña de administrador para continuar.</p>
          </div>
          <button onClick={() => setView('booking')} className="p-2 text-gray-400 hover:text-brand-dark">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Contraseña"
            className="w-full p-4 rounded-2xl border border-gray-100 focus:border-brand-violet/20 outline-none font-bold"
          />
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-3 bg-brand-violet text-white rounded-2xl font-black uppercase text-xs">Entrar</button>
          </div>
        </form>
        <p className="mt-4 text-[10px] text-gray-400">Nota: configura `VITE_ADMIN_PASSWORD` en tu .env para cambiar la contraseña por defecto.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
