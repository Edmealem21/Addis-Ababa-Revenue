import React, { useState, useRef } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Tooltip from '../common/Tooltip';

const TaxCenter = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  const buttonRef = useRef(null);

  // Form Data - 2 fields
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  // Sample Tax Center Data with Code
  const [taxCenters, setTaxCenters] = useState([
    { id: 1, name: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', address: 'ቅዱስ ጊዮርጊስ አደባባይ', code: 'TC-001' },
    { id: 2, name: 'አዲስ አበባ ቦሌ', address: 'ቦሌ መዳፍ ቀዳማዊ', code: 'TC-002' },
    { id: 3, name: 'አዲስ አበባ መኩሪያ', address: 'መኩሪያ አካባቢ', code: 'TC-003' },
    { id: 4, name: 'አዲስ አበባ ሳሪስ', address: 'ሳሪስ አደባባይ', code: 'TC-004' },
    { id: 5, name: 'አዲስ አበባ ካዛንቺስ', address: 'ካዛንቺስ አደባባይ', code: 'TC-005' },
    { id: 6, name: 'አዲስ አበባ ላፍቶ', address: 'ላፍቶ አደባባይ', code: 'TC-006' },
    { id: 7, name: 'አዲስ አበባ ጉለሌ', address: 'ጉለሌ አደባባይ', code: 'TC-007' },
    { id: 8, name: 'አዲስ አበባ ቀላም', address: 'ቀላም አደባባይ', code: 'TC-008' },
  ]);

  // ============================================
  // HANDLE FORM INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ============================================
  // OPEN MODAL - Shows tooltip
  // ============================================
  const openModal = () => {
    setFormData({ name: '', address: '' });
    setShowModal(true);
    setShowTooltip(true);
  };

  // ============================================
  // CLOSE MODAL - Hides tooltip
  // ============================================
  const closeModal = () => {
    setFormData({ name: '', address: '' });
    setShowModal(false);
    setShowTooltip(false);
  };

  // ============================================
  // HOVER HANDLERS
  // ============================================
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    // Only hide if modal is NOT open
    if (!showModal) {
      setShowTooltip(false);
    }
  };

  // ============================================
  // GENERATE CODE
  // ============================================
  const generateCode = () => {
    const nextId = taxCenters.length + 1;
    return `TC-${String(nextId).padStart(3, '0')}`;
  };

  // ============================================
  // HANDLE REGISTER
  // ============================================
  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('እባክዎ የታክስ ማእከል ስም ያስገቡ!');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('እባክዎ አድራሻ ያስገቡ!');
      return;
    }

    setTimeout(() => {
      try {
        const existing = taxCenters.find(center => 
          center.name.toLowerCase() === formData.name.toLowerCase()
        );
        if (existing) {
          toast.error('ይህ የታክስ ማእከል ስም ቀድሞ ተመዝግቧል! ❌');
          return;
        }

        const newCenter = {
          id: taxCenters.length + 1,
          name: formData.name,
          address: formData.address,
          code: generateCode()
        };

        setTaxCenters([...taxCenters, newCenter]);
        closeModal();
        toast.success(`ታክስ ማእከል በተሳካ ሁኔታ ተመዝግቧል! (${newCenter.code}) `);

      } catch (error) {
        toast.error('ምዝገባ አልተሳካም! እባክዎ እንደገና ይሞክሩ።');
      }
    }, 1000);
  };

  // ============================================
  // FILTER DATA
  // ============================================
  const filteredData = taxCenters.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================
  // PAGINATION
  // ============================================
  const effectivePerPage = perPage;
  const totalPages = Math.ceil(filteredData.length / effectivePerPage) || 1;
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = startIndex + effectivePerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  return (
    <div className="page-content">
      <div className="data-container">

        {/* TOASTER */}
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

        {/* ============================================
            FRAME HEADER
            ============================================ */}
        <div className="frame-header">
          <div className="frame-actions">
            <div className="tooltip-container">
              <button 
                ref={buttonRef}
                className="btn btn-primary" 
                onClick={openModal}
                onMouseEnter={handleMouseEnter}    // ← HOVER: shows tooltip
                onMouseLeave={handleMouseLeave}    // ← HOVER: hides tooltip (if modal closed)
              >
                <FaPlus /> አዲስ መዝገብ
              </button>

              <Tooltip
                targetRef={buttonRef}
                visible={showTooltip}
                message="አዲስ ይመዝገቡ"
                offset={12}
              />
            </div>
          </div>
          <div className="frame-title">
            <span className="frame-icon"></span>
            የታክስ ማእከላት
          </div>
        </div>

        {/* ============================================
            CONTROLS - Per Page & Search
            ============================================ */}
        <div className="data-controls">
          <div className="per-page">
            <span>Display</span>
            <select 
              value={perPage} 
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span>lists per page</span>
          </div>
          <div className="search-wrapper">
            <span className="search-label">Search:</span>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ፈልግ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================================
            TABLE - Number, Tax Center, Code
            ============================================ */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>የታክስ ማእከል ስም</th>
                <th>አድራሻ</th>
                <th>ኮድ</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((center, index) => (
                <tr key={center.id}>
                  <td>{startIndex + index + 1}</td>
                  <td><strong>{center.name}</strong></td>
                  <td>{center.address}</td>
                  <td>
                    <span className="code-badge">{center.code}</span>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
                    DATA NOT AVAILABLE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============================================
            PAGINATION - First, Previous, Next, Last
            ============================================ */}
        {filteredData.length > 0 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              Last
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          MODAL POPUP - REGISTER FORM FRAME
          ============================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <div className="modal-title">
                <FaPlus className="modal-icon" />
                <span>አዲስ ይመዝገቡ</span>
              </div>
            </div>

            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>የታክስ ማእከል <span className="required">*</span></label>
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
                    <label>አድራሻ <span className="required">*</span></label>
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
                    ይመዝገቡ
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeModal}>
                    ዝጋ
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCenter;