// src/components/ictadmin/pages/Employees/IctUserData.jsx
import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaSearch, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../../context/LanguageContext';

const IctUserData = () => {
  const { t, tData } = useLanguage();
  const { employees, setEmployees } = useOutletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [identityForm, setIdentityForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleIdentityChange = (e) => {
    const { name, value } = e.target;
    setIdentityForm(prev => ({ ...prev, [name]: value }));
  };

  const openIdentityModal = (emp) => {
    setSelectedEmployee(emp);
    setIdentityForm({ username: '', password: '', confirmPassword: '' });
    setShowIdentityModal(true);
  };
  const closeIdentityModal = () => {
    setShowIdentityModal(false);
    setSelectedEmployee(null);
    setIdentityForm({ username: '', password: '', confirmPassword: '' });
  };

  const handleCreateIdentity = (e) => {
    e.preventDefault();
    if (!identityForm.username.trim()) { toast.error('እባክዎ የተጠቃሚ ስም ያስገቡ!'); return; }
    if (!identityForm.password.trim()) { toast.error('እባክዎ የይለፍ ቃል ያስገቡ!'); return; }
    if (identityForm.password !== identityForm.confirmPassword) {
      toast.error('የይለፍ ቃል እና ማረጋገጫ አይመሳሰሉም!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = employees.map(emp => emp.id === selectedEmployee.id ? { ...emp, identityCreated: true, username: identityForm.username } : emp);
      setEmployees(updated);
      setLoading(false);
      closeIdentityModal();
      toast.success('የተጠቃሚ መለያ ተፈጥሯል! ✅');
    }, 1000);
  };

  const handleDeleteIdentity = (empId) => {
    if (window.confirm('እርግጠኛ ነዎት ይህን መለያ መሰረዝ ይፈልጋሉ?')) {
      const updated = employees.map(emp => emp.id === empId ? { ...emp, identityCreated: false, username: undefined } : emp);
      setEmployees(updated);
      toast.success('መለያ ተሰርዟል! 🗑️');
    }
  };

  const filteredData = employees.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const rawName = (item.fullName || '').toLowerCase();
    const transName = (tData(item.fullName) || '').toLowerCase();
    const rawId = (item.idNumber || '').toLowerCase();
    const rawCenter = (item.taxCenter || '').toLowerCase();
    const transCenter = (tData(item.taxCenter) || '').toLowerCase();
    const rawRole = (item.jobCategory || item.role || '').toLowerCase();
    const transRole = (tData(item.jobCategory || item.role) || '').toLowerCase();
    const username = (item.username || '').toLowerCase();

    return (
      rawName.includes(term) ||
      transName.includes(term) ||
      rawId.includes(term) ||
      rawCenter.includes(term) ||
      transCenter.includes(term) ||
      rawRole.includes(term) ||
      transRole.includes(term) ||
      username.includes(term)
    );
  });

  return (
    <div className="p-4 md:p-6 w-full text-slate-800 dark:text-slate-100">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* FRAME HEADER */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex justify-end">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-3.5 py-2 w-full sm:w-72 focus-within:ring-2 focus-within:ring-navy-800/20 dark:focus-within:ring-gold-400/20 transition-all">
            <FaSearch className="text-slate-400 dark:text-slate-300 shrink-0 text-sm" />
            <input 
              type="text" 
              className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 w-full"
              placeholder={t('searchPlaceholder')} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredData.map((emp, idx) => {
            const identityCreated = emp.identityCreated || false;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1" key={emp.id}>
                <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 dark:bg-gold-500 text-white dark:text-slate-900 font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                      {(tData(emp.fullName) || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-base text-navy-800 dark:text-gold-400 line-clamp-1">{tData(emp.fullName)}</div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{tData(emp.jobCategory)}</div>
                    </div>
                  </div>
                  <span className="bg-navy-50 dark:bg-slate-700 text-navy-800 dark:text-gold-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-navy-100 dark:border-slate-600 shrink-0">#{idx + 1}</span>
                </div>

                <div className="p-4 space-y-2 text-sm flex-1">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🆔 {t('idNumber')}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{emp.idNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">💼 {t('jobCategory')}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(emp.jobCategory)}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🏢 {t('taxCenter')}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(emp.taxCenter)}</span>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/30 flex justify-center">
                  {!identityCreated ? (
                    <button 
                      className="w-full py-2 px-3 bg-red-600 hover:bg-red-400 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none cursor-pointer text-center" 
                      onClick={() => openIdentityModal(emp)}
                    >
                      {t('createAccount')}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <div className="relative group flex-1">
                        <button 
                          className="w-full py-2 px-3 bg-green-600  dark:bg-green-400 hover:cursor-not-allowed text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold border-none cursor-default text-center"
                        >
                          {t('accountCreated')}
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-20">
                          {t('accountCreatedTooltip')}
                        </div>
                      </div>
                      <button 
                        className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer shrink-0" 
                        title={t('deleteAccount')}
                        onClick={() => handleDeleteIdentity(emp.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="text-5xl mb-3">📭</div>
              <div className="text-base font-semibold">{t('noData')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Identity Modal */}
      {showIdentityModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeIdentityModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 font-bold text-base text-white">
                <FaPlus />
                <span>{t('createAccount')}</span>
              </div>
              <button className="text-emerald-100 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeIdentityModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleCreateIdentity}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('fullName')}</label>
                    <input type="text" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" value={tData(selectedEmployee.fullName)} disabled />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('username')} <span className="text-rose-500">*</span></label>
                    <input name="username" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={identityForm.username} onChange={handleIdentityChange} required autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('password')} <span className="text-rose-500">*</span></label>
                    <input type="password" name="password" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={identityForm.password} onChange={handleIdentityChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('confirmPassword')} <span className="text-rose-500">*</span></label>
                    <input type="password" name="confirmPassword" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={identityForm.confirmPassword} onChange={handleIdentityChange} required />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>{loading ? t('creating') : t('save')}</button>
                  <button type="button" className="px-5 py-2 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeIdentityModal}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IctUserData;