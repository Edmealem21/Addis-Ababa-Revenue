import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useTaxCenters } from '../../../context/TaxCenterContext';
import { useLanguage } from '../../../context/LanguageContext';
import Tooltip from '../../common/Tooltip';

const IctTaxPayers = () => {
  const { taxCenters } = useTaxCenters();
  const { t, tData } = useLanguage();
  
  // ============================================
  // STATE
  // ============================================
  const [taxPayers, setTaxPayers] = useState([
    { id: 1, name: 'አብልሃም አበበ', tin: 'TIN-001', phone: '0911-123456', orgType: 'ኩባንያ', taxCenter: 'አዲስ አበባ ቦሌ', isActive: true, identityCreated: false, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showRegister, setShowRegister] = useState(false);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'delete'
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
  const [viewPage, setViewPage] = useState(1);
  const rowsPerPage = 4;

  // Identity modal
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [identityForm, setIdentityForm] = useState({ username: '', password: '', confirmPassword: '' });

  // Tooltip for "identity already created"
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = React.useRef(null);

  // ============================================
  // HANDLERS
  // ============================================
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

  // Open modals
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

  const openView = (tp) => { setSelectedTaxPayer(tp); setViewPage(1); setModalType('view'); };
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

  // ============================================
  // CRUD OPERATIONS
  // ============================================
  const handleRegister = (e) => {
    e.preventDefault();
    // Require only the essential fields
    if (!formData.name.trim() || !formData.tin.trim() || !formData.phone.trim() || !formData.orgType.trim()) {
      toast.error('እባክዎ ስም፣ TIN፣ ስልክ እና የድርጅት ዓይነት ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Add default values for taxCenter and isActive (they are not in the form)
      const newTp = {
        id: taxPayers.length + 1,
        ...formData,
        taxCenter: 'አዲስ አበባ', // default or leave empty; you can adjust as needed
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

  // ============================================
  // IDENTITY CREATION
  // ============================================
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

  // ============================================
  // FILTER & PAGINATION
  // ============================================
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

  const currentData = filteredData;

  // Tooltip handlers
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

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
          success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } },
          error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } },
        }}
      />

      <div className="data-container">
        {/* FRAME HEADER */}
        <div className="frame-header">
          <div className="frame-actions">
            <button className="btn btn-primary" onClick={openRegister}>
              <FaPlus /> {t('addRecord')}
            </button>
          </div>
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('searchTaxpayerPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* MAIN CARDS GRID */}
        <div className="cards-grid">
          {currentData.map((tp, idx) => {
            const identityCreated = tp.identityCreated || false;
            return (
              <div className="data-card" key={tp.id}>
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)' }}>
                      {(tData(tp.name) || 'T').charAt(0).toUpperCase()}
                    </div>
                    <div className="card-title-group">
                      <div className="card-title">{tData(tp.name)}</div>
                      <div className="card-subtitle">{tData(tp.orgType)}</div>
                    </div>
                  </div>
                  <span className={`status-badge ${tp.isActive ? 'active' : 'inactive'}`}>
                    {tData(tp.isActive ? 'ንቁ' : 'ተቋርጧል')}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-field">
                    <span className="card-label">🆔 {t('tinNumber')}</span>
                    <span className="card-value">{tp.tin}</span>
                  </div>
                  <div className="card-field">
                    <span className="card-label">📞 {t('phoneNumber')}</span>
                    <span className="card-value">{tp.phone}</span>
                  </div>
                  <div className="card-field">
                    <span className="card-label">🏢 {t('taxCenter')}</span>
                    <span className="card-value">{tData(tp.taxCenter)}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      {!identityCreated ? (
                        <button 
                          className="identity-btn create-btn" 
                          onClick={() => openIdentityModal(tp)}
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
                            onClick={() => handleDeleteIdentity(tp.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="card-actions" style={{ justifyContent: 'center' }}>
                      <button className="action-btn view" title={t('view')} onClick={() => openView(tp)}><FaEye /></button>
                      <button className="action-btn edit" title={t('edit')} onClick={() => openEdit(tp)}><FaEdit /></button>
                      <button className="action-btn delete" title={t('delete')} onClick={() => openDelete(tp)}><FaTrash /></button>
                    </div>
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

      {/* ============================================
          REGISTER MODAL
          ============================================ */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeRegister}>
          <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaPlus className="modal-icon" /> {t('newTaxPayer')}</div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group full-width">
                    <label>{t('fullName')} *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>{t('tinNumber')} *</label>
                    <input name="tin" value={formData.tin} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>{t('mrc')}</label>
                    <input name="sellsIdentityCode" value={formData.sellsIdentityCode} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>{t('orgType')} *</label>
                    <select style={{ width: '100%', border: 'none' }} name="orgType" value={formData.orgType} onChange={handleChange} required>
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
                  <div className="form-group">
                    <label>{t('turnoverTax')}</label>
                    <input name="turnoverTax" value={formData.turnoverTax} onChange={handleChange} type="number" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>{t('subIdentity')}</label>
                    <input name="subIdentityNumber" value={formData.subIdentityNumber} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>{t('jobType')}</label>
                    <input name="jobType" value={formData.jobType} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>{t('phoneNumber')} *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? t('registering') : t('register')}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeRegister}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          VIEW MODAL
          ============================================ */}
      {modalType === 'view' && selectedTaxPayer && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content view-modal-content" onClick={(e) => e.stopPropagation()}>
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

      {/* ============================================
          EDIT MODAL
          ============================================ */}
      {modalType === 'edit' && selectedTaxPayer && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaEdit className="modal-icon" /> {t('edit')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>{t('fullName')} *</label><input name="name" value={editFormData.name} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('tinNumber')} *</label><input name="tin" value={editFormData.tin} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('phoneNumber')} *</label><input name="phone" value={editFormData.phone} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('orgType')} *</label><input name="orgType" value={editFormData.orgType} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>{t('taxCenter')} *</label>
                    <select name="taxCenter" value={editFormData.taxCenter} onChange={handleEditChange} required>
                      <option value="">{t('select')}</option>
                      {taxCenters.map(c => <option key={c.id} value={c.name}>{tData(c.name)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('status')}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
                      <input type="checkbox" name="isActive" checked={editFormData.isActive} onChange={handleEditChange} />
                      <span>{tData(editFormData.isActive ? 'ንቁ' : 'ተቋርጧል')}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? t('saving') : t('saveChanges')}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeActionModal}>{t('close')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          DELETE MODAL
          ============================================ */}
      {modalType === 'delete' && selectedTaxPayer && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <div className="modal-title"><FaTrash className="modal-icon" /> {t('warning')}</div>
              <button className="modal-close-btn" onClick={closeActionModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>{t('confirmDelete')}</h3>
              <p><strong>{tData(selectedTaxPayer.name)}</strong> ({selectedTaxPayer.tin})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none', marginTop: '20px' }}>
                <button className="btn-btn-danger" onClick={handleDelete} disabled={loading} style={{ background: '#e74c3c', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>{t('delete')}</button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>{t('cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          IDENTITY MODAL
          ============================================ */}
      {showIdentityModal && selectedIdentity && (
        <div className="modal-overlay" onClick={closeIdentityModal}>
          <div className="modal-content identity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <div className="modal-title"><FaPlus className="modal-icon" /> {t('createAccount')}</div>
              <button className="modal-close-btn" onClick={closeIdentityModal} title={t('close')}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIdentity}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('fullName')}</label>
                    <input type="text" value={tData(selectedIdentity.name)} disabled style={{ background: '#f1f5f9' }} />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('username')} *</label>
                    <input type="text" name="username" value={identityForm.username} onChange={handleIdentityChange} required autoFocus />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('password')} *</label>
                    <input type="password" name="password" value={identityForm.password} onChange={handleIdentityChange} required />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('confirmPassword')} *</label>
                    <input type="password" name="confirmPassword" value={identityForm.confirmPassword} onChange={handleIdentityChange} required />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? t('creating') : t('save')}
                  </button>
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

export default IctTaxPayers;