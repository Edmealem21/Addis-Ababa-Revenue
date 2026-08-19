// src/components/ictadmin/pages/Employees/IctEmployeeData.jsx
import React, { useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

import { useTaxCenters } from '../../../../context/TaxCenterContext';
import { AuthContext } from '../../../../context/AuthContext';
import { useLanguage } from '../../../../context/LanguageContext';
import Tooltip from '../../../common/Tooltip';

const IctEmployeeData = () => {
  const { t, tData } = useLanguage();
  const { employees, setEmployees } = useOutletContext();
  const { taxCenters } = useTaxCenters();
  const { user } = useContext(AuthContext);
  const defaultTaxCenter = user?.taxCenter || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', idNumber: '', jobCategory: 'Officer', taxCenter: defaultTaxCenter });
  const [editFormData, setEditFormData] = useState({ fullName: '', idNumber: '', jobCategory: 'Officer', taxCenter: '' });
  const [loading, setLoading] = useState(false);
  const [viewPage, setViewPage] = useState(1);
  const rowsPerPage = 4;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const openRegister = () => { setFormData({ fullName: '', idNumber: '', jobCategory: 'Officer', taxCenter: defaultTaxCenter }); setShowRegister(true); };
  const closeRegister = () => setShowRegister(false);

  const openView = (emp) => { setSelectedEmployee(emp); setViewPage(1); setModalType('view'); };
  const openEdit = (emp) => { setSelectedEmployee(emp); setEditFormData(emp); setModalType('edit'); };
  const openDelete = (emp) => { setSelectedEmployee(emp); setModalType('delete'); };
  const closeActionModal = () => { setModalType(null); setSelectedEmployee(null); };

  const getViewFields = (emp) => {
    if (!emp) return [];
    return [
      { label: t('fullName'), value: tData(emp.fullName) },
      { label: t('idNumber'), value: emp.idNumber },
      { label: t('taxCenter'), value: tData(emp.taxCenter) },
      { label: t('role'), value: tData(emp.jobCategory || 'Officer') },
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.idNumber.trim() || !formData.taxCenter) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newEmp = {
        id: employees.length + 1,
        ...formData,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setEmployees([...employees, newEmp]);
      setLoading(false);
      closeRegister();
      toast.success('ሰራተኛ ተመዝግቧል! ✅');
    }, 1000);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.fullName.trim() || !editFormData.idNumber.trim() || !editFormData.taxCenter) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = employees.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...editFormData, updatedAt: new Date().toISOString().split('T')[0] } : emp);
      setEmployees(updated);
      setLoading(false);
      closeActionModal();
      toast.success('ሰራተኛ ተስተካክሏል! ✅');
    }, 1000);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      setLoading(false);
      closeActionModal();
      toast.success('ሰራተኛ ተሰርዟል! 🗑️');
    }, 1000);
  };

  const filteredData = employees.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxCenter.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const effectivePerPage = perPage;
  const totalPages = Math.ceil(filteredData.length / effectivePerPage) || 1;
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = startIndex + effectivePerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  if (currentPage > totalPages) setCurrentPage(totalPages);

  return (
    <div className="page-content">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />
      <div className="data-container">
        <div className="frame-header">
          <div className="frame-actions">
            <button className="btn btn-primary" onClick={openRegister}><FaPlus /> {t('addRecord')}</button>
            <span className="total-count">{t('total')}: {employees.length}</span>
          </div>
          <div className="frame-title">{t('employeeDataTitle')}</div>
        </div>
        <div className="data-controls">
          <div className="per-page">
            <span>{t('display')}</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={1}>1</option><option value={2}>2</option><option value={5}>5</option><option value={10}>10</option>
            </select>
            <span>{t('perPage')}</span>
          </div>
          <div className="search-wrapper">
            <span className="search-label">{t('searchLabel')}</span>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead><tr><th>#</th><th>{t('fullName')}</th><th>{t('idNumber')}</th><th>{t('jobCategory')}</th><th>{t('taxCenter')}</th><th>{t('actions')}</th></tr></thead>
            <tbody>
              {currentData.map((emp, idx) => (
                <tr key={emp.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td><strong>{tData(emp.fullName)}</strong></td>
                  <td>{emp.idNumber}</td>
                  <td>{tData(emp.jobCategory)}</td>
                  <td>{tData(emp.taxCenter)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" title={t('view')} onClick={() => openView(emp)}><FaEye /></button>
                      <button className="action-btn edit" title={t('edit')} onClick={() => openEdit(emp)}><FaEdit /></button>
                      <button className="action-btn delete" title={t('delete')} onClick={() => openDelete(emp)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>{t('noData')}</td></tr>}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">{t('showing')} {startIndex+1} {t('to')} {Math.min(endIndex, filteredData.length)} {t('of')} {filteredData.length}</span>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage===1}>{t('first')}</button>
            <button onClick={() => setCurrentPage(currentPage-1)} disabled={currentPage===1}>{t('previous')}</button>
            <span className="page-indicator">{t('page')} {currentPage} {t('of')} {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentPage===totalPages}>{t('next')}</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage===totalPages}>{t('last')}</button>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeRegister}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title"><FaPlus className="modal-icon" /> {t('registerNew')}</div></div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>{t('fullName')} *</label><input name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
                  <div className="form-group"><label>{t('idNumber')} *</label><input name="idNumber" value={formData.idNumber} onChange={handleChange} required /></div>
                  <div className="form-group"><label>{t('jobCategory')} *</label>
                    <select name="jobCategory" value={formData.jobCategory} onChange={handleChange} required>
                      <option value="Authority">{tData('Authority')}</option>
                      <option value="ICT Administrator">{tData('ICT Administrator')}</option>
                      <option value="Officer">{tData('Officer')}</option>
                    </select>
                  </div>
                  <div className="form-group"><label>{t('taxCenter')} *</label>
                    <select name="taxCenter" value={formData.taxCenter} onChange={handleChange} required>
                      <option value="">{t('select')}</option>
                      {taxCenters.map(c => <option key={c.id} value={c.name}>{tData(c.name)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>{loading ? t('registering') : t('register')}</button>
                  <button type="button" className="btn-btn-secondary" onClick={closeRegister}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedEmployee && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content view-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2c3e50, #3498db)' }}>
              <div className="modal-title"><FaEye className="modal-icon" /> {t('details')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
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

      {/* Edit Modal */}
      {modalType === 'edit' && selectedEmployee && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaEdit className="modal-icon" /> {t('edit')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>{t('fullName')} *</label><input name="fullName" value={editFormData.fullName} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('idNumber')} *</label><input name="idNumber" value={editFormData.idNumber} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('jobCategory')} *</label>
                    <select name="jobCategory" value={editFormData.jobCategory} onChange={handleEditChange} required>
                      <option value="Authority">{tData('Authority')}</option>
                      <option value="ICT Administrator">{tData('ICT Administrator')}</option>
                      <option value="Officer">{tData('Officer')}</option>
                    </select>
                  </div>
                  <div className="form-group"><label>{t('taxCenter')} *</label>
                    <select name="taxCenter" value={editFormData.taxCenter} onChange={handleEditChange} required>
                      <option value="">{t('select')}</option>
                      {taxCenters.map(c => <option key={c.id} value={c.name}>{tData(c.name)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>{loading ? t('saving') : t('saveChanges')}</button>
                  <button type="button" className="btn-btn-secondary" onClick={closeActionModal}>{t('close')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalType === 'delete' && selectedEmployee && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <div className="modal-title"><FaTrash className="modal-icon" /> {t('warning')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>{t('confirmDelete')}</h3>
              <p><strong>{tData(selectedEmployee.fullName)}</strong> ({selectedEmployee.idNumber})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none' }}>
                <button className="btn-btn-danger" onClick={handleDelete} disabled={loading} style={{ background: '#e74c3c', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>{t('delete')}</button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff' }}>{t('cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IctEmployeeData;