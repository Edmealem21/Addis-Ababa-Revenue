import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';
import Tooltip from '../../common/Tooltip';

const getSampleEmployees = () => [
  {
    id: 1,
    fullName: 'አብረሃም አስፋው',
    idNumber: 'ET001',
    taxCenter: 'አዲስ አበባ',
    role: 'Authority',
    status: 'Active',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    fullName: 'ሳራ ተስፋዬ',
    idNumber: 'ET002',
    taxCenter: 'ባህር ዳር',
    role: 'ICT Administrator',
    status: 'Active',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 3,
    fullName: 'ዳንኤል መኮንን',
    idNumber: 'ET003',
    taxCenter: 'ጎንደር',
    role: 'Officer',
    status: 'Inactive',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  },
];

const EmployeeData = () => {
  const { t, tData } = useLanguage();
  const STORAGE_KEY = 'employeesData';

  const context = useOutletContext() || {};
  const setOutletEmployees = context.setEmployees || (() => {});

  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getSampleEmployees();
      }
    }
    return getSampleEmployees();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    setOutletEmployees(employees);
  }, [employees, setOutletEmployees]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);

  const [modalType, setModalType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    idNumber: '',
    taxCenter: '',
    role: 'Officer',
    status: 'Active',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    taxCenter: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setFormData({ fullName: '', idNumber: '', taxCenter: '' });
    setShowModal(true);
    setShowTooltip(true);
  };
  const closeModal = () => {
    setFormData({ fullName: '', idNumber: '', taxCenter: '' });
    setShowModal(false);
    setShowTooltip(false);
  };

  const openViewModal = (employee) => {
    setSelectedEmployee(employee);
    setModalType('view');
  };
  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      fullName: employee.fullName,
      idNumber: employee.idNumber,
      taxCenter: employee.taxCenter,
      role: employee.role || 'Officer',
      status: employee.status || 'Active',
    });
    setModalType('edit');
  };
  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setModalType('delete');
  };
  const closeActionModal = () => {
    setModalType(null);
    setSelectedEmployee(null);
    setEditFormData({ fullName: '', idNumber: '', taxCenter: '', role: 'Officer', status: 'Active' });
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => {
    if (!showModal) setShowTooltip(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.idNumber.trim() || !formData.taxCenter.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    const existing = employees.find(emp => emp.idNumber === formData.idNumber);
    if (existing) {
      toast.error('ይህ መለያ ቁጥር ቀድሞ ተመዝግቧል! ❌');
      setLoading(false);
      return;
    }
    const newEmployee = {
      id: employees.length + 1,
      fullName: formData.fullName,
      idNumber: formData.idNumber,
      taxCenter: formData.taxCenter,
      role: 'Officer',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setEmployees([...employees, newEmployee]);
    setLoading(false);
    closeModal();
    toast.success('ሰራተኛ በተሳካ ሁኔታ ተመዝግቧል! ✅');
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.fullName.trim() || !editFormData.idNumber.trim() || !editFormData.taxCenter.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          fullName: editFormData.fullName,
          idNumber: editFormData.idNumber,
          taxCenter: editFormData.taxCenter,
          role: editFormData.role,
          status: editFormData.status,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    closeActionModal();
    toast.success('ሰራተኛ በተሳካ ሁኔታ ተስተካክሏል! ✅');
  };

  const handleDelete = () => {
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
    setEmployees(updatedEmployees);
    closeActionModal();
    toast.success('ሰራተኛ በተሳካ ሁኔታ ተሰርዟል! 🗑️');
  };

  const filteredData = employees.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const rawName = (item.fullName || '').toLowerCase();
    const transName = (tData(item.fullName) || '').toLowerCase();
    const rawId = (item.idNumber || '').toLowerCase();
    const rawCenter = (item.taxCenter || '').toLowerCase();
    const transCenter = (tData(item.taxCenter) || '').toLowerCase();
    const rawRole = (item.role || item.jobCategory || '').toLowerCase();
    const transRole = (tData(item.role || item.jobCategory) || '').toLowerCase();
    const rawStatus = (item.status || '').toLowerCase();

    return (
      rawName.includes(term) ||
      transName.includes(term) ||
      rawId.includes(term) ||
      rawCenter.includes(term) ||
      transCenter.includes(term) ||
      rawRole.includes(term) ||
      transRole.includes(term) ||
      rawStatus.includes(term)
    );
  });

  const getViewFields = (emp) => {
    if (!emp) return [];
    return [
      { label: t('fullName'), value: tData(emp.fullName) },
      { label: t('idNumber'), value: emp.idNumber },
      { label: t('taxCenter'), value: tData(emp.taxCenter) },
      { label: t('role'), value: tData(emp.role || 'Officer') },
      { label: t('status'), value: tData(emp.status || 'Active') },
      { label: t('createdAt'), value: emp.createdAt || 'N/A' },
      { label: t('updatedAt'), value: emp.updatedAt || 'N/A' },
    ];
  };

  const viewFields = getViewFields(selectedEmployee);

  return (
    <div className="p-4 md:p-6 w-full text-slate-800 dark:text-slate-100">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
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
          {filteredData.map((employee, index) => (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1" key={employee.id}>
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 dark:bg-blue-400 text-white dark:text-slate-900 font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                    {(tData(employee.fullName) || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-base text-navy-800 dark:text-gold-400 line-clamp-1">{tData(employee.fullName)}</div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{tData(employee.role || 'Officer')}</div>
                  </div>
                </div>
                <span className="bg-navy-50 dark:bg-slate-700 text-navy-800 dark:text-gold-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-navy-100 dark:border-slate-600 shrink-0">#{index + 1}</span>
              </div>

              <div className="p-4 space-y-2 text-sm flex-1">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🆔 {t('idNumber')}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{employee.idNumber}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🏢 {t('taxCenter')}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tData(employee.taxCenter)}</span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/30 flex justify-end">
                <div className="flex items-center gap-2">
                  <button 
                    className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" 
                    title={t('view')}
                    onClick={() => openViewModal(employee)}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" 
                    title={t('edit')}
                    onClick={() => openEditModal(employee)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-sm border-none cursor-pointer" 
                    title={t('delete')}
                    onClick={() => openDeleteModal(employee)}
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('fullName')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('idNumber')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="idNumber"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('taxCenter')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="taxCenter"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={formData.taxCenter}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit" className="px-5 py-2.5 bg-green-600 hover:bg-green-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" disabled={loading}>
                    {loading ? t('registering') : t('register')}
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
      {modalType === 'view' && selectedEmployee && (
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
      {modalType === 'edit' && selectedEmployee && (
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('fullName')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.fullName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('idNumber')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="idNumber"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.idNumber}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('taxCenter')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="taxCenter"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.taxCenter}
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('status')}</label>
                    <select
                      name="status"
                      className="w-full px-3.5 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                      value={editFormData.status}
                      onChange={handleEditChange}
                    >
                      <option value="Active">{tData('ንቁ')}</option>
                      <option value="Inactive">{tData('ተቋርጧል')}</option>
                      <option value="Pending">{tData('በመጠባበቅ ላይ')}</option>
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
      {modalType === 'delete' && selectedEmployee && (
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
                <strong>{tData(selectedEmployee.fullName)}</strong> ({selectedEmployee.idNumber})
              </p>
              <div className="flex justify-end gap-3">
                <button className="px-5 py-2.5 bg-rose-900 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors border-none cursor-pointer" onClick={handleDelete}>
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

export default EmployeeData;