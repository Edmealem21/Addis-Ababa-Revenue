import React, { useState, useRef } from 'react';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Tooltip from '../../common/Tooltip';

const TaxCenter = () => {
  // ============================================
  // STATE (unchanged)
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
  // SAMPLE DATA (unchanged)
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
  // HANDLERS (unchanged)
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    const existing = taxCenters.find(center => center.name.toLowerCase() === formData.name.toLowerCase());
    if (existing) {
      toast.error('ይህ የታክስ ማእከል ስም ቀድሞ ተመዝግቧል! ❌');
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
    toast.success(`ታክስ ማእከል በተሳካ ሁኔታ ተመዝግቧል! (${newCenter.code}) ✅`);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.address.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    const updatedCenters = taxCenters.map(center => {
      if (center.id === selectedCenter.id) {
        return { ...center, name: editFormData.name, address: editFormData.address, role: editFormData.role, isActive: editFormData.isActive, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return center;
    });
    setTaxCenters(updatedCenters);
    closeActionModal();
    toast.success('ታክስ ማእከል በተሳካ ሁኔታ ተስተካክሏል! ✅');
  };

  const handleDelete = () => {
    const updatedCenters = taxCenters.filter(center => center.id !== selectedCenter.id);
    setTaxCenters(updatedCenters);
    closeActionModal();
    toast.success('ታክስ ማእከል በተሳካ ሁኔታ ተሰርዟል! 🗑️');
  };

  // ============================================
  // FILTER & MAIN PAGINATION (unchanged)
  // ============================================
  const filteredData = taxCenters.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const effectivePerPage = perPage;
  const totalPages = Math.ceil(filteredData.length / effectivePerPage) || 1;
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = startIndex + effectivePerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  if (currentPage > totalPages) setCurrentPage(totalPages);

  // ============================================
  // VIEW MODAL – Build fields with label/value, fullWidth flag
  // ============================================
  const getViewFields = (center) => {
    if (!center) return [];
    return [
      { label: 'ኮድ', value: center.code },
      { label: 'ስም', value: center.name },
      { label: 'ሚና', value: center.role || 'Officer' },
      { label: 'ንቁ ነው?', value: center.isActive ? 'አዎ' : 'አይ' },
      { label: 'አድራሻ', value: center.address, fullWidth: true },
      { label: 'የተመዘገበበት ቀን', value: center.createdAt || 'N/A' },
      { label: 'የተሻሻለበት ቀን', value: center.updatedAt || 'N/A' },
    ];
  };

  const viewFields = getViewFields(selectedCenter);
  const totalFields = viewFields.length;
  const usePagination = false;
  const totalRows = Math.ceil(totalFields / 2);
  const rowsPerPageEffective = usePagination ? rowsPerPage : totalRows;
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
  // RENDER (unchanged except view modal)
  // ============================================
  return (
    <div className="page-content">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />

      <div className="data-container">
        {/* FRAME HEADER */}
        <div className="frame-header">
          <div className="frame-actions">
            <div className="tooltip-container">
              <button ref={buttonRef} className="btn btn-primary" onClick={openModal} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <FaPlus /> አዲስ መዝገብ
              </button>
              <Tooltip targetRef={buttonRef} visible={showTooltip} message="አዲስ ይመዝገቡ" offset={12} />
            </div>
          </div>
          <div className="frame-title"><span className="frame-icon">🏢</span> የታክስ ማእከላት</div>
        </div>

        {/* CONTROLS */}
        <div className="data-controls">
          <div className="per-page">
            <span>Display</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={1}>1</option><option value={2}>2</option><option value={5}>5</option><option value={10}>10</option>
            </select>
            <span>lists per page</span>
          </div>
          <div className="search-wrapper">
            <span className="search-label">Search:</span>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="ፈልግ..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>ስም</th><th>አድራሻ</th><th>ኮድ</th><th>ድርጊቶች</th></tr>
            </thead>
            <tbody>
              {currentData.map((center, index) => (
                <tr key={center.id}>
                  <td>{startIndex + index + 1}</td>
                  <td><strong>{center.name}</strong></td>
                  <td>{center.address}</td>
                  <td><span className="code-badge">{center.code}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => openViewModal(center)}><FaEye /></button>
                      <button className="action-btn edit" onClick={() => openEditModal(center)}><FaEdit /></button>
                      <button className="action-btn delete" onClick={() => openDeleteModal(center)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>DATA NOT AVAILABLE</td></tr>}
            </tbody>
          </table>
        </div>

        {/* MAIN PAGINATION */}
        {filteredData.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">{startIndex + 1} - {Math.min(endIndex, filteredData.length)} ከ {filteredData.length}</span>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span className="page-info">ገጽ {currentPage} ከ {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        )}
      </div>

      {/* ============================================
          REGISTER MODAL (unchanged)
          ============================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title"><FaPlus className="modal-icon" /> አዲስ ይመዝገቡ</div></div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>ስም <span className="required">*</span></label><input type="text" name="name" value={formData.name} onChange={handleChange} required autoFocus /></div>
                  <div className="form-group full-width"><label>አድራሻ <span className="required">*</span></label><input type="text" name="address" value={formData.address} onChange={handleChange} required /></div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success">ይመዝገቡ</button>
                  <button type="button" className="btn-btn-secondary" onClick={closeModal}>ዝጋ</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          VIEW MODAL – Rows from Bottom, No Gap, Red Cancel Button
          ============================================ */}
      {modalType === 'view' && selectedCenter && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content view-modal-content">
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

              {/* Pagination (only if enabled) */}
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

            {/* Sticky Cancel Button – RED BACKGROUND */}
            <div className="view-modal-footer">
              <button type="button" className="btn-cancel-red" onClick={closeActionModal}>ዝጋ</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          EDIT & DELETE MODALS (unchanged)
          ============================================ */}
      {modalType === 'edit' && selectedCenter && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title"><FaEdit className="modal-icon" /> አርትዕ</div>
              <button className="modal-close-btn" onClick={closeActionModal}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>ስም <span className="required">*</span></label><input type="text" name="name" value={editFormData.name} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>አድራሻ <span className="required">*</span></label><input type="text" name="address" value={editFormData.address} onChange={handleEditChange} required /></div>
                  <div className="form-group"><label>ሚና</label><select name="role" value={editFormData.role} onChange={handleEditChange}><option value="Authority">Authority</option><option value="ICT Administrator">ICT Administrator</option><option value="Officer">Officer</option></select></div>
                  <div className="form-group"><label>ንቁ ነው?</label><select name="isActive" value={editFormData.isActive ? 'true' : 'false'} onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}><option value="true">አዎ</option><option value="false">አይ</option></select></div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success">ለውጦችን መዝግብ</button>
                  <button type="button" className="btn-btn-secondary" onClick={closeActionModal}>ዝጋ</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalType === 'delete' && selectedCenter && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <div className="modal-title"><FaTrash className="modal-icon" /> ማስጠንቀቂያ</div>
              <button className="modal-close-btn" onClick={closeActionModal}><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ?</h3>
              <p><strong>{selectedCenter.name}</strong> ({selectedCenter.code})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none' }}>
                <button className="btn-btn-danger" onClick={handleDelete} style={{ background: '#e74c3c', color: '#fff' }}>ሰርዝ</button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff' }}>ሰርዝ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCenter;