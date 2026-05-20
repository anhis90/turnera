import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, User, Phone, ShieldCheck, Upload, FileText, X, AlertCircle } from 'lucide-react';

export const BookingForm = ({ 
  formData, setFormData, 
  uploadData, setUploadData, 
  onSubmit, 
  canSubmit 
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const processFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("El archivo supera el límite de 5MB");
      return;
    }

    // Validate format
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Formato inválido. Solo JPG, PNG o PDF");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadData({ 
        file, 
        preview: file.type.startsWith('image/') ? reader.result : null, 
        name: file.name,
        type: file.type,
        receiptData: reader.result // We save the base64 string so it can be saved in local storage!
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setUploadData({ file: null, preview: null, name: '', type: '', receiptData: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMsg('');
  };

  // Convert bytes to readable size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="card-premium">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-brand-violet shadow-inner">
          <UserCheck size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-serif text-brand-dark">4. Confirmación</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tus datos para la reserva</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="relative group">
          <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-violet transition-colors" />
          <input 
            required 
            placeholder="Tu nombre y apellido" 
            className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-violet/20 focus:bg-white p-5 pl-14 rounded-3xl outline-none transition-all font-bold text-sm" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div className="relative group">
          <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-violet transition-colors" />
          <input 
            required 
            type="tel" 
            placeholder="Tu número de celular" 
            className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-violet/20 focus:bg-white p-5 pl-14 rounded-3xl outline-none transition-all font-bold text-sm" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
        </div>

        <div className="p-6 bg-yellow-50/50 rounded-3xl border border-yellow-100/50 space-y-4">
          <div className="flex items-center justify-between text-yellow-700">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <span className="text-[11px] font-black uppercase tracking-wider">Seña Obligatoria</span>
            </div>
            <span className="text-[10px] font-bold bg-yellow-100 px-2 py-1 rounded-lg">$1.000</span>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/jpeg,image/png,application/pdf" 
          />
          
          <AnimatePresence mode="wait">
            {!uploadData.file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  isDragging 
                    ? 'border-brand-violet bg-brand-violet/5 text-brand-violet scale-[1.02]' 
                    : 'border-yellow-200 text-yellow-600 hover:bg-yellow-100/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isDragging ? 'bg-brand-violet/20 text-brand-violet' : 'bg-yellow-100'
                }`}>
                  <Upload size={20} className={isDragging ? 'animate-bounce' : ''} />
                </div>
                <div className="text-center px-4">
                  <p className="font-black text-xs uppercase tracking-wider">Arrastrá tu comprobante</p>
                  <p className="text-[10px] opacity-60 mt-1 font-bold">o haz clic para seleccionar (JPG, PNG, PDF)</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative p-4 bg-white rounded-2xl border border-yellow-200 flex items-center gap-4 shadow-sm"
              >
                {uploadData.preview ? (
                  <img src={uploadData.preview} className="w-12 h-12 rounded-lg object-cover border border-gray-100" alt="preview" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                    <FileText size={24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{uploadData.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                    {uploadData.file ? formatBytes(uploadData.file.size) : ''} — Listo
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Eliminar comprobante"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          type="submit"
          disabled={!canSubmit} 
          className="w-full py-6 rounded-[2rem] bg-brand-violet text-white font-black text-sm hover:bg-brand-dark hover:shadow-2xl hover:shadow-brand-violet/40 transition-all shadow-xl shadow-brand-violet/20 disabled:opacity-30 disabled:grayscale uppercase tracking-[0.2em] mt-4 relative overflow-hidden group cursor-pointer"
        >
          <span className="relative z-10">Reservar Ahora</span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-violet-dark opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        {!uploadData.file && (
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-2 animate-pulse">
            * Se requiere el comprobante para habilitar la reserva
          </p>
        )}
      </form>
    </section>
  );
};
