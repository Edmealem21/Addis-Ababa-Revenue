// src/components/ictadmin/pages/Employees/IctUserData.jsx
import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaSearch, FaPlus, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../../context/LanguageContext';
import Tooltip from '../../../common/Tooltip';

const IctUserData = () => {
  const { t, tData } = useLanguage();
  const { employees, setEmployees } = useOutletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [identityForm, setIdentityForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

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
  const currentData = filteredData;

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div className="page-content">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />
      <div className="data-container">
        <div className="frame-header">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
        {/* MAIN CARDS GRID */}
        <div className="cards-grid">
          {currentData.map((emp, idx) => {
            const identityCreated = emp.identityCreated || false;
            return (
              <div className="data-card" key={emp.id}>
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-avatar">
                      {(tData(emp.fullName) || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="card-title-group">
                      <div className="card-title">{tData(emp.fullName)}</div>
                      <div className="card-subtitle">{tData(emp.jobCategory)}</div>
                    </div>
                  </div>
                  <span className="card-index-badge">#{idx + 1}</span>
                </div>
                <div className="card-body">
                  <div className="card-field">
                    <span className="card-label">🆔 {t('idNumber')}</span>
                    <span className="card-value">{emp.idNumber}</span>
                  </div>
                  <div className="card-field">
                    <span className="card-label">💼 {t('jobCategory')}</span>
                    <span className="card-value">{tData(emp.jobCategory)}</span>
                  </div>
                  <div className="card-field">
                    <span className="card-label">🏢 {t('taxCenter')}</span>
                    <span className="card-value">{tData(emp.taxCenter)}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-actions" style={{ justifyContent: 'center' }}>
                    {!identityCreated ? (
                      <button 
                        className="identity-btn create-btn" 
                        onClick={() => openIdentityModal(emp)}
                      >
                        {t('createAccount')}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
                        <div className="tooltip-wrapper">
                          <button 
                            className="identity-btn status-btn"
                            style={{ cursor: 'default' }}
                          >
                            {t('accountCreated')}
                          </button>
                          <div className="custom-tooltip">
                            {t('accountCreatedTooltip')}
                          </div>
                        </div>
                        <button 
                          className="action-btn delete" 
                          title={t('deleteAccount')}
                          onClick={() => handleDeleteIdentity(emp.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {currentData.length === 0 && (
            <div className="no-data-card">
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <div>{t('noData')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Identity Modal */}
      {showIdentityModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeIdentityModal}>
          <div className="modal-content identity-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <div className="modal-title"><FaPlus className="modal-icon" /> {t('createAccount')}</div>
              <button className="modal-close-btn" onClick={closeIdentityModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIdentity}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>{t('fullName')}</label><input type="text" value={tData(selectedEmployee.fullName)} disabled style={{ background: '#f1f5f9' }} /></div>
                  <div className="form-group full-width"><label>{t('username')} *</label><input name="username" value={identityForm.username} onChange={handleIdentityChange} required autoFocus /></div>
                  <div className="form-group full-width"><label>{t('password')} *</label><input type="password" name="password" value={identityForm.password} onChange={handleIdentityChange} required /></div>
                  <div className="form-group full-width"><label>{t('confirmPassword')} *</label><input type="password" name="confirmPassword" value={identityForm.confirmPassword} onChange={handleIdentityChange} required /></div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>{loading ? t('creating') : t('save')}</button>
                  <button type="button" className="btn-btn-secondary" onClick={closeIdentityModal}>{t('cancel')}</button>
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