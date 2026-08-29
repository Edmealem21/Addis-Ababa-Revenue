// src/components/admin/taxcenter/TaxCenter.jsx
import React, { useState, useRef } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';
import Tooltip from '../../common/Tooltip';

const TaxCenter = () => {
  // ✅ Use the language hook (same as EmployeeData)
  const { t, tData } = useLanguage();

  // ============================================
  // STATE
  // ============================================
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
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

  // View modal pagination
  const [viewPage, setViewPage] = useState(1);
  const rowsPerPage = 2;

  // ============================================
  // SAMPLE DATA
  // ============================================
  const [taxCenters, setTaxCenters] = useState([
    { id: 1, name: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', address: 'ቅዱስ ጊዮርጊስ አደባባይ', code: 'TC-001', role: 'Authority', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 2, name: 'አዲስ አበባ ቦሌ', address: 'ቦሌ መዳፍ ቀዳማዊ', code: 'TC-002', role: 'ICT Administrator', isActive: true, createdAt: '2024-02-10', updatedAt: '2024-02-10' },
    { id: 3, name: 'አዲስ አበባ መኩሪያ', address: 'መኩሪያ አካባቢ', code: 'TC-003', role: 'Officer', isActive: true, createdAt: '2024-03-05', updatedAt: '2024-03-05' },
    { id: 4, name: 'አዲስ አበባ ሳሪስ', address: 'ሳሪስ አደባባይ', code: 'TC-004', role: 'Officer', isActive: false, createdAt: '2024-04-20', updatedAt: '2024-04-20' },
    { id: 5, name: 'አዲስ አበባ ካዛንቺስ', address: 'ካዛንቺስ አደባባይ', code: 'TC-005', role: 'Authority', isActive: true, createdAt: '2024-05-12', updatedAt: '2024-05-12' },
    { id: 6, name: 'አዲስ አበባ ላፍቶ', address: 'ላፍቶ አደባባይ', code: 'TC-006', role: 'ICT Administrator', isActive: true, createdAt: '2024-06-18', updatedAt: '2024-06-18' },
    { id: 7, name: 'አዲስ አበባ ጉለሌ', address: 'ጉለሌ አደባባይ', code: 'TC-007', role: 'Officer', isActive: false, createdAt: '2024-07-22', updatedAt: '2024-07-22' },
    { id: 8, name: 'አዲስ አበባ ቀላም', address: 'ቀላም አደባባይ', code: 'TC-008', role: 'Officer', isActive: true, createdAt: '2024-08-30', updatedAt: '2024-08-30' },
  ]);

  // ============================================
  // HANDLERS
  // ============================================
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
    setViewPage(1);
    setModalType('view');
  };
  const openEditModal = (center) => {
    setSelectedCenter(center);
    setEditFormData({
      name: center.name,
      address: center.address,
      // role: center.role || 'Officer',
      // isActive: center.isActive !== undefined ? center.isActive : true,
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
    setViewPage(1);
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => {
    if (!showModal) setShowTooltip(false);
  };

  const generateCode = () => {
    const nextId = taxCenters.length + 1;
    return `TC-${String(nextId).padStart(3, '0')}`;
  };

  // ============================================
  // CRUD OPERATIONS (with translated toast messages)
  // ============================================
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

  // ============================================
  // FILTER & MAIN PAGINATION
  // ============================================
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
  const currentData = filteredData;

  // ============================================
  // VIEW MODAL – Build fields with label/value
  // ============================================
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
  const totalFields = viewFields.length;
  const usePagination = false;
  const totalRows = Math.ceil(totalFields / 2);
  // const rowsPerPageEffective = usePagination ? rowsPerPage : totalRows;
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

      <div className="data-container">
        {/* FRAME HEADER */}
        <div className="frame-header">
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
        </div>

        {/* MAIN CARDS GRID */}
        <div className="cards-grid">
          {currentData.map((center, index) => (
            <div className="data-card" key={center.id}>
              <div className="card-header">
                <div className="card-header-left">
                  <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #e8a735, #d48b18)' }}>
                    🏢
                  </div>
                  <div className="card-title-group">
                    <div className="card-title">{tData(center.name)}</div>
                    <div className="card-subtitle">{tData(center.address)}</div>
                  </div>
                </div>
                <span className="code-badge">{center.code}</span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="card-label">📍 {t('address')}</span>
                  <span className="card-value">{tData(center.address)}</span>
                </div>
              </div>
              <div className="card-footer">
                <div className="card-actions">
                  <button
                    className="action-btn view"
                    title={t('view')}
                    onClick={() => openViewModal(center)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="action-btn edit"
                    title={t('edit')}
                    onClick={() => openEditModal(center)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-btn delete"
                    title={t('delete')}
                    onClick={() => openDeleteModal(center)}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    <label>{t('taxCenterName')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('address')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success">
                    {t('register')}
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
      {modalType === 'view' && selectedCenter && (
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
      {modalType === 'edit' && selectedCenter && (
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
                    <label>{t('taxCenterName')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('address')} <span className="required">*</span></label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
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
                    <label>{t('isActiveQuestion')}</label>
                    <select
                      name="isActive"
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
      {modalType === 'delete' && selectedCenter && (
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
              <p><strong>{tData(selectedCenter.name)}</strong> ({selectedCenter.code})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none' }}>
                <button className="btn-btn-danger" onClick={handleDelete} style={{ background: '#e74c3c', color: '#fff' }}>
                  {t('delete')}
                </button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff' }}>
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