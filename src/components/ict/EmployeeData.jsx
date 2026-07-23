import React, { useState, useRef } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Tooltip from '../common/Tooltip'; // ← Import Tooltip component

const EmployeeData = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // REF for the button
  const buttonRef = useRef(null);

  // Form Data - 3 fields
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    taxCenter: ''
  });

  // Sample Employee Data
  const [employees, setEmployees] = useState([
    { id: 1, fullName: 'አስቴር አለሙ', idNumber: 'REV-001', taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ' },
    { id: 2, fullName: 'ተስፋዬ መኮንን', idNumber: 'REV-002', taxCenter: 'አዲስ አበባ ቦሌ' },
    { id: 3, fullName: 'ሰላም አበበ', idNumber: 'REV-003', taxCenter: 'አዲስ አበባ መኩሪያ' },
    { id: 4, fullName: 'ዳዊት ሀይለማርያም', idNumber: 'REV-004', taxCenter: 'አዲስ አበባ ሳሪስ' },
    { id: 5, fullName: 'ሄለን ገብረእግዚአብሔር', idNumber: 'REV-005', taxCenter: 'አዲስ አበባ ካዛንቺስ' },
    { id: 6, fullName: 'አብይ አህመድ', idNumber: 'REV-006', taxCenter: 'አዲስ አበባ ላፍቶ' },
    { id: 7, fullName: 'ማርያም በቀለ', idNumber: 'REV-007', taxCenter: 'አዲስ አበባ ጉለሌ' },
    { id: 8, fullName: 'ሳሙኤል ተስፋዬ', idNumber: 'REV-008', taxCenter: 'አዲስ አበባ ቀላም' },
  ]);

  // ============================================
  // HANDLE FORM INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ============================================
  // OPEN MODAL - Shows tooltip and keeps it visible
  // ============================================
  const openModal = () => {
    setFormData({ fullName: '', idNumber: '', taxCenter: '' });
    setShowModal(true);
    setShowTooltip(true);
  };

  // ============================================
  // CLOSE MODAL - Hides tooltip
  // ============================================
  const closeModal = () => {
    setFormData({ fullName: '', idNumber: '', taxCenter: '' });
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
  // HANDLE REGISTER
  // ============================================
  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('እባክዎ ሙሉ ስም ያስገቡ!');
      return;
    }
    if (!formData.idNumber.trim()) {
      toast.error('እባክዎ መለያ ቁጥር ያስገቡ!');
      return;
    }
    if (!formData.taxCenter.trim()) {
      toast.error('እባክዎ ታክስ ማእከል ያስገቡ!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
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
          taxCenter: formData.taxCenter
        };

        setEmployees([...employees, newEmployee]);
        setLoading(false);
        closeModal();
        toast.success('ሰራተኛ በተሳካ ሁኔታ ተመዝግቧል! ✅');

      } catch (error) {
        setLoading(false);
        toast.error('ምዝገባ አልተሳካም! እባክዎ እንደገና ይሞክሩ።');
      }
    }, 1000);
  };

  // ============================================
  // FILTER DATA
  // ============================================
  const filteredData = employees.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxCenter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================
  // PAGINATION
  // ============================================
  // If perPage is 0, show all data
  const effectivePerPage = perPage === 0 ? filteredData.length : perPage;
  const totalPages = Math.ceil(filteredData.length / effectivePerPage) || 1;
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = startIndex + effectivePerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  return (
    <div className="page-content">
      {/* ============================================
          ONE MAIN FRAME - Contains Everything
          ============================================ */}
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
            FRAME HEADER - Title Centered, Actions Left
            ============================================ */}
        <div className="frame-header">
          <div className="frame-actions">
            <div className="tooltip-container">
              <button 
                ref={buttonRef}                        // ← ADDED ref
                className="btn btn-primary" 
                onClick={openModal}
                onMouseEnter={handleMouseEnter}        // ← HOVER: shows tooltip
                onMouseLeave={handleMouseLeave}        // ← HOVER: hides tooltip (if modal closed)
              >
                <FaPlus /> አዲስ መዝገብ
              </button>

              {/* Tooltip using Portal */}
              <Tooltip
                targetRef={buttonRef}
                visible={showTooltip}
                message="አዲስ ይመዝገቡ"
                offset={12}
              />
            </div>
          </div>
          <div className="frame-title">
            <span style={{ color: '#110505ea' }}>የአይሲቲ አስተዳደር {'\u226B'}  </span>
            <span className="frame-icon"></span>
            የሰራተኛ መረጃ
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
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span>Data per</span>
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
            TABLE - Number, Full Name, ID, Tax Center
            ============================================ */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ሙሉ ስም</th>
                <th>መለያ ቁጥር</th>
                <th>ታክስ ማእከል</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{startIndex + index + 1}</td>
                  <td><strong>{employee.fullName}</strong></td>
                  <td>{employee.idNumber}</td>
                  <td>{employee.taxCenter}</td>
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
          END OF MAIN FRAME
          ============================================ */}

      {/* ============================================
          MODAL POPUP - REGISTRATION FORM
          ============================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                <FaPlus className="modal-icon" />
                <span>አዲስ ይመዝገቡ</span>
              </div>
            </div>

            {/* Modal Body - Form Fields */}
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  {/* Full Name */}
                  <div className="form-group full-width">
                    <label>ሙሉ ስም <span className="required">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      // placeholder="ሙሉ ስም ያስገቡ"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>

                  {/* ID Number */}
                  <div className="form-group full-width">
                    <label>መለያ ቁጥር <span className="required">*</span></label>
                    <input
                      type="text"
                      name="idNumber"
                      // placeholder="ለምሳሌ: REV-001"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Tax Center */}
                  <div className="form-group full-width">
                    <label>ታክስ ማእከል <span className="required">*</span></label>
                    <input
                      type="text"
                      name="taxCenter"
                      // placeholder="ታክስ ማእከል ያስገቡ"
                      value={formData.taxCenter}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? 'በመመዝገብ ላይ...' : 'ይመዝገቡ'}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeModal}>
                    ሰርዝ
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

export default EmployeeData;