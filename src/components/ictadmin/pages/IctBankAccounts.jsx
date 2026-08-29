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
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'delete'
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
  const [editFormData, setEditFormData] = useState({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [viewPage, setViewPage] = useState(1);
  const rowsPerPage = 4;

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const openRegister = () => { setFormData({ bankName: '', accountNumber: '', accountOwner: '', branch: '' }); setShowRegister(true); };
  const closeRegister = () => setShowRegister(false);

  const openView = (acc) => { setSelectedAccount(acc); setViewPage(1); setModalType('view'); };
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
  const currentData = filteredData;

  return (
    <div className="page-content">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />
      <div className="data-container">
        <div className="frame-header">
          <div className="frame-actions">
            <button className="btn btn-primary" onClick={openRegister}><FaPlus /> {t('addRecord')}</button>
          </div>
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
        {/* MAIN CARDS GRID */}
        <div className="cards-grid">
          {currentData.map((acc, idx) => (
            <div className="data-card" key={acc.id}>
              <div className="card-header">
                <div className="card-header-left">
                  <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #27ae60, #219a52)' }}>
                    🏦
                  </div>
                  <div className="card-title-group">
                    <div className="card-title">{tData(acc.bankName)}</div>
                    <div className="card-subtitle">{tData(acc.branch)}</div>
                  </div>
                </div>
                <span className="card-index-badge">#{idx + 1}</span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="card-label">💳 {t('accountNumber')}</span>
                  <span className="card-value">{acc.accountNumber}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">👤 {t('accountOwner')}</span>
                  <span className="card-value">{tData(acc.accountOwner)}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">🏢 {t('branch')}</span>
                  <span className="card-value">{tData(acc.branch)}</span>
                </div>
              </div>
              <div className="card-footer">
                <div className="card-actions">
                  <button className="action-btn view" title={t('view')} onClick={() => openView(acc)}><FaEye /></button>
                  <button className="action-btn edit" title={t('edit')} onClick={() => openEdit(acc)}><FaEdit /></button>
                  <button className="action-btn delete" title={t('delete')} onClick={() => openDelete(acc)}><FaTrash /></button>
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

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeRegister}>
          <div className="modal-content register-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title"><FaPlus className="modal-icon" /> {t('registerNew')}</div></div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>{t('bankName')} *</label><input name="bankName" value={formData.bankName} onChange={handleChange} required /></div>
                  <div className="form-group"><label>{t('accountNumber')} *</label><input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required /></div>
                  <div className="form-group"><label>{t('accountOwner')} *</label><input name="accountOwner" value={formData.accountOwner} onChange={handleChange} required /></div>
                  <div className="form-group"><label>{t('branch')} *</label><input name="branch" value={formData.branch} onChange={handleChange} required /></div>
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
      {modalType === 'view' && selectedAccount && (
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
      {modalType === 'edit' && selectedAccount && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaEdit className="modal-icon" /> {t('edit')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>{t('bankName')} *</label><input name="bankName" value={editFormData.bankName} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('accountNumber')} *</label><input name="accountNumber" value={editFormData.accountNumber} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('accountOwner')} *</label><input name="accountOwner" value={editFormData.accountOwner} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('branch')} *</label><input name="branch" value={editFormData.branch} onChange={handleEditChange} required /></div>
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
      {modalType === 'delete' && selectedAccount && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <div className="modal-title"><FaTrash className="modal-icon" /> {t('warning')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>{t('confirmDelete')}</h3>
              <p><strong>{tData(selectedAccount.bankName)}</strong> ({selectedAccount.accountNumber})</p>
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

export default IctBankAccounts;