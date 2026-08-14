import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaSearch, FaPlus, FaTrash, FaTimes, FaCheck, FaEye, FaEdit } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Tooltip from '../../common/Tooltip';

const UserData = () => {
  // ============================================
  // FALLBACK SAMPLE DATA (used if localStorage is empty)
  // ============================================
  const defaultEmployees = [
    { 
      id: 1, 
      fullName: 'አስቴር አለሙ', 
      idNumber: 'REV-001', 
      taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ',
      jobCategory: 'ICT Administrator',
      status: 'Active',
      identityCreated: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    { 
      id: 2, 
      fullName: 'ተስፋዬ መኮንን', 
      idNumber: 'REV-002', 
      taxCenter: 'አዲስ አበባ ቦሌ',
      jobCategory: 'Officer',
      status: 'Active',
      identityCreated: false,
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10'
    },
    { 
      id: 3, 
      fullName: 'ሰላም አበበ', 
      idNumber: 'REV-003', 
      taxCenter: 'አዲስ አበባ መኩሪያ',
      jobCategory: 'Authority',
      status: 'Active',
      identityCreated: false,
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05'
    },
    { 
      id: 4, 
      fullName: 'ዳዊት ሀይለማርያም', 
      idNumber: 'REV-004', 
      taxCenter: 'አዲስ አበባ ሳሪስ',
      jobCategory: 'Officer',
      status: 'Inactive',
      identityCreated: false,
      createdAt: '2024-04-20',
      updatedAt: '2024-04-20'
    },
    { 
      id: 5, 
      fullName: 'ሄለን ገብረእግዚአብሔር', 
      idNumber: 'REV-005', 
      taxCenter: 'አዲስ አበባ ካዛንቺስ',
      jobCategory: 'ICT Administrator',
      status: 'Active',
      identityCreated: false,
      createdAt: '2024-05-12',
      updatedAt: '2024-05-12'
    },
    { 
      id: 6, 
      fullName: 'አብይ አህመድ', 
      idNumber: 'REV-006', 
      taxCenter: 'አዲስ አበባ ላፍቶ',
      jobCategory: 'Officer',
      status: 'Pending',
      identityCreated: false,
      createdAt: '2024-06-18',
      updatedAt: '2024-06-18'
    },
    { 
      id: 7, 
      fullName: 'ማርያም በቀለ', 
      idNumber: 'REV-007', 
      taxCenter: 'አዲስ አበባ ጉለሌ',
      jobCategory: 'Authority',
      status: 'Active',
      identityCreated: false,
      createdAt: '2024-07-22',
      updatedAt: '2024-07-22'
    },
    { 
      id: 8, 
      fullName: 'ሳሙኤል ተስፋዬ', 
      idNumber: 'REV-008', 
      taxCenter: 'አዲስ አበባ ቀላም',
      jobCategory: 'Officer',
      status: 'Inactive',
      identityCreated: false,
      createdAt: '2024-08-30',
      updatedAt: '2024-08-30'
    },
  ];

  const STORAGE_KEY = 'employeesData';

  // ============================================
  // SAFE CONTEXT ACCESS (optional sync)
  // ============================================
  const context = useOutletContext();
  const setOutletEmployees = context?.setEmployees || (() => {});

  // ============================================
  // LOCAL STATE – load from localStorage or fallback to defaults
  // ============================================
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    // if nothing in storage, use default sample data and save it
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
    return defaultEmployees;
  });

  // ============================================
  // PERSISTENCE – save to localStorage and sync with outlet context
  // ============================================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    setOutletEmployees(employees);
  }, [employees, setOutletEmployees]);

  // ============================================
  // REACT TO EXTERNAL UPDATES (other tabs / components)
  // ============================================
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const newData = JSON.parse(e.newValue);
          if (Array.isArray(newData)) {
            setEmployees(newData);
          }
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ============================================
  // LOCAL UPDATE WRAPPER (used by all CRUD handlers)
  // ============================================
  const updateEmployees = (newEmployees) => {
    setEmployees(newEmployees);
  };

  // ============================================
  // SEARCH, PAGINATION, MODAL STATE (unchanged)
  // ============================================
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Identity modal
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [identityForm, setIdentityForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  // Action modals
  const [modalType, setModalType] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [viewPage, setViewPage] = useState(1);
  const rowsPerPage = 4;
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    idNumber: '',
    taxCenter: '',
    jobCategory: 'Officer',
    status: 'Active',
  });

  // ============================================
  // IDENTITY HANDLERS (unchanged)
  // ============================================
  const handleIdentityChange = (e) => {
    const { name, value } = e.target;
    setIdentityForm(prev => ({ ...prev, [name]: value }));
  };

  const openIdentityModal = (employee) => {
    setSelectedEmployee(employee);
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
      try {
        const updated = employees.map(emp => {
          if (emp.id === selectedEmployee.id) {
            return {
              ...emp,
              identityCreated: true,
              username: identityForm.username,
              password: identityForm.password,
            };
          }
          return emp;
        });
        updateEmployees(updated);
        closeIdentityModal();
        toast.success('የተጠቃሚ መለያ በተሳካ ሁኔታ ተፈጥሯል! ✅');
      } catch (error) {
        toast.error('መለያ መፍጠር አልተሳካም! እባክዎ እንደገና ይሞክሩ።');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleDeleteIdentity = (employeeId) => {
    if (window.confirm('እርግጠኛ ነዎት ይህን የተጠቃሚ መለያ መሰረዝ ይፈልጋሉ?')) {
      const updated = employees.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            identityCreated: false,
            username: undefined,
            password: undefined,
          };
        }
        return emp;
      });
      updateEmployees(updated);
      toast.success('የተጠቃሚ መለያ ተሰርዟል! 🗑️');
    }
  };

  // ============================================
  // ACTION MODAL HANDLERS (unchanged)
  // ============================================
  const openViewModal = (employee) => {
    setSelectedEmp(employee);
    setViewPage(1);
    setModalType('view');
  };

  const getViewFields = (emp) => {
    if (!emp) return [];
    return [
      { label: 'ሙሉ ስም', value: emp.fullName },
      { label: 'መለያ ቁጥር', value: emp.idNumber },
      { label: 'ታክስ ማእከል', value: emp.taxCenter },
      { label: 'ሚና', value: emp.jobCategory || 'Officer' },
      { label: 'ሁኔታ', value: emp.status || 'Active' },
      { label: 'የተመዘገበበት ቀን', value: emp.createdAt || 'N/A' },
      { label: 'የተሻሻለበት ቀን', value: emp.updatedAt || 'N/A' },
    ];
  };

  const viewFields = getViewFields(selectedEmp);
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

  const openEditModal = (employee) => {
    setSelectedEmp(employee);
    setEditFormData({
      fullName: employee.fullName,
      idNumber: employee.idNumber,
      taxCenter: employee.taxCenter,
      jobCategory: employee.jobCategory || 'Officer',
      status: employee.status || 'Active',
    });
    setModalType('edit');
  };

  const openDeleteModal = (employee) => {
    setSelectedEmp(employee);
    setModalType('delete');
  };

  const closeActionModal = () => {
    setModalType(null);
    setSelectedEmp(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editFormData.fullName.trim() || !editFormData.idNumber.trim() || !editFormData.taxCenter.trim()) {
      toast.error('እባክዎ ሁሉንም መስኮች ይሙሉ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = employees.map(emp => {
        if (emp.id === selectedEmp.id) {
          return {
            ...emp,
            fullName: editFormData.fullName,
            idNumber: editFormData.idNumber,
            taxCenter: editFormData.taxCenter,
            jobCategory: editFormData.jobCategory,
            status: editFormData.status,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return emp;
      });
      updateEmployees(updated);
      setLoading(false);
      closeActionModal();
      toast.success('ሰራተኛ በተሳካ ሁኔታ ተስተካክሏል! ✅');
    }, 1000);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = employees.filter(emp => emp.id !== selectedEmp.id);
      updateEmployees(updated);
      setLoading(false);
      closeActionModal();
      toast.success('ሰራተኛ በተሳካ ሁኔታ ተሰርዟል! 🗑️');
    }, 1000);
  };

  // ============================================
  // FILTER & PAGINATION (unchanged)
  // ============================================
  const filteredData = employees.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxCenter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const effectivePerPage = perPage === 0 ? filteredData.length : perPage;
  const totalPages = Math.ceil(filteredData.length / effectivePerPage) || 1;
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = startIndex + effectivePerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  // ============================================
  // RENDER (unchanged – exactly as you provided)
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
            <span className="total-count">ጠቅላላ: {employees.length} ተጠቃሚዎች</span>
          </div>
          <div className="frame-title">
            <span style={{ color: '#110505ea' }}>የአይሲቲ አስተዳደር  {'\u226B'}  </span>
            የተጠቃሚ መረጃ
          </div>
        </div>

        {/* CONTROLS */}
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

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ሙሉ ስም</th>
                <th>መለያ ቁጥር</th>
                <th>ታክስ ማእከል</th>
                <th>ስራ ምድብ</th>
                <th>ሁኔታ</th>
                <th>ድርጊቶች</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((employee, index) => {
                const identityCreated = employee.identityCreated || false;
                return (
                  <tr key={employee.id}>
                    <td>{startIndex + index + 1}</td>
                    <td><strong>{employee.fullName}</strong></td>
                    <td>{employee.idNumber}</td>
                    <td>{employee.taxCenter}</td>
                    <td>{employee.jobCategory || 'Officer'}</td>
                    <td>
                      <span className={`status-badge ${employee.status === 'Active' ? 'active' : employee.status === 'Inactive' ? 'inactive' : 'pending'}`}>
                        {employee.status === 'Active' ? 'ንቁ' : employee.status === 'Inactive' ? 'ተቋርጧል' : 'በመጠባበቅ ላይ'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        {!identityCreated ? (
                          <button 
                            className="identity-btn create-btn" 
                            onClick={() => openIdentityModal(employee)}
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
                              onClick={() => handleDeleteIdentity(employee.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
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
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length}
            </span>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span className="page-indicator">Page {currentPage} of {totalPages}</span>
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
          IDENTITY MODAL
          ============================================ */}
      {showIdentityModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeIdentityModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <div className="modal-title">
                <FaPlus className="modal-icon" />
                <span>የተጠቃሚ መለያ ይፍጠሩ</span>
              </div>
              <button className="modal-close-btn" onClick={closeIdentityModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIdentity}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>የሰራተኛ ሙሉ ስም</label>
                    <input
                      type="text"
                      value={selectedEmployee.fullName}
                      disabled
                      style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>የተጠቃሚ ስም <span className="required">*</span></label>
                    <input
                      type="text"
                      name="username"
                      placeholder="ለምሳሌ: aster.a"
                      value={identityForm.username}
                      onChange={handleIdentityChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>የይለፍ ቃል <span className="required">*</span></label>
                    <input
                      type="password"
                      name="password"
                      placeholder="የይለፍ ቃል ያስገቡ"
                      value={identityForm.password}
                      onChange={handleIdentityChange}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>የይለፍ ቃል አረጋግጥ <span className="required">*</span></label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="የይለፍ ቃል እንደገና ያስገቡ"
                      value={identityForm.confirmPassword}
                      onChange={handleIdentityChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? 'በመፍጠር ላይ...' : 'አስቀምጥ'}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeIdentityModal}>
                    ሰርዝ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          VIEW MODAL
          ============================================ */}
      {modalType === 'view' && selectedEmp && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content view-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2c3e50, #3498db)' }}>
              <div className="modal-title">
                <FaEye className="modal-icon" />
                <span>ዝርዝር መረጃ</span>
              </div>
              <button className="modal-close-btn" onClick={closeActionModal}>
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
          EDIT MODAL
          ============================================ */}
      {modalType === 'edit' && selectedEmp && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FaEdit className="modal-icon" />
                <span>አርትዕ</span>
              </div>
              <button className="modal-close-btn" onClick={closeActionModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>ሙሉ ስም <span className="required">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>መለያ ቁጥር <span className="required">*</span></label>
                    <input
                      type="text"
                      name="idNumber"
                      value={editFormData.idNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, idNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ታክስ ማእከል <span className="required">*</span></label>
                    <input
                      type="text"
                      name="taxCenter"
                      value={editFormData.taxCenter}
                      onChange={(e) => setEditFormData({ ...editFormData, taxCenter: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ስራ ምድብ</label>
                    <select
                      name="jobCategory"
                      value={editFormData.jobCategory}
                      onChange={(e) => setEditFormData({ ...editFormData, jobCategory: e.target.value })}
                    >
                      <option value="Authority">Authority</option>
                      <option value="ICT Administrator">ICT Administrator</option>
                      <option value="Officer">Officer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ሁኔታ</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <option value="Active">ንቁ</option>
                      <option value="Inactive">ተቋርጧል</option>
                      <option value="Pending">በመጠባበቅ ላይ</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>
                    {loading ? 'በመቀየር ላይ...' : 'ለውጦችን መዝግብ'}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeActionModal}>
                    ዝጋ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          DELETE MODAL
          ============================================ */}
      {modalType === 'delete' && selectedEmp && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
              <div className="modal-title">
                <FaTrash className="modal-icon" />
                <span>ማስጠንቀቂያ</span>
              </div>
              <button className="modal-close-btn" onClick={closeActionModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '48px', color: '#e74c3c' }}>⚠️</div>
              <h3 style={{ color: '#e74c3c' }}>እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ?</h3>
              <p><strong>{selectedEmp.fullName}</strong> ({selectedEmp.idNumber})</p>
              <div className="modal-actions" style={{ justifyContent: 'center', background: 'transparent', borderTop: 'none' }}>
                <button className="btn-btn-danger" onClick={handleDelete} disabled={loading} style={{ background: '#e74c3c', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>ሰርዝ</button>
                <button className="btn-btn-secondary" onClick={closeActionModal} style={{ background: '#95a5a6', color: '#fff', padding: '10px 30px', borderRadius: '8px', border: 'none' }}>ሰርዝ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserData;