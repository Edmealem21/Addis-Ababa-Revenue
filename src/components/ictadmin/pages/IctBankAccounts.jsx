// src/components/ictadmin/pages/IctBankAccounts.jsx
import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

const IctBankAccounts = () => {
  const { t, tData } = useLanguage();
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, bankName: 'አዲስ ባንክ', accountNumber: '1000123456', accountOwner: 'አስቴር አለሙ', branch: 'ቅዱስ ጊዮርጊስ' },
    { id: 2, bankName: 'ኢትዮጵያ ንግድ ባንክ', accountNumber: '2000789012', accountOwner: 'ተስፋዬ መኮንን', branch: 'ቦሌ' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
  const [editFormData, setEditFormData] = useState({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const openRegister = () => { setFormData({ bankName: '', accountNumber: '', accountOwner: '', branch: '' }); setShowRegister(true); };
  const closeRegister = () => setShowRegister(false);

  const openView = (acc) => { setSelectedAccount(acc); setModalType('view'); };
  const openEdit = (acc) => { setSelectedAccount(acc); setEditFormData(acc); setModalType('edit'); };
  const openDelete = (acc) => { setSelectedAccount(acc); setModalType('delete'); };
  const closeActionModal = () => { setModalType(null); setSelectedAccount(null); };

  const getViewFields = (acc) => {
    if (!acc) return [];
    return [
      { label: t('bankName'), value: tData(acc.bankName) },
      { label: t('accountNumber'), value: acc.accountNumber },
      { label: t('accountOwner'), value: tData(acc.accountOwner) },
      { label: t('branch'), value: tData(acc.branch) },
    ];
  };

  const viewFields = getViewFields(selectedAccount);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.bankName.trim() || !formData.accountNumber.trim() || !formData.accountOwner.trim() || !formData.branch.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setBankAccounts([...bankAccounts, { id: bankAccounts.length + 1, ...formData }]);
      setLoading(false);
      closeRegister();
      toast.success('የባንክ መለያ ተመዝግቧል! ✅');
    }, 1000);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.bankName.trim() || !editFormData.accountNumber.trim() || !editFormData.accountOwner.trim() || !editFormData.branch.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = bankAccounts.map(acc => acc.id === selectedAccount.id ? { ...acc, ...editFormData } : acc);
      setBankAccounts(updated);
      setLoading(false);
      closeActionModal();
      toast.success('የባንክ መለያ ተስተካክሏል! ✅');
    }, 1000);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setBankAccounts(bankAccounts.filter(acc => acc.id !== selectedAccount.id));
      setLoading(false);
      closeActionModal();
      toast.success('የባንክ መለያ ተሰርዟል! 🗑️');
    }, 1000);
  };

  const filteredData = bankAccounts.filter(item =>
    item.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.accountOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 w-full text-slate-800 dark:text-slate-100">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* FRAME HEADER */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-4">
          <button 
            className="bg-blue-600 hover:bg-blue-400 dark:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm border-none cursor-pointer" 
            onClick={openRegister}
          >
            <FaPlus /> {t('addRecord')}
          </button>
          
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
          {filteredData.map((acc, idx) => (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1" key={acc.id}>
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                    🏦
                  </div>
                  <div>
                    <div className="font-bold text-base text-navy-800 dark:text-gold-400 line-clamp-1">{tData(acc.bankName)}</div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{tData(acc.branch)}</div>
                  </div>
                </div>
                <span className="bg-navy-50 dark:bg-slate-700 text-navy-800 dark:text-gold-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-navy-100 dark:border-slate-600 shrink-0">#{idx + 1}</span>
              </div>

              <div className="p-4 space-y-2 text-sm flex-1">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">💳 {t('accountNumber')}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{acc.accountNumber}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">👤 {t('accountOwner')}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(acc.accountOwner)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🏢 {t('branch')}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(acc.branch)}</span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/30 flex justify-end">
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" title={t('view')} onClick={() => openView(acc)}><FaEye /></button>
                  <button className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" title={t('edit')} onClick={() => openEdit(acc)}><FaEdit /></button>
                  <button className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" title={t('delete')} onClick={() => openDelete(acc)}><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="text-5xl mb-3">📭</div>
              <div className="text-base font-semibold">{t('noData')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeRegister}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaPlus className="text-gold-400" />
                <span>{t('registerNew')}</span>
              </div>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('bankName')} <span className="text-rose-500">*</span></label>
                    <input name="bankName" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.bankName} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('accountNumber')} <span className="text-rose-500">*</span></label>
                    <input name="accountNumber" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.accountNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('accountOwner')} <span className="text-rose-500">*</span></label>
                    <input name="accountOwner" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.accountOwner} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('branch')} <span className="text-rose-500">*</span></label>
                    <input name="branch" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.branch} onChange={handleChange} required />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>{loading ? t('registering') : t('register')}</button>
                  <button type="button" className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeRegister}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaEye className="text-gold-400" />
                <span>{t('details')}</span>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100 space-y-3">
              {viewFields.map((field, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/60 last:border-none">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{field.label}:</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{field.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button type="button" className="px-5 py-2 bg-red-600 hover:bg-red-400 text-white rounded-xl text-xs font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalType === 'edit' && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaEdit className="text-gold-400" />
                <span>{t('edit')}</span>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleEdit}>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('bankName')} <span className="text-rose-500">*</span></label>
                    <input name="bankName" className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.bankName} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('accountNumber')} <span className="text-rose-500">*</span></label>
                    <input name="accountNumber" className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.accountNumber} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('accountOwner')} <span className="text-rose-500">*</span></label>
                    <input name="accountOwner" className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.accountOwner} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('branch')} <span className="text-rose-500">*</span></label>
                    <input name="branch" className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.branch} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>{loading ? t('saving') : t('saveChanges')}</button>
                  <button type="button" className="px-5 py-2 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>{t('close')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalType === 'delete' && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 font-bold text-base text-white">
                <FaTrash />
                <span>{t('warning')}</span>
              </div>
              <button className="text-slate-200 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="p-6 text-center text-slate-800 dark:text-slate-100">
              <div className="text-5xl mb-3 text-rose-600">⚠️</div>
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2">{t('confirmDelete')}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
                <strong>{tData(selectedAccount.bankName)}</strong> ({selectedAccount.accountNumber})
              </p>
              <div className="flex justify-end gap-3">
                <button className="px-5 py-2.5 bg-rose-900 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" onClick={handleDelete} disabled={loading}>{t('delete')}</button>
                <button className="px-5 py-2.5 bg-red-600 bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>{t('cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IctBankAccounts;