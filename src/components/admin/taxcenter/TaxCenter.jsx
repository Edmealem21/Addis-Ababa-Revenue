// src/components/admin/taxcenter/TaxCenter.jsx
import React, { useState, useRef } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';
import Tooltip from '../../common/Tooltip';

const TaxCenter = () => {
  const { t, tData } = useLanguage();

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  const [modalType, setModalType] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    role: 'Officer',
    isActive: true,
  });
  const [formData, setFormData] = useState({ name: '', address: '' });

  const [taxCenters, setTaxCenters] = useState([
    { id: 1, name: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', address: 'ቅዱስ ጊዮርጊስ አደባባይ', code: 'TC-001', role: 'Authority', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 2, name: 'አዲስ አበባ ቦሌ', address: 'ቦሌ መዳፍ ቀዳማዊ', code: 'TC-002', role: 'ICT Administrator', isActive: true, createdAt: '2024-02-10', updatedAt: '2024-02-10' },
    { id: 3, name: 'አዲስ አበባ መኩሪያ', address: 'መኩሪያ አካባቢ', code: 'TC-003', role: 'Officer', isActive: true, createdAt: '2024-03-05', updatedAt: '2024-03-05' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openModal = () => {
    setFormData({ name: '', address: '' });
    setShowModal(true);
    setShowTooltip(true);
  };
  const closeModal = () => {
    setFormData({ name: '', address: '' });
    setShowModal(false);
    setShowTooltip(false);
  };

  const openViewModal = (center) => {
    setSelectedCenter(center);
    setModalType('view');
  };
  const openEditModal = (center) => {
    setSelectedCenter(center);
    setEditFormData({
      name: center.name,
      address: center.address,
      role: center.role || 'Officer',
      isActive: center.isActive !== undefined ? center.isActive : true,
    });
    setModalType('edit');
  };
  const openDeleteModal = (center) => {
    setSelectedCenter(center);
    setModalType('delete');
  };
  const closeActionModal = () => {
    setModalType(null);
    setSelectedCenter(null);
    setEditFormData({ name: '', address: '', role: 'Officer', isActive: true });
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => {
    if (!showModal) setShowTooltip(false);
  };

  const generateCode = () => {
    const nextId = taxCenters.length + 1;
    return `TC-${String(nextId).padStart(3, '0')}`;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error(t('pleaseFillAllFields') || 'እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    const existing = taxCenters.find(center => center.name.toLowerCase() === formData.name.toLowerCase());
    if (existing) {
      toast.error(t('nameExists') || 'ይህ የታክስ ማእከል ስም ቀድሞ ተመዝግቧል! ❌');
      return;
    }
    const newCenter = {
      id: taxCenters.length + 1,
      name: formData.name,
      address: formData.address,
      code: generateCode(),
      role: 'Officer',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setTaxCenters([...taxCenters, newCenter]);
    closeModal();
    toast.success(`${t('registerSuccess')} (${newCenter.code}) ✅`);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.address.trim()) {
      toast.error(t('pleaseFillAllFields') || 'እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    const updatedCenters = taxCenters.map(center => {
      if (center.id === selectedCenter.id) {
        return {
          ...center,
          name: editFormData.name,
          address: editFormData.address,
          role: editFormData.role,
          isActive: editFormData.isActive,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return center;
    });
    setTaxCenters(updatedCenters);
    closeActionModal();
    toast.success(t('updateSuccess') || 'ታክስ ማእከል በተሳካ ሁኔታ ተስተካክሏል! ✅');
  };

  const handleDelete = () => {
    const updatedCenters = taxCenters.filter(center => center.id !== selectedCenter.id);
    setTaxCenters(updatedCenters);
    closeActionModal();
    toast.success(t('deleteSuccess') || 'ታክስ ማእከል በተሳካ ሁኔታ ተሰርዟል! 🗑️');
  };

  const filteredData = taxCenters.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const rawName = (item.name || '').toLowerCase();
    const transName = (tData(item.name) || '').toLowerCase();
    const rawAddress = (item.address || '').toLowerCase();
    const transAddress = (tData(item.address) || '').toLowerCase();
    const code = (item.code || '').toLowerCase();

    return (
      rawName.includes(term) ||
      transName.includes(term) ||
      rawAddress.includes(term) ||
      transAddress.includes(term) ||
      code.includes(term)
    );
  });

  const getViewFields = (center) => {
    if (!center) return [];
    return [
      { label: t('code'), value: center.code },
      { label: t('taxCenterName'), value: tData(center.name) },
      { label: t('address'), value: tData(center.address) },
      { label: t('role'), value: tData(center.role || 'Officer') },
      { label: t('isActiveQuestion'), value: center.isActive ? t('yes') : t('no') },
      { label: t('createdAt'), value: center.createdAt || 'N/A' },
      { label: t('updatedAt'), value: center.updatedAt || 'N/A' },
    ];
  };

  const viewFields = getViewFields(selectedCenter);

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
          success: {
            icon: '✅',
            style: { borderLeft: '4px solid #27ae60' }
          },
          error: {
            icon: '❌',
            style: { borderLeft: '4px solid #e74c3c' }
          }
        }}
      />

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* FRAME HEADER */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <button
              ref={buttonRef}
              className="bg-blue-600 hover:bg-blue-400 dark:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm border-none cursor-pointer"
              onClick={openModal}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FaPlus /> {t('addRecord')}
            </button>
            <Tooltip
              targetRef={buttonRef}
              visible={showTooltip}
              message={t('registerNew')}
              offset={12}
            />
          </div>

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
          {filteredData.map((center) => (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1" key={center.id}>
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                    🏢
                  </div>
                  <div>
                    <div className="font-bold text-base text-navy-800 dark:text-gold-400 line-clamp-1">{tData(center.name)}</div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{tData(center.address)}</div>
                  </div>
                </div>
                <span className="bg-navy-50 dark:bg-slate-700 text-navy-800 dark:text-gold-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-navy-100 dark:border-slate-600 shrink-0">{center.code}</span>
              </div>

              <div className="p-4 space-y-2 text-sm flex-1">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">📍 {t('address')}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(center.address)}</span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/30 flex justify-end">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer"
                    title={t('view')}
                    onClick={() => openViewModal(center)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer"
                    title={t('edit')}
                    onClick={() => openEditModal(center)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer"
                    title={t('delete')}
                    onClick={() => openDeleteModal(center)}
                  >
                    <FaTrash />
                  </button>
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

      {/* MODAL - REGISTER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('taxCenterName')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('address')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="address"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer">
                    {t('register')}
                  </button>
                  <button type="button" className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeModal}>
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - VIEW */}
      {modalType === 'view' && selectedCenter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp">
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaEye className="text-gold-400" />
                <span>{t('details')}</span>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}>
                <FaTimes />
              </button>
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

      {/* MODAL - EDIT */}
      {modalType === 'edit' && selectedCenter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base text-white dark:text-gold-400">
                <FaEdit className="text-gold-400" />
                <span>{t('edit')}</span>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}>
                <FaTimes />
              </button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleEdit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('taxCenterName')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('address')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="address"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.address}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('role')}</label>
                    <select
                      name="role"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.role}
                      onChange={handleEditChange}
                    >
                      <option value="Authority">{tData('Authority')}</option>
                      <option value="ICT Administrator">{tData('ICT Administrator')}</option>
                      <option value="Officer">{tData('Officer')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('isActiveQuestion')}</label>
                    <select
                      name="isActive"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev,
                        isActive: e.target.value === 'true'
                      }))}
                    >
                      <option value="true">{t('yes')}</option>
                      <option value="false">{t('no')}</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer">
                    {t('saveChanges')}
                  </button>
                  <button type="button" className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>
                    {t('close')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - DELETE */}
      {modalType === 'delete' && selectedCenter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={closeActionModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 font-bold text-base text-white">
                <FaTrash />
                <span>{t('warning')}</span>
              </div>
              <button className="text-slate-200 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg" onClick={closeActionModal} title={t('close')}>
                <FaTimes />
              </button>
            </div>
            <div className="p-6 text-center text-slate-800 dark:text-slate-100">
              <div className="text-5xl mb-3 text-rose-600">⚠️</div>
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2">{t('confirmDelete')}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6">
                <strong>{tData(selectedCenter.name)}</strong> ({selectedCenter.code})
              </p>
              <div className="flex justify-end gap-3">
                <button className="px-5 py-2.5 bg-rose-900 hover:bg-rose-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" onClick={handleDelete}>
                  {t('delete')}
                </button>
                <button className="px-5 py-2.5 bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors border-none cursor-pointer" onClick={closeActionModal}>
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCenter;