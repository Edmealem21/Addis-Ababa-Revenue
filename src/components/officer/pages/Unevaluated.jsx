import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Unevaluated = () => {
  // Sample data
  const [notifies] = useState([
    { id: 1, name: 'አብይ አህመድ', tin: 'TIN-101', startDate: '2025-01-01', endDate: '2025-01-31' },
    { id: 2, name: 'ሰላም አበበ', tin: 'TIN-102', startDate: '2025-02-01', endDate: '2025-02-28' },
    { id: 3, name: 'ዳዊት ሀይለማርያም', tin: 'TIN-103', startDate: '2025-03-01', endDate: '2025-03-31' },
    { id: 4, name: 'ሄለን ገብረእግዚአብሔር', tin: 'TIN-104', startDate: '2025-04-01', endDate: '2025-04-30' },
    { id: 5, name: 'አስቴር አለሙ', tin: 'TIN-105', startDate: '2025-05-01', endDate: '2025-05-31' },
    { id: 6, name: 'ተስፋዬ መኮንን', tin: 'TIN-106', startDate: '2025-06-01', endDate: '2025-06-30' },
    { id: 7, name: 'ማርያም በቀለ', tin: 'TIN-107', startDate: '2025-07-01', endDate: '2025-07-31' },
    { id: 8, name: 'ሳሙኤል ተስፋዬ', tin: 'TIN-108', startDate: '2025-08-01', endDate: '2025-08-31' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = notifies.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  if (currentPage > totalPages) setCurrentPage(totalPages);

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
        }}
      />
      <div className="data-container">
        {/* Frame Header */}
        <div className="frame-header">
          <div className="frame-title">📋 ያልተገመገመ</div>
          <div className="frame-actions">
            <span className="total-count">ጠቅላላ: {filteredData.length}</span>
          </div>
        </div>

        {/* Controls */}
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
            <span>per page</span>
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

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tax Payer Name</th>
                <th>TIN</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={item.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.tin}</td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                    DATA NOT AVAILABLE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length}
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
    </div>
  );
};

export default Unevaluated;