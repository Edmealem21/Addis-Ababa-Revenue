import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

const AllNotifies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data with additional fields: receiver, status
  const [notifies] = useState([
    { id: 1, name: 'አብይ አህመድ', tin: 'TIN-101', startDate: '2025-01-01', endDate: '2025-01-31', receiver: 'አስቴር አለሙ', status: 'Pending' },
    { id: 2, name: 'ሰላም አበበ', tin: 'TIN-102', startDate: '2025-02-01', endDate: '2025-02-28', receiver: 'ተስፋዬ መኮንን', status: 'Approved' },
    { id: 3, name: 'ዳዊት ሀይለማርያም', tin: 'TIN-103', startDate: '2025-03-01', endDate: '2025-03-31', receiver: 'ሄለን ገብረእግዚአብሔር', status: 'Pending' },
    { id: 4, name: 'ሄለን ገብረእግዚአብሔር', tin: 'TIN-104', startDate: '2025-04-01', endDate: '2025-04-30', receiver: 'አስቴር አለሙ', status: 'Approved' },
    { id: 5, name: 'አስቴር አለሙ', tin: 'TIN-105', startDate: '2025-05-01', endDate: '2025-05-31', receiver: 'ተስፋዬ መኮንን', status: 'Rejected' },
    { id: 6, name: 'ተስፋዬ መኮንን', tin: 'TIN-106', startDate: '2025-06-01', endDate: '2025-06-30', receiver: 'ሄለን ገብረእግዚአብሔር', status: 'Pending' },
    { id: 7, name: 'ማርያም በቀለ', tin: 'TIN-107', startDate: '2025-07-01', endDate: '2025-07-31', receiver: 'አስቴር አለሙ', status: 'Approved' },
    { id: 8, name: 'ሳሙኤል ተስፋዬ', tin: 'TIN-108', startDate: '2025-08-01', endDate: '2025-08-31', receiver: 'ተስፋዬ መኮንን', status: 'Pending' },
  ]);

  const hasSearch = searchTerm.trim().length > 0;
  const lineColor = hasSearch ? 'green' : 'red';

  // Filter
  const filteredData = notifies.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.receiver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  if (currentPage > totalPages) setCurrentPage(totalPages);

  // Status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return 'status-badge active';
      case 'Pending': return 'status-badge pending';
      case 'Rejected': return 'status-badge inactive';
      default: return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'Approved': return 'ተቀባይነት አግኝቷል';
      case 'Pending': return 'በመጠባበቅ ላይ';
      case 'Rejected': return 'ውድቅ ተደርጓል';
      default: return status;
    }
  };

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
          <div className="frame-title">📨 ሁሉም ማሳወቂያዎች</div>
          <div className="frame-actions">
            <span className="total-count">ጠቅላላ: {filteredData.length}</span>
          </div>
        </div>

        {/* Search Area with Line */}
        <div className="notify-search-area">
          <div className="search-wrapper">
            <span className="search-label">Search:</span>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ፈልግ በስም, TIN, ወይም ተቀባይ..."
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
              <span>
                🔍 Search by tax payer name, tax identity number, or receiver name
              </span>
            </div>
          )}
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
                <th>Receiver</th>
                <th>Status</th>
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
                  <td>{item.receiver}</td>
                  <td>
                    <span className={getStatusBadge(item.status)}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
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

export default AllNotifies;