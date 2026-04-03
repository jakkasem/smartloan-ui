import React, { useState, useMemo } from 'react';
import './LoanSearch.css';

const API_BASE   = 'https://smartloan-api-ipn1.onrender.com';
const API_KEY    = 'smartloan-secret-key-2026';
const API_HEADERS = {
  'x-api-key': API_KEY,
  'ngrok-skip-browser-warning': 'true',
};

const STATUSES = ['PENDING', 'REVIEW', 'APPROVED', 'REJECTED'];

const COLUMNS = [
  { key: 'id',          label: 'ID' },
  { key: 'customerName',label: 'Customer Name' },
  { key: 'nationalId',  label: 'National ID' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'loanAmount',  label: 'Loan Amount' },
  { key: 'status',      label: 'Status' },
  { key: 'updatedAt',   label: 'Updated Date' },
];

const getStatusClass = (status) => {
  if (status === 'APPROVED') return 'status-badge--approved';
  if (status === 'PENDING')  return 'status-badge--pending';
  if (status === 'REVIEW')   return 'status-badge--review';
  if (status === 'REJECTED') return 'status-badge--rejected';
  return '';
};

const formatDate = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('th-TH', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const LoanSearch = () => {
  const [criteria, setCriteria]   = useState({ id: '', name: '', status: '' });
  const [results, setResults]     = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError]         = useState(null);
  const [sort, setSort]           = useState({ key: null, dir: 'asc' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setSearching(true);
    setError(null);
    setResults(null);
    setSort({ key: null, dir: 'asc' });

    const params = new URLSearchParams();
    if (criteria.id)     params.append('id',     criteria.id.trim());
    if (criteria.name)   params.append('name',   criteria.name.trim());
    if (criteria.status) params.append('status', criteria.status);

    fetch(`${API_BASE}/api/loans/search?${params.toString()}`, {
      headers: API_HEADERS
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResults(data.data);
          if (data.data.length === 0) setError('ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่ระบุ');
        } else {
          setError(data.message || 'เกิดข้อผิดพลาดในการค้นหา');
        }
        setSearching(false);
      })
      .catch(() => {
        setError('ไม่สามารถเชื่อมต่อกับ API ได้');
        setSearching(false);
      });
  };

  const handleClear = () => {
    setCriteria({ id: '', name: '', status: '' });
    setResults(null);
    setError(null);
    setSort({ key: null, dir: 'asc' });
  };

  const handleSort = (key) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  const sortedResults = useMemo(() => {
    if (!results || !sort.key) return results;
    return [...results].sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      const cmp = typeof av === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), 'th');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [results, sort]);

  const SortIcon = ({ colKey }) => {
    if (sort.key !== colKey) return <span className="sort-icon sort-icon--idle">⇅</span>;
    return <span className="sort-icon sort-icon--active">{sort.dir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="card card--animated">
      <h2 className="section-title">Loan Information Search</h2>

      {/* Criteria */}
      <div className="form-section">
        <h3 className="section-header">Criteria (เงื่อนไขการค้นหา)</h3>
        <div className="search-criteria-grid">
          <div className="form-group">
            <label className="search-label">ID</label>
            <input
              type="number"
              name="id"
              value={criteria.id}
              onChange={handleChange}
              placeholder="เช่น 5"
              min="1"
            />
          </div>
          <div className="form-group">
            <label className="search-label">Customer Name (ชื่อลูกค้า)</label>
            <input
              type="text"
              name="name"
              value={criteria.name}
              onChange={handleChange}
              placeholder="ค้นหาบางส่วนของชื่อ"
            />
          </div>
          <div className="form-group">
            <label className="search-label">Status (สถานะ)</label>
            <select name="status" value={criteria.status} onChange={handleChange}>
              <option value="">-- ทั้งหมด --</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-actions">
          <button className="btn btn-cancel btn--flex" onClick={handleClear} disabled={searching}>
            <span>↺</span> Clear
          </button>
          <button className="btn btn-update btn--flex search-btn" onClick={handleSearch} disabled={searching}>
            {searching ? 'Searching...' : <><span>🔍</span> Search</>}
          </button>
        </div>

        {error && <div className="search-error">⚠️ {error}</div>}
      </div>

      {/* Results */}
      <div className="form-section result-section">
        <h3 className="section-header">
          Search Result (ผลการค้นหา)
          {results && <span className="result-count">{results.length} รายการ</span>}
        </h3>
        <div className="result-body">
          {sortedResults && sortedResults.length > 0 ? (
            <div className="table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        className="sortable-th"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label} <SortIcon colKey={col.key} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map(loan => (
                    <tr key={loan.id}>
                      <td className="col-id">#{loan.id}</td>
                      <td className="col-name">{loan.customerName}</td>
                      <td>{loan.nationalId}</td>
                      <td>{loan.phoneNumber}</td>
                      <td className="col-amount">
                        {loan.loanAmount
                          ? loan.loanAmount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })
                          : '-'}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(loan.status)}`}>
                          {loan.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="col-date">{formatDate(loan.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">📊</span>
              <div>
                <h4 className="empty-state-title">
                  {results ? 'ไม่พบข้อมูล' : 'ยังไม่ได้ค้นหา'}
                </h4>
                <p>
                  {results
                    ? 'ลองเปลี่ยนเงื่อนไขการค้นหาแล้วลองใหม่อีกครั้ง'
                    : 'กรอกเงื่อนไขแล้วกด Search เพื่อค้นหาข้อมูลสินเชื่อ'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanSearch;
