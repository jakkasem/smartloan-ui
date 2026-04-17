import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import LoanSearch from './components/LoanSearch';
import NewLoanForm from './components/NewLoanForm';

function App() {
  const [activeView, setActiveView] = useState('newApplication');

  return (
    <div className="app-container">
      <aside className="sidebar" style={{ borderRight: '1px solid #f1f5f9', boxShadow: '1px 0 10px rgba(0,0,0,0.02)' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
          <div style={{ 
            width: '42px', height: '42px', 
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
            borderRadius: '12px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', fontSize: '1.25rem', 
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)' 
          }}>🏦</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontWeight: '800', fontSize: '1.2rem', 
              color: '#0f172a', letterSpacing: '0.5px',
              fontFamily: 'Inter, sans-serif'
            }}>LOAN APP</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Approval System</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</span>

          <button 
            className={`sidebar-item ${activeView === 'newApplication' ? 'active' : ''}`}
            onClick={() => setActiveView('newApplication')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              textAlign: 'left', border: 'none', background: activeView === 'newApplication' ? '#eff6ff' : 'transparent', 
              width: '100%', cursor: 'pointer', borderRadius: '8px', padding: '0.85rem 1rem',
              fontWeight: activeView === 'newApplication' ? '600' : '500',
              color: activeView === 'newApplication' ? '#2563eb' : '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.1rem', opacity: activeView === 'newApplication' ? 1 : 0.6 }}>✨</span> 
            New Loan Form
            {activeView === 'newApplication' && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%' }}></span>}
          </button>
          <button 
            className={`sidebar-item ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              textAlign: 'left', border: 'none', background: activeView === 'search' ? '#eff6ff' : 'transparent', 
              width: '100%', cursor: 'pointer', borderRadius: '8px', padding: '0.85rem 1rem',
              fontWeight: activeView === 'search' ? '600' : '500',
              color: activeView === 'search' ? '#2563eb' : '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.1rem', opacity: activeView === 'search' ? 1 : 0.6 }}>🔍</span> 
            Loan Search
            {activeView === 'search' && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%' }}></span>}
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
            Home / {activeView === 'newApplication' ? 'New Loan Application' : 'Loan Search'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>ยินดีต้อนรับ, Admin</span>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
               <span style={{ margin: 'auto' }}>AD</span>
            </div>
          </div>
        </header>

        <div className="content-body">

          {activeView === 'newApplication' && <NewLoanForm />}
          {activeView === 'search' && <LoanSearch />}
        </div>
      </main>
    </div>
  );
}

export default App;
