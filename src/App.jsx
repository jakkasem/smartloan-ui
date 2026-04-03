import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import LoanSearch from './components/LoanSearch';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('application');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏦</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-app-name">LOAN APP</span>
            <span className="sidebar-app-subtitle">Approval System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>
          <button
            className={`nav-btn ${activeView === 'application' ? 'active' : ''}`}
            onClick={() => setActiveView('application')}
          >
            <span className="nav-btn-icon">📝</span>
            Loan Application
            {activeView === 'application' && <span className="nav-active-dot" />}
          </button>
          <button
            className={`nav-btn ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
          >
            <span className="nav-btn-icon">🔍</span>
            Loan Search
            {activeView === 'search' && <span className="nav-active-dot" />}
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <div className="breadcrumb">
            Home / {activeView === 'application' ? 'Loan Application' : 'Loan Search'}
          </div>
          <div className="header-user">
            <span className="header-welcome">ยินดีต้อนรับ, Admin</span>
            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="content-body">
          {activeView === 'application' ? <LoanForm /> : <LoanSearch />}
        </div>
      </main>
    </div>
  );
}

export default App;
