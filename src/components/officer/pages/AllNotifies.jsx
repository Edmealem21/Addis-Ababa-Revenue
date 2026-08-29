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

  const currentData = filteredData;

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
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ፈልግ በስም, TIN, ወይም ተቀባይ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* MAIN CARDS GRID */}
        <div className="cards-grid">
          {currentData.map((item, idx) => (
            <div className="data-card" key={item.id}>
              <div className="card-header">
                <div className="card-header-left">
                  <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #8e44ad, #9b59b6)' }}>
                    {(item.name || 'N').charAt(0).toUpperCase()}
                  </div>
                  <div className="card-title-group">
                    <div className="card-title">{item.name}</div>
                    <div className="card-subtitle">{item.tin}</div>
                  </div>
                </div>
                <span className={getStatusBadge(item.status)}>
                  {getStatusText(item.status)}
                </span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="card-label">🆔 TIN</span>
                  <span className="card-value">{item.tin}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">👤 Receiver</span>
                  <span className="card-value">{item.receiver}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">📅 Start Date</span>
                  <span className="card-value">{item.startDate}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">📅 End Date</span>
                  <span className="card-value">{item.endDate}</span>
                </div>
              </div>
            </div>
          ))}
          {currentData.length === 0 && (
            <div className="no-data-card">
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <div>DATA NOT AVAILABLE</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllNotifies;