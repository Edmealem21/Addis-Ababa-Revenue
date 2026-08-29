import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaSearch, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

const UserData = () => {
  const { t, tData } = useLanguage();
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
    if (context?.setEmployees) {
      context.setEmployees(employees);
    }
  }, [employees, context]);

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
  // SEARCH & MODAL STATE
  // ============================================
  const [searchTerm, setSearchTerm] = useState('');

  // Identity modal
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [identityForm, setIdentityForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // ============================================
  // IDENTITY HANDLERS
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
  // FILTER & SEARCH LOGIC
  // ============================================
  const filteredData = employees.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const rawFullName = (item.fullName || '').toLowerCase();
    const transFullName = (tData(item.fullName) || '').toLowerCase();

    const rawIdNumber = (item.idNumber || '').toLowerCase();

    const rawTaxCenter = (item.taxCenter || '').toLowerCase();
    const transTaxCenter = (tData(item.taxCenter) || '').toLowerCase();

    const rawJobCategory = (item.jobCategory || item.role || '').toLowerCase();
    const transJobCategory = (tData(item.jobCategory || item.role) || '').toLowerCase();

    const rawStatus = (item.status || '').toLowerCase();
    const transStatus = (tData(item.status === 'Active' ? 'ንቁ' : item.status === 'Inactive' ? 'ተቋርጧል' : 'በመጠባበቅ ላይ') || '').toLowerCase();

    const username = (item.username || '').toLowerCase();

    return (
      rawFullName.includes(term) ||
      transFullName.includes(term) ||
      rawIdNumber.includes(term) ||
      rawTaxCenter.includes(term) ||
      transTaxCenter.includes(term) ||
      rawJobCategory.includes(term) ||
      transJobCategory.includes(term) ||
      rawStatus.includes(term) ||
      transStatus.includes(term) ||
      username.includes(term)
    );
  });

  const currentData = filteredData;

  // ============================================
  // RENDER
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
          {currentData.map((employee) => {
            const identityCreated = employee.identityCreated || false;
            return (
              <div className="data-card" key={employee.id}>
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-avatar">
                      {(tData(employee.fullName) || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="card-title-group">
                      <div className="card-title">{tData(employee.fullName)}</div>
                      <div className="card-subtitle">{tData(employee.jobCategory || 'Officer')}</div>
                    </div>
                  </div>
                  <span className={`status-badge ${employee.status === 'Active' ? 'active' : employee.status === 'Inactive' ? 'inactive' : 'pending'}`}>
                    {tData(employee.status === 'Active' ? 'ንቁ' : employee.status === 'Inactive' ? 'ተቋርጧል' : 'በመጠባበቅ ላይ')}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-field">
                    <span className="card-label">🆔 {t('idNumber')}</span>
                    <span className="card-value">{employee.idNumber}</span>
                  </div>
                  <div className="card-field">
                    <span className="card-label">🏢 {t('taxCenter')}</span>
                    <span className="card-value">{tData(employee.taxCenter)}</span>
                  </div>
                  <div className="card-field">
                    <span className="card-label">💼 {t('jobCategory')}</span>
                    <span className="card-value">{tData(employee.jobCategory || 'Officer')}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-actions" style={{ justifyContent: 'center' }}>
                    {!identityCreated ? (
                      <button 
                        className="identity-btn create-btn" 
                        onClick={() => openIdentityModal(employee)}
                      >
                        {t('createAccount')}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
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
                          onClick={() => handleDeleteIdentity(employee.id)}
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

      {/* ============================================
          IDENTITY MODAL
          ============================================ */}
      {showIdentityModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeIdentityModal}>
          <div className="modal-content identity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <div className="modal-title">
                <FaPlus className="modal-icon" />
                <span>{t('createAccount')}</span>
              </div>
              <button className="modal-close-btn" onClick={closeIdentityModal} title={t('close')}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIdentity}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('fullName')}</label>
                    <input
                      type="text"
                      value={tData(selectedEmployee.fullName)}
                      disabled
                      style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('username')} <span className="required">*</span></label>
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
                    <label>{t('password')} <span className="required">*</span></label>
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
                    <label>{t('confirmPassword')} <span className="required">*</span></label>
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
                    {loading ? t('creating') : t('save')}
                  </button>
                  <button type="button" className="btn-btn-secondary" onClick={closeIdentityModal}>
                    {t('cancel')}
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

export default UserData;