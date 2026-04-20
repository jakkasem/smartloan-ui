import React, { useState, useEffect } from 'react';

const LoanSearch = () => {
  const [criteriaId, setCriteriaId] = useState('');
  const [criteriaName, setCriteriaName] = useState('');
  const [criteriaStatus, setCriteriaStatus] = useState(''); // Default to empty string ("ทั้งหมด")
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleClear = () => {
    setCriteriaId('');
    setCriteriaName('');
    setCriteriaStatus('');
    setSearchResults(null);
    setError(null);
  };

  const handleSearch = async () => {
    setSearching(true);
    setError(null);
    setSearchResults(null);

    const params = new URLSearchParams();
    if (criteriaId) params.append('id', criteriaId);
    if (criteriaName) params.append('name', criteriaName);
    if (criteriaStatus) params.append('status', criteriaStatus);

    try {
      const response = await fetch(`https://smartloan-api-ipn1.onrender.com/api/loans/search?${params.toString()}`, {
        headers: {
          'x-api-key': 'smartloan-secret-key-2026',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
        if (!data.data || data.data.length === 0) {
          setError('No results found.');
        }
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to load search results.');
    } finally {
      setSearching(false);
    }
  };

  const formatNationalId = (id) => {
    if (!id) return '-';
    const cleanId = id.toString().replace(/\D/g, '');
    if (cleanId.length === 13) {
      return `${cleanId.slice(0, 1)}-${cleanId.slice(1, 5)}-${cleanId.slice(5, 10)}-${cleanId.slice(10, 12)}-${cleanId.slice(12, 13)}`;
    }
    return id;
  };

  return (
    <div className="card" style={{ animation: 'fadeIn 0.4s ease-out', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary) 0%, #60a5fa 100%)' }}></div>
      
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔍</span> 
        Loan Information Search (ค้นหาข้อมูลสินเชื่อ)
      </h2>
      
      {/* Criteria Section */}
      <div style={{ marginBottom: '3rem' }}>
        {/* Header Bar */}
        <div style={{ 
          backgroundColor: '#f1f5f9', 
          padding: '1rem 1.5rem', 
          borderRadius: '6px', 
          marginBottom: '1rem' 
        }}>
          <h3 style={{ margin: 0, color: '#334155', fontSize: '1.125rem', fontWeight: '700' }}>
            Criteria <span style={{ fontWeight: '600' }}>(เงื่อนไขการค้นหา)</span>
          </h3>
        </div>
        
        {/* Form Card */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          border: '1px solid #f1f5f9', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* ID Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                ID
              </label>
              <input 
                type="text" 
                placeholder="เช่น 5"
                value={criteriaId}
                onChange={(e) => setCriteriaId(e.target.value)}
                disabled={loading}
                className="simple-input"
              />
            </div>
            
            {/* Customer Name Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                Customer Name (ชื่อลูกค้า)
              </label>
              <input 
                type="text" 
                placeholder="ค้นหาบางส่วนของชื่อ"
                value={criteriaName}
                onChange={(e) => setCriteriaName(e.target.value)}
                disabled={loading}
                className="simple-input"
              />
            </div>

            {/* Status Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                Status (สถานะ)
              </label>
              <select 
                value={criteriaStatus} 
                onChange={(e) => setCriteriaStatus(e.target.value)}
                disabled={loading}
                className="simple-input simple-select"
              >
                <option value="">ทั้งหมด</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              onClick={handleClear}
              disabled={loading || searching}
              className="simple-btn btn-clear"
            >
              <span style={{ fontSize: '1rem' }}>↺</span> Clear
            </button>
            <button 
              onClick={handleSearch}
              disabled={loading || searching}
              className="simple-btn btn-search"
            >
              {searching ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="spinner"></span> Searching...
                </span>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>🔍</span> Search
                </>
              )}
            </button>
          </div>

          {error && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#ef4444', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              animation: 'slideUp 0.3s ease-out'
            }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span> {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div style={{ minHeight: '400px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 0',
          borderBottom: '2px solid #e2e8f0', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
            Search Result <span style={{ color: '#64748b', fontWeight: '400', fontSize: '1rem' }}>(ผลการค้นหา)</span>
          </h3>
          {searchResults !== null && (
            <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
              color: 'white', 
              padding: '0.4rem 1.25rem', 
              borderRadius: '9999px', 
              fontSize: '0.875rem', 
              fontWeight: '700',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
            }}>
              {searchResults.length} รายการ
            </span>
          )}
        </div>

        <div>
          {searchResults && searchResults.length > 0 ? (
            <div style={{ 
              width: '100%', 
              overflowX: 'auto', 
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9',
              animation: 'slideUp 0.4s ease-out'
            }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>National ID</th>
                    <th>Phone Number</th>
                    <th>Loan Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((loan, index) => (
                    <tr key={loan.id || index} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td style={{ color: '#0f172a', fontWeight: '600' }}>#{loan.id}</td>
                      <td style={{ color: '#334155', fontWeight: '500' }}>{loan.customerName || '-'}</td>
                      <td style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.9rem' }}>{formatNationalId(loan.nationalId)}</td>
                      <td style={{ color: '#64748b' }}>{loan.phoneNumber || '-'}</td>
                      <td style={{ color: '#0f172a', fontWeight: '700' }}>
                        {loan.loanAmount 
                          ? loan.loanAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) 
                          : '-'}
                      </td>
                      <td>
                        <span className={`status-badge ${loan.status ? loan.status.toLowerCase() : 'unknown'}`}>
                          {(loan.status === 'Pending' || loan.status === 'PENDING') && '⏳ '}
                          {loan.status === 'Approved' && '✓ '}
                          {(loan.status === 'Rejected' || loan.status === 'REJECTED') && '❌ '}
                          {loan.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : searchResults && searchResults.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🤷</span>
              <h4>No results found</h4>
              <p>Try adjusting your search criteria and try again.</p>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <h4>No search performed yet</h4>
              <p>Enter criteria above and click search to view loan details.</p>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .card * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .simple-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          fontSize: 0.875rem;
          background-color: white;
          outline: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          transition: all 0.2s;
          color: #334155;
        }

        .simple-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .simple-select {
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, #475569 50%), linear-gradient(135deg, #475569 50%, transparent 50%);
          background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }

        .simple-btn {
          padding: 0.65rem 1.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          border: none;
        }

        .simple-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-clear {
          background-color: #f1f5f9;
          color: #334155;
        }

        .btn-clear:hover:not(:disabled) {
          background-color: #e2e8f0;
        }

        .btn-search {
          background: #2563eb;
          color: white;
        }

        .btn-search:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
          min-width: 800px;
        }

        .modern-table th {
          padding: 1.25rem 1rem;
          font-weight: 700;
          color: #475569;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background-color: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .modern-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s;
        }

        .modern-table tbody tr {
          animation: slideUp 0.3s ease-out backwards;
        }

        .modern-table tbody tr:hover td {
          background-color: #f8fafc;
        }

        .status-badge {
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          letter-spacing: 0.3px;
        }

        .status-badge.approved {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .status-badge.pending {
          background-color: #fef9c3;
          color: #854d0e;
          border: 1px solid #fef08a;
        }

        .status-badge.rejected {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .empty-state {
          width: 100%;
          padding: 5rem 2rem;
          text-align: center;
          background-color: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .empty-state:hover {
          border-color: #94a3b8;
          background-color: #f1f5f9;
        }

        .empty-icon {
          font-size: 4rem;
          opacity: 0.8;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default LoanSearch;
