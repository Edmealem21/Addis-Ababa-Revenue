import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useTaxCenters } from '../../../context/TaxCenterContext';
import { useLanguage } from '../../../context/LanguageContext';

const IctTaxPayers = () => {
  const { taxCenters } = useTaxCenters();
  const { t, tData } = useLanguage();
  
  const [taxPayers, setTaxPayers] = useState([
    { id: 1, name: 'አብልሃም አበበ', tin: 'TIN-001', phone: '0911-123456', orgType: 'ኩባንያ', taxCenter: 'አዲስ አበባ ቦሌ', isActive: true, identityCreated: false, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedTaxPayer, setSelectedTaxPayer] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    tin: '', 
    phone: '', 
    orgType: '', 
    turnoverTax: '',
    sellsIdentityCode: '',
    subIdentityNumber: '',
    jobType: ''
  });
  const [editFormData, setEditFormData] = useState({ name: '', tin: '', phone: '', orgType: '', taxCenter: '', isActive: true });
  const [loading, setLoading] = useState(false);

  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [identityForm, setIdentityForm] = useState({ username: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleIdentityChange = (e) => {
    const { name, value } = e.target;
    setIdentityForm(prev => ({ ...prev, [name]: value }));
  };

  const openRegister = () => {
    setFormData({ 
      name: '', 
      tin: '', 
      phone: '', 
      orgType: '', 
      turnoverTax: '',
      sellsIdentityCode: '',
      subIdentityNumber: '',
      jobType: ''
    });
    setShowRegister(true);
  };
  const closeRegister = () => setShowRegister(false);

  const openView = (tp) => { setSelectedTaxPayer(tp); setModalType('view'); };
  const openEdit = (tp) => { setSelectedTaxPayer(tp); setEditFormData(tp); setModalType('edit'); };
  const openDelete = (tp) => { setSelectedTaxPayer(tp); setModalType('delete'); };
  const closeActionModal = () => { setModalType(null); setSelectedTaxPayer(null); };

  const getViewFields = (tp) => {
    if (!tp) return [];
    return [
      { label: t('fullName'), value: tData(tp.name) },
      { label: t('tinNumber'), value: tp.tin },
      { label: t('phoneNumber'), value: tp.phone },
      { label: t('orgType'), value: tData(tp.orgType) },
      { label: t('taxCenter'), value: tData(tp.taxCenter) },
      { label: t('status'), value: tData(tp.isActive ? 'ንቁ' : 'ተቋርጧል') },
      { label: t('createdAt'), value: tp.createdAt || 'N/A' },
      { label: t('updatedAt'), value: tp.updatedAt || 'N/A' },
    ];
  };

  const viewFields = getViewFields(selectedTaxPayer);

  const openIdentityModal = (tp) => {
    setSelectedIdentity(tp);
    setIdentityForm({ username: '', password: '', confirmPassword: '' });
    setShowIdentityModal(true);
  };
  const closeIdentityModal = () => {
    setShowIdentityModal(false);
    setSelectedIdentity(null);
    setIdentityForm({ username: '', password: '', confirmPassword: '' });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.tin.trim() || !formData.phone.trim() || !formData.orgType.trim()) {
      toast.error('እባክዎ ስም፣ TIN፣ ስልክ እና የድርጅት ዓይነት ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newTp = {
        id: taxPayers.length + 1,
        ...formData,
        taxCenter: 'አዲስ አበባ',
        isActive: true,
        identityCreated: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setTaxPayers([...taxPayers, newTp]);
      setLoading(false);
      closeRegister();
      toast.success('ግብር ከፋይ ተመዝግቧል! ✅');
    }, 1000);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.tin.trim() || !editFormData.phone.trim() || !editFormData.orgType.trim() || !editFormData.taxCenter) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = taxPayers.map(tp =>
        tp.id === selectedTaxPayer.id
          ? { ...tp, ...editFormData, updatedAt: new Date().toISOString().split('T')[0] }
          : tp
      );
      setTaxPayers(updated);
      setLoading(false);
      closeActionModal();
      toast.success('ግብር ከፋይ ተስተካክሏል! ✅');
    }, 1000);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = taxPayers.filter(tp => tp.id !== selectedTaxPayer.id);
      setTaxPayers(filtered);
      setLoading(false);
      closeActionModal();
      toast.success('ግብር ከፋይ ተሰርዟል! 🗑️');
    }, 1000);
  };

  const handleCreateIdentity = (e) => {
    e.preventDefault();
    if (!identityForm.username.trim()) {
      toast.error('እባክዎ የተጠቃሚ ስም ያስገቡ!');
      return;
    }
    if (!identityForm.password.trim()) {
      toast.error('እባክዎ የይለፍ ቃል ያስገቡ!');
      return;
    }
    if (identityForm.password !== identityForm.confirmPassword) {
      toast.error('የይለፍ ቃል እና ማረጋገጫ አይመሳሰሉም!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = taxPayers.map(tp =>
        tp.id === selectedIdentity.id
          ? { ...tp, identityCreated: true, username: identityForm.username }
          : tp
      );
      setTaxPayers(updated);
      setLoading(false);
      closeIdentityModal();
      toast.success('የተጠቃሚ መለያ ተፈጥሯል! ✅');
    }, 1000);
  };

  const handleDeleteIdentity = (tpId) => {
    if (window.confirm('እርግጠኛ ነዎት ይህን መለያ መሰረዝ ይፈልጋሉ?')) {
      const updated = taxPayers.map(tp =>
        tp.id === tpId
          ? { ...tp, identityCreated: false, username: undefined }
          : tp
      );
      setTaxPayers(updated);
      toast.success('መለያ ተሰርዟል! 🗑️');
    }
  };

  const filteredData = taxPayers.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const rawName = (item.name || '').toLowerCase();
    const transName = (tData(item.name) || '').toLowerCase();
    const tin = (item.tin || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const rawOrgType = (item.orgType || '').toLowerCase();
    const transOrgType = (tData(item.orgType) || '').toLowerCase();
    const rawTaxCenter = (item.taxCenter || '').toLowerCase();
    const transTaxCenter = (tData(item.taxCenter) || '').toLowerCase();
    const username = (item.username || '').toLowerCase();

    return (
      rawName.includes(term) ||
      transName.includes(term) ||
      tin.includes(term) ||
      phone.includes(term) ||
      rawOrgType.includes(term) ||
      transOrgType.includes(term) ||
      rawTaxCenter.includes(term) ||
      transTaxCenter.includes(term) ||
      username.includes(term)
    );
  });

  return (
    <div className="p-4 md:p-6 w-full text-slate-800 dark:text-slate-100">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a2e',
            padding: '16px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            fontSize: '14px',
          },
          success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } },
          error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } },
        }}
      />

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* FRAME HEADER */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-4">
          <button 
            className="bg-blue-600 hover:bg-blue-400 dark: to-blue-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm border-none cursor-pointer" 
            onClick={openRegister}
          >
            <FaPlus /> {t('addRecord')}
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-3.5 py-2 w-full sm:w-72 focus-within:ring-2 focus-within:ring-navy-800/20 dark:focus-within:ring-gold-400/20 transition-all">
            <FaSearch className="text-slate-400 dark:text-slate-300 shrink-0 text-sm" />
            <input
              type="text"
              className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 w-full"
              placeholder={t('searchTaxpayerPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredData.map((tp, idx) => {
            const identityCreated = tp.identityCreated || false;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1" key={tp.id}>
                <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                      {(tData(tp.name) || 'T').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-base text-navy-800 dark:text-gold-400 line-clamp-1">{tData(tp.name)}</div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{tData(tp.orgType)}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${
                    tp.isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {tData(tp.isActive ? 'ንቁ' : 'ተቋርጧል')}
                  </span>
                </div>

                <div className="p-4 space-y-2 text-sm flex-1">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🆔 {t('tinNumber')}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tp.tin}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">📞 {t('phoneNumber')}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tp.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🏢 {t('taxCenter')}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(tp.taxCenter)}</span>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col gap-2.5">
                  <div>
                    {!identityCreated ? (
                      <button 
                        className="w-full py-2 px-3 bg-red-600 hover:bg-red-400 text-white rounded-xl text-xs font-bold shadow-sm transition-colors border-none cursor-pointer text-center" 
                        onClick={() => openIdentityModal(tp)}
                      >
                        {t('createAccount')}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full justify-between">
                        <div className="relative group flex-1">
                          <button 
                            className="w-full py-2 px-3 bg-green-600 dark:bg-green-400 hover:cursor-not-allowed text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold border-none cursor-default text-center"
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
                          onClick={() => handleDeleteIdentity(tp.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" title={t('view')} onClick={() => openView(tp)}><FaEye /></button>
                    <button className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" title={t('edit')} onClick={() => openEdit(tp)}><FaEdit /></button>
                    <button className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" title={t('delete')} onClick={() => openDelete(tp)}><FaTrash /></button>
                  </div>
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

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeRegister}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaPlus className="text-gold-400" />
                <span>{t('newTaxPayer')}</span>
              </div>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('fullName')} <span className="text-rose-500">*</span></label>
                    <input name="name" className="w-full px-2.5 py-2 border-1.5 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('tinNumber')} <span className="text-rose-500">*</span></label>
                    <input name="tin" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.tin} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('mrc')}</label>
                    <input name="sellsIdentityCode" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.sellsIdentityCode} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('orgType')} <span className="text-rose-500">*</span></label>
                    <select name="orgType" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.orgType} onChange={handleChange} required>
                      <option value="">{t('select')}</option>
                      <option value="ኅላፊነቱ የተወሰነ ይግል ማህበር">{tData('ኅላፊነቱ የተወሰነ ይግል ማህበር')}</option>
                      <option value="ህብረት ስራ">{tData('ህብረት ስራ')}</option>
                      <option value="ሽርክና">{tData('ሽርክና')}</option>
                      <option value="አክሲዎን">{tData('አክሲዎን')}</option>
                      <option value="ክልላዊ">{tData('ክልላዊ')}</option>
                      <option value="NGO">{tData('NGO')}</option>
                      <option value="የግል">{tData('የግል')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('turnoverTax')}</label>
                    <input name="turnoverTax" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.turnoverTax} onChange={handleChange} type="number" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('subIdentity')}</label>
                    <input name="subIdentityNumber" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.subIdentityNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('jobType')}</label>
                    <input name="jobType" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.jobType} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('phoneNumber')} <span className="text-rose-500">*</span></label>
                    <input name="phone" className="w-full px-2.5 py-1.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>
                    {loading ? t('registering') : t('register')}
                  </button>
                  <button type="button" className="px-5 py-2 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeRegister}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {modalType === 'view' && selectedTaxPayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaEye className="text-gold-400" />
                <span>{t('details')}</span>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100 space-y-1.5">
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

      {/* EDIT MODAL */}
      {modalType === 'edit' && selectedTaxPayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaEdit className="text-gold-400" />
                <span>{t('edit')}</span>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleEdit}>
                <div className="space-y-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('fullName')} <span className="text-rose-500">*</span></label>
                    <input name="name" className="w-full px-3.5 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.name} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('tinNumber')} <span className="text-rose-500">*</span></label>
                    <input name="tin" className="w-full px-3.5 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.tin} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('phoneNumber')} <span className="text-rose-500">*</span></label>
                    <input name="phone" className="w-full px-3.5 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.phone} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('orgType')} <span className="text-rose-500">*</span></label>
                    <input name="orgType" className="w-full px-3.5 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.orgType} onChange={handleEditChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('taxCenter')} <span className="text-rose-500">*</span></label>
                    <select name="taxCenter" className="w-full px-3.5 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={editFormData.taxCenter} onChange={handleEditChange} required>
                      <option value="">{t('select')}</option>
                      {taxCenters.map(c => <option key={c.id} value={c.name}>{tData(c.name)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('status')}</label>
                    <div className="flex items-center gap-2 pt-1">
                      <input type="checkbox" name="isActive" className="w-4 h-4 rounded border-slate-300 text-navy-800 focus:ring-navy-800 cursor-pointer" checked={editFormData.isActive} onChange={handleEditChange} />
                      <span className="text-sm font-semibold">{tData(editFormData.isActive ? 'ንቁ' : 'ተቋርጧል')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>
                    {loading ? t('saving') : t('saveChanges')}
                  </button>
                  <button type="button" className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>{t('close')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modalType === 'delete' && selectedTaxPayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
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
                <strong>{tData(selectedTaxPayer.name)}</strong> ({selectedTaxPayer.tin})
              </p>
              <div className="flex justify-end gap-3">
                <button className="px-5 py-2.5 bg-rose-900 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" onClick={handleDelete} disabled={loading}>{t('delete')}</button>
                <button className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>{t('cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IDENTITY MODAL */}
      {showIdentityModal && selectedIdentity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeIdentityModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
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
                    <input type="text" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" value={tData(selectedIdentity.name)} disabled />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('username')} <span className="text-rose-500">*</span></label>
                    <input type="text" name="username" className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors" value={identityForm.username} onChange={handleIdentityChange} required autoFocus />
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
                  <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>
                    {loading ? t('creating') : t('save')}
                  </button>
                  <button type="button" className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeIdentityModal}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IctTaxPayers;