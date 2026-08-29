import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';
import Tooltip from '../../common/Tooltip';

// Sample data for first run
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

  // Safely get outlet context (may be undefined if not nested)
  const context = useOutletContext() || {};
  const setOutletEmployees = context.setEmployees || (() => {});

  // Initialize local state from localStorage or fallback to sample data
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

  // Whenever employees change, save to localStorage and update outlet context
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    setOutletEmployees(employees);
  }, [employees, setOutletEmployees]);

  // ============================================
  // STATE
  // ============================================
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
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

  // View modal pagination
  const [viewPage, setViewPage] = useState(1);
  const rowsPerPage = 2;

  // ============================================
  // HANDLERS
  // ============================================
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
    setViewPage(1);
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
    setViewPage(1);
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => {
    if (!showModal) setShowTooltip(false);
  };

  // ============================================
  // CRUD OPERATIONS
  // ============================================
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

  // ============================================
  // FILTER & MAIN PAGINATION
  // ============================================
  const filteredData = employees.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxCenter.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData;

  // ============================================
  // VIEW MODAL – ORDER
  // ============================================
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
  const totalFields = viewFields.length;
  const usePagination = false;
  const totalRows = Math.ceil(totalFields / 2);
  const totalViewPages = usePagination ? Math.ceil(totalRows / rowsPerPage) : 1;
  const viewStartRow = usePagination ? (viewPage - 1) * rowsPerPage : 0;
  const viewEndRow = usePagination ? Math.min(viewStartRow + rowsPerPage, totalRows) : totalRows;

  const viewCurrentRows = [];
  for (let i = viewStartRow; i < viewEndRow; i++) {
    const startIdx = i * 2;
    const rowFields = viewFields.slice(startIdx, startIdx + 2);
    viewCurrentRows.push(rowFields);
  }
  if (viewPage > totalViewPages) setViewPage(totalViewPages);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="page-content">
      <div className="data-container">
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
              fontWeight: '500',
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

        {/* FRAME HEADER */}
                <div className="frame-header">
                  <div className="frame-actions">
                    <button className="btn btn-primary" onClick={openModal}><FaPlus /> {t('addRecord')}</button>
                  </div>
                  <div className="search-wrapper">
                    <div className="search-box">
                      <FaSearch className="search-icon" />
                      <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                </div>


        {/* <div className="frame-header">
          <div className="frame-actions">
            <div className="tooltip-container">
              <button 
                ref={buttonRef}
                className="btn btn-primary" 
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
          </div>
          <div className="frame-title">
            <span style={{ color: '#110505ea' }}>{t('ictAdmin')} {'\u226B'}  </span>
            <span className="frame-icon"></span>
            {t('employeeDataTitle')}
          // </div>
        </div> */}

        {/* CONTROLS */}
        {/* <div className="data-controls">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div> */}

        {/* MAIN CARDS GRID */}
        <div className="cards-grid">
          {currentData.map((employee, index) => (
            <div className="data-card" key={employee.id}>
              <div className="card-header">
                <div className="card-header-left">
                  <div className="card-avatar">
                    {(tData(employee.fullName) || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div className="card-title-group">
                    <div className="card-title">{tData(employee.fullName)}</div>
                    <div className="card-subtitle">{tData(employee.role || 'Officer')}</div>
                  </div>
                </div>
                <span className="card-index-badge">#{index + 1}</span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="card-label">🆔 {t('idNumber')}</span>
                  <span className="card-value">{employee.idNumber}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">🏢 {t('taxCenter')}</span>
                  <span className="card-value">{tData(employee.taxCenter)}</span>
                </div>
              </div>
              <div className="card-footer">
                <div className="card-actions">
                  <button 
                    className="action-btn view" 
                    title={t('view')}
                    onClick={() => openViewModal(employee)}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn edit" 
                    title={t('edit')}
                    onClick={() => openEditModal(employee)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete" 
                    title={t('delete')}
                    onClick={() => openDeleteModal(employee)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {currentData.length === 0 && (
            <div className="no-data-card">
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <div>{t('noData')}</div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          MODAL - REGISTER
          ============================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FaPlus className="modal-icon" />
                <span>{t('registerNew')}</span>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('fullName')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('idNumber')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('taxCenter')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="taxCenter"
                      value={formData.taxCenter}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? t('registering') : t('register')}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeModal}>
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          MODAL - VIEW
          ============================================ */}
      {modalType === 'view' && selectedEmployee && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content view-modal-content">
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2c3e50, #3498db)' }}>
              <div className="modal-title">
                <FaEye className="modal-icon" />
                <span>{t('details')}</span>
              </div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body view-modal-body">
              <div className="view-field-grid">
                {viewCurrentRows.map((row, rowIdx) => (
                  <div className="view-row" key={rowIdx}>
                    {row.map((field, idx) => {
                      const isFullWidth = field.fullWidth || false;
                      return (
                        <div className={`view-field ${isFullWidth ? 'full-width' : ''}`} key={idx}>
                          <div className="view-label">{field.label}</div>
                          <div className="view-value">{field.value}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {usePagination && totalViewPages > 1 && (
                <div className="view-pagination">
                  <button onClick={() => setViewPage(prev => Math.max(prev - 1, 1))} disabled={viewPage === 1}>
                    {t('previous')}
                  </button>
                  <span>{t('page')} {viewPage} {t('of')} {totalViewPages}</span>
                  <button onClick={() => setViewPage(prev => Math.min(prev + 1, totalViewPages))} disabled={viewPage === totalViewPages}>
                    {t('next')}
                  </button>
                </div>
              )}
            </div>

            <div className="view-modal-footer">
              <button type="button" className="btn-cancel-red" onClick={closeActionModal}>
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          MODAL - EDIT
          ============================================ */}
      {modalType === 'edit' && selectedEmployee && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FaEdit className="modal-icon" />
                <span>{t('edit')}</span>
              </div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('fullName')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={editFormData.fullName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('idNumber')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="idNumber"
                      value={editFormData.idNumber}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('taxCenter')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="taxCenter"
                      value={editFormData.taxCenter}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('role')}</label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditChange}
                    >
                      <option value="Authority">{tData('Authority')}</option>
                      <option value="ICT Administrator">{tData('ICT Administrator')}</option>
                      <option value="Officer">{tData('Officer')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('status')}</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditChange}
                    >
                      <option value="Active">{tData('ንቁ')}</option>
                      <option value="Inactive">{tData('ተቋርጧል')}</option>
                      <option value="Pending">{tData('በመጠባበቅ ላይ')}</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success">
                    {t('saveChanges')}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeActionModal}>
                    {t('close')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          MODAL - DELETE
          ============================================ */}
      {modalType === 'delete' && selectedEmployee && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <div className="modal-title">
                <FaTrash className="modal-icon" />
                <span>{t('warning')}</span>
              </div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>{t('confirmDelete')}</h3>
              <p><strong>{tData(selectedEmployee.fullName)}</strong> ({selectedEmployee.idNumber})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none' }}>
                <button className="btn-btn-danger" onClick={handleDelete} style={{ background: '#e74c3c', color: '#fff' }}>{t('delete')}</button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff' }}>{t('cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeData;