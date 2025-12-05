import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h2>Finance Tracker</h2>
        </div>
        <div className="nav-right">
          <span className="user-name">Welcome, {user?.name}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${isActive('/deposits') ? 'active' : ''}`}
              onClick={() => navigate('/deposits')}
            >
              💰 Deposits
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {location.pathname === '/dashboard' && (
            <div>
              <h1>Dashboard</h1>
              <p>Welcome to your financial dashboard. Use the sidebar to manage your finances.</p>
              <div className="quick-links">
                <div className="quick-link" onClick={() => navigate('/deposits')}>
                  <span className="icon">💰</span>
                  <span className="text">Manage Deposits</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
