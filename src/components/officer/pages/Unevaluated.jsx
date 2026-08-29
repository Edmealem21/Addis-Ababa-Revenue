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

  const currentData = filteredData;

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
                placeholder="ፈልግ..."
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
                  <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)' }}>
                    {(item.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="card-title-group">
                    <div className="card-title">{item.name}</div>
                    <div className="card-subtitle">{item.tin}</div>
                  </div>
                </div>
                <span className="card-index-badge">#{idx + 1}</span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="card-label">🆔 TIN</span>
                  <span className="card-value">{item.tin}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">📅 መነሻ ቀን</span>
                  <span className="card-value">{item.startDate}</span>
                </div>
                <div className="card-field">
                  <span className="card-label">📅 መጨረሻ ቀን</span>
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

export default Unevaluated;