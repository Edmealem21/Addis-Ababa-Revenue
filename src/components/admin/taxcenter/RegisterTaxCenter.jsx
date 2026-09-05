import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const RegisterTaxCenter = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.address.trim()) {
      onRegister(formData);
      setFormData({ name: '', address: '' });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
      <div className="flex items-center gap-2.5 font-bold text-lg text-navy-800 dark:text-gold-400 mb-6 pb-3 border-b border-slate-100 dark:border-slate-700">
        <FaPlus className="text-gold-500" /> አዲስ ታክስ ማእከል ይመዝገቡ
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">የታክስ ማእከል ስም <span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="name"
              className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
              placeholder="ለምሳሌ: አዲስ አበባ ቦሌ"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">አድራሻ <span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="address"
              className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
              placeholder="አድራሻ ያስገቡ"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer">
            ይመዝገቡ
          </button>
          <button type="button" className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer flex items-center gap-1.5" onClick={onCancel}>
            <FaTimes /> ሰርዝ
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterTaxCenter;