import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const UserData = () => {
  // ============================================
  // GET SHARED STATE FROM PARENT (ICTAdmin)
  // ============================================
  const { employees } = useOutletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================
  // FILTER DATA - Search by Full Name, ID, or Tax Center
  // ============================================
  const filteredData = employees.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.taxCenter.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* ============================================
          ONE MAIN FRAME - Contains Everything
          ============================================ */}
      <div className="data-container">

        {/* ============================================
            FRAME HEADER - Title Centered, Actions Left
            ============================================ */}
        <div className="frame-header">
          <div className="frame-actions">
            {/* <span className="total-count">ጠቅላላ: {employees.length} ተጠቃሚዎች</span> */}
          </div>
          <div className="frame-title">
            <span style={{ color: '#110505ea' }}>የአይሲቲ አስተዳደር  {'\u226B'}  </span>
            {/* <span className="frame-icon">👤</span> */}
            የተጠቃሚ መረጃ
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
            TABLE - Number, Full Name, ID, Tax Center Only
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
            {/* <span className="pagination-info">
              {filteredData.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredData.length)} ከ {filteredData.length}
            </span> */}
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
               First
            </button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {/* <span className="page-info">ገጽ {currentPage} ከ {totalPages}</span> */}
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
    </div>
  );
};

export default UserData;