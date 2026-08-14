import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useTaxCenters } from '../../../context/TaxCenterContext';
import Tooltip from '../../common/Tooltip';

const IctTaxPayers = () => {
  const { taxCenters } = useTaxCenters();
  
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
      { label: 'ስም', value: tp.name },
      { label: 'ታክስ ከፋይ መለያ (TIN)', value: tp.tin },
      { label: 'ስልክ ቁጥር', value: tp.phone },
      { label: 'የድርጅት ዓይነት', value: tp.orgType },
      { label: 'ታክስ ማእከል', value: tp.taxCenter },
      { label: 'ሁኔታ', value: tp.isActive ? 'ንቁ' : 'ተቋርጧል' },
      { label: 'የተመዘገበበት ቀን', value: tp.createdAt || 'N/A' },
      { label: 'የተሻሻለበት ቀን', value: tp.updatedAt || 'N/A' },
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
  const filteredData = taxPayers.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const effectivePerPage = perPage;
  const totalPages = Math.ceil(filteredData.length / effectivePerPage) || 1;
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = startIndex + effectivePerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  if (currentPage > totalPages) setCurrentPage(totalPages);

  const hasSearch = searchTerm.trim().length > 0;
  const lineColor = hasSearch ? 'green' : 'red';

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
              <FaPlus /> አዲስ መዝገብ
            </button>
            <span className="total-count">ጠቅላላ: {taxPayers.length}</span>
          </div>
          <div className="frame-title">🧾 ግብር ከፋዮች</div>
        </div>

        {/* SEARCH AREA */}
        <div className="taxpayer-search-area">
          <div className="search-wrapper">
            <span className="search-label">Search:</span>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, TIN, or phone"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className={`taxpayer-line ${lineColor}`}></div>
          {!hasSearch && (
            <div className="taxpayer-hint">
              <span>🔍 Search by tax payer name, tax identity number, or phone number or register new tax payer</span>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>የግብር ከፋይ ስም</th>
                <th>የግብር ከፋይ መለያ ቁጥር</th>
                <th>ስልክ ቁጥር</th>
                <th>የ ድርጅቱ አይነት</th>
                <th>ታክስ ማዕከል</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((tp, idx) => {
                const identityCreated = tp.identityCreated || false;
                return (
                  <tr key={tp.id}>
                    <td>{startIndex + idx + 1}</td>
                    <td><strong>{tp.name}</strong></td>
                    <td>{tp.tin}</td>
                    <td>{tp.phone}</td>
                    <td>{tp.orgType}</td>
                    <td>{tp.taxCenter}</td>
                    <td>
                      <span className={`status-badge ${tp.isActive ? 'active' : 'inactive'}`}>
                        {tp.isActive ? 'ንቁ' : 'ተቋርጧል'}
                      </span>
                    </td>
                    <td>
                                              <div className="table-actions" style={{ justifyContent: 'center' }}>
                                                {!identityCreated ? (
                                                  <button 
                                                    className="identity-btn create-btn" 
                                                    onClick={() => openIdentityModal(tp)}
                                                  >
                                                    መለያ ይፍጠሩ
                                                  </button>
                                                ) : (
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div className="tooltip-wrapper">
                                                      <button 
                                                        className="identity-btn status-btn"
                                                        style={{ cursor: 'default' }}
                                                      >
                                                        የተጠቃሚ መለያ ተፈጥሯል
                                                      </button>
                                                      <div className="custom-tooltip">
                                                        ለዚህ ሰራተኛ አስቀድሞ የተጠቃሚ መለያ ተፈጥሯል።
                                                      </div>
                                                    </div>
                                                    <button 
                                                      className="action-btn delete" 
                                                      title="መለያ ሰርዝ"
                                                      onClick={() => handleDeleteIdentity(tp.id)}
                                                    >
                                                      <FaTrash />
                                                    </button>
                                                  </div>
                                                )}
                                           </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view" onClick={() => openView(tp)}><FaEye /></button>
                        <button className="action-btn edit" onClick={() => openEdit(tp)}><FaEdit /></button>
                        <button className="action-btn delete" onClick={() => openDelete(tp)}><FaTrash /></button>
                        {/* {!identityCreated ? (
                          <button
                            className="action-btn edit"
                            onClick={() => openIdentityModal(tp)}
                            title="መለያ ፍጠር"
                          >
                            <FaPlus />
                          </button>
                        ) : (
                          <>
                            <div
                              className="tooltip-container"
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              ref={tooltipRef}
                              style={{ display: 'inline-block' }}
                            >
                              <button
                                className="action-btn view"
                                style={{ color: '#27ae60', cursor: 'default' }}
                                title="መለያ ተፈጥሯል"
                              >
                                <FaCheck />
                              </button>
                              <Tooltip
                                targetRef={tooltipRef}
                                visible={showTooltip}
                                message="የተጠቃሚ መለያ ቀድሞ ተፈጥሯል"
                                offset={12}
                              />
                            </div>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteIdentity(tp.id)}
                              title="መለያ ሰርዝ"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )} */}

                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                    DATA NOT AVAILABLE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length}
            </span>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span className="page-indicator">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        )}
      </div>

      {/* ============================================
          REGISTER MODAL (UPDATED – only 8 fields, two per row)
          ============================================ */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeRegister}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaPlus className="modal-icon" /> አዲስ ግብር ከፋይ</div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {/* Full width: Name */}
                  <div className="form-group full-width">
                    <label>ሙሉ ስም *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  {/* Two columns for the rest */}
                  <div className="form-group">
                    <label>ታክስ መለያ ቁጥር (TIN) *</label>
                    <input name="tin" value={formData.tin} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>የሽያጭ መለያ ኮድ (MRC)</label>
                    <input name="sellsIdentityCode" value={formData.sellsIdentityCode} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>የድርጅት ዓይነት *</label>
                    <select style={{ width: '100%',border:'none' }} name="orgType" value={formData.orgType} onChange={handleChange} required>
                      <option value=""> </option>
                      <option value="ኅላፊነቱ የተወሰነ ይግል ማህበር">ኅላፊነቱ የተወሰነ ይግል ማህበር</option>
                      <option value="ህብረት ስራ">ህብረት ስራ</option>
                      <option value="ሽርክና">ሽርክና</option>
                      <option value="አክሲዎን">አክሲዎን</option>
                      <option value="ክልላዊ">ክልላዊ</option>
                      <option value="NGO">NGO</option>
                      <option value="የግል">Personal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>የታክስ መጠን (Turnover Tax)</label>
                    <input name="turnoverTax" value={formData.turnoverTax} onChange={handleChange} type="number" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>የንዑስ መለያ ቁጥር</label>
                    <input name="subIdentityNumber" value={formData.subIdentityNumber} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>የሥራ ዓይነት</label>
                    <input name="jobType" value={formData.jobType} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>ስልክ ቁጥር *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? 'በመመዝገብ ላይ...' : 'ይመዝገቡ'}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeRegister}>ሰርዝ</button>
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
              <div className="modal-title"><FaEye className="modal-icon" /> ዝርዝር መረጃ</div>
              <button className="modal-close-btn" onClick={closeActionModal}><FaTimes /></button>
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
                    Previous
                  </button>
                  <span>ገጽ {viewPage} ከ {totalViewPages}</span>
                  <button onClick={() => setViewPage(prev => Math.min(prev + 1, totalViewPages))} disabled={viewPage === totalViewPages}>
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className="view-modal-footer">
              <button type="button" className="btn-cancel-red" onClick={closeActionModal}>
                ዝጋ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          EDIT MODAL (unchanged)
          ============================================ */}
      {modalType === 'edit' && selectedTaxPayer && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaEdit className="modal-icon" /> አርትዕ</div>
              <button className="modal-close-btn" onClick={closeActionModal}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>Name *</label><input name="name" value={editFormData.name} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>TIN *</label><input name="tin" value={editFormData.tin} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>Phone *</label><input name="phone" value={editFormData.phone} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>Org Type *</label><input name="orgType" value={editFormData.orgType} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>Tax Center *</label>
                    <select name="taxCenter" value={editFormData.taxCenter} onChange={handleEditChange} required>
                      <option value="" style={{width: '100%', border: 'none' }}>
                        ""
                      </option>
                      {taxCenters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Active</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
                      <input type="checkbox" name="isActive" checked={editFormData.isActive} onChange={handleEditChange} />
                      <span>{editFormData.isActive ? 'ንቁ' : 'ተቋርጧል'}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? '...' : 'ለውጦችን መዝግብ'}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeActionModal}>ዝጋ</button>
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
              <div className="modal-title"><FaTrash className="modal-icon" /> ማስጠንቀቂያ</div>
              <button className="modal-close-btn" onClick={closeActionModal}><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ?</h3>
              <p><strong>{selectedTaxPayer.name}</strong> ({selectedTaxPayer.tin})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none', marginTop: '20px' }}>
                <button className="btn-btn-danger" onClick={handleDelete} disabled={loading} style={{ background: '#e74c3c', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>ሰርዝ</button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>ሰርዝ</button>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <div className="modal-title"><FaPlus className="modal-icon" /> መለያ ይፍጠሩ</div>
              <button className="modal-close-btn" onClick={closeIdentityModal}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIdentity}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>ሙሉ ስም</label>
                    <input type="text" value={selectedIdentity.name} disabled style={{ background: '#f1f5f9' }} />
                  </div>
                  <div className="form-group full-width">
                    <label>Username *</label>
                    <input type="text" name="username" value={identityForm.username} onChange={handleIdentityChange} required autoFocus />
                  </div>
                  <div className="form-group full-width">
                    <label>Password *</label>
                    <input type="password" name="password" value={identityForm.password} onChange={handleIdentityChange} required />
                  </div>
                  <div className="form-group full-width">
                    <label>Confirm Password *</label>
                    <input type="password" name="confirmPassword" value={identityForm.confirmPassword} onChange={handleIdentityChange} required />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? 'በመፍጠር ላይ...' : 'አስቀምጥ'}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeIdentityModal}>ሰርዝ</button>
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