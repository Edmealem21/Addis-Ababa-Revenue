// src/components/ictadmin/pages/Employees/IctUserData.jsx
import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaSearch, FaPlus, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Tooltip from '../../../common/Tooltip';

const IctUserData = () => {
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

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div className="page-content">
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#fff', color: '#1a1a2e', padding: '16px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '14px' }, success: { icon: '✅', style: { borderLeft: '4px solid #27ae60' } }, error: { icon: '❌', style: { borderLeft: '4px solid #e74c3c' } } }} />
      <div className="data-container">
        <div className="frame-header">
          <div className="frame-actions">
            <span className="total-count">ጠቅላላ: {employees.length} ተጠቃሚዎች</span>
          </div>
          <div className="frame-title">👤 የተጠቃሚ መረጃ</div>
        </div>
        <div className="data-controls">
          <div className="per-page">
            <span>Display</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={1}>1</option><option value={2}>2</option><option value={5}>5</option><option value={10}>10</option>
            </select>
            <span>per page</span>
          </div>
          <div className="search-wrapper">
            <span className="search-label">Search:</span>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="ፈልግ..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ሙሉ ስም</th>
                <th>የመታወቂያ ቁጥር</th>
                <th>የስራ መደብ</th>
                <th>የታክስ ማእከል</th>
                <th>ድርጊቶች</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((emp, idx) => {
                const identityCreated = emp.identityCreated || false;
                return (
                  <tr key={emp.id}>
                    <td>{startIndex + idx + 1}</td>
                    <td><strong>{emp.fullName}</strong></td>
                    <td>{emp.idNumber}</td>
                    <td>{emp.jobCategory}</td>
                    <td>{emp.taxCenter}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        {!identityCreated ? (
                          <button 
                            className="identity-btn create-btn" 
                            onClick={() => openIdentityModal(emp)}
                          >
                            መለያ ይፍጠሩ
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
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
                              onClick={() => handleDeleteIdentity(emp.id)}
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
              {currentData.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>DATA NOT AVAILABLE</td></tr>}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">Showing {startIndex+1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length}</span>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage===1}>First</button>
            <button onClick={() => setCurrentPage(currentPage-1)} disabled={currentPage===1}>Previous</button>
            <span className="page-indicator">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentPage===totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage===totalPages}>Last</button>
          </div>
        )}
      </div>

      {/* Identity Modal */}
      {showIdentityModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeIdentityModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
              <div className="modal-title"><FaPlus className="modal-icon" /> መለያ ይፍጠሩ</div>
              <button className="modal-close-btn" onClick={closeIdentityModal}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateIdentity}>
                <div className="form-grid">
                  <div className="form-group full-width"><label>ሙሉ ስም</label><input type="text" value={selectedEmployee.fullName} disabled style={{ background: '#f1f5f9' }} /></div>
                  <div className="form-group full-width"><label>Username *</label><input name="username" value={identityForm.username} onChange={handleIdentityChange} required autoFocus /></div>
                  <div className="form-group full-width"><label>Password *</label><input type="password" name="password" value={identityForm.password} onChange={handleIdentityChange} required /></div>
                  <div className="form-group full-width"><label>Confirm Password *</label><input type="password" name="confirmPassword" value={identityForm.confirmPassword} onChange={handleIdentityChange} required /></div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-btn-success" disabled={loading}>{loading ? '...' : 'አስቀምጥ'}</button>
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

export default IctUserData;