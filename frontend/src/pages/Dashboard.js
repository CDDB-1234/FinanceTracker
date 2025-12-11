import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { exportToExcel } from '../utils/exportService';
import '../styles/Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [depositSummary, setDepositSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  // Fetch deposit summary grouped by holder
  useEffect(() => {
    const fetchDepositSummary = async () => {
      if (!token || location.pathname !== '/dashboard') return;
      
      setSummaryLoading(true);
      setSummaryError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/deposits/summary/by-holder`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          setDepositSummary(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch deposit summary:', error);
        setSummaryError('Failed to load deposit summary');
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchDepositSummary();
  }, [token, location.pathname]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleDownloadExcel = async () => {
    setExporting(true);
    setExportMessage('');
    try {
      // Fetch all deposits
      const depositsResponse = await axios.get(`${API_BASE_URL}/deposits?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const deposits = depositsResponse.data.deposits || [];

      // Fetch all snapshots
      const snapshotsResponse = await axios.get(`${API_BASE_URL}/snapshots?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const snapshots = snapshotsResponse.data.snapshots || [];

      // Export to Excel
      const result = await exportToExcel(deposits, snapshots, user?.name || 'User');
      
      if (result.success) {
        setExportMessage(`✅ ${result.message}`);
        setTimeout(() => setExportMessage(''), 3000);
      } else {
        setExportMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      setExportMessage(`❌ Failed to download file: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

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
          <button 
            className="btn-download"
            onClick={handleDownloadExcel}
            disabled={exporting}
            title="Download deposits and snapshots as Excel file"
          >
            {exporting ? '⏳ Exporting...' : '📥 Download Excel'}
          </button>
          <span className="user-name">Welcome, {user?.name}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {exportMessage && (
        <div className={`export-message ${exportMessage.includes('✅') ? 'success' : 'error'}`}>
          {exportMessage}
        </div>
      )}

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
            <button 
              className={`nav-item ${isActive('/snapshots') ? 'active' : ''}`}
              onClick={() => navigate('/snapshots')}
            >
              📸 Snapshots
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {location.pathname === '/dashboard' && (
            <div>
              <h1>Dashboard</h1>
              <p>Welcome to your financial dashboard. Use the sidebar to manage your finances.</p>
              
              {/* Deposit Summary by Account Holder */}
              {summaryLoading && <div className="loading">Loading deposit summary...</div>}
              {summaryError && <div className="alert alert-error">{summaryError}</div>}
              
              {depositSummary && depositSummary.summary_by_holder && (
                <div className="deposit-summary-section">
                  <h2>📊 Deposit Summary by Account Holder</h2>
                  
                  {/* Overall Summary Cards */}
                  {depositSummary.overall_summary && (
                    <div className="summary-cards">
                      <div className="summary-card">
                        <div className="card-label">Total Amount Invested</div>
                        <div className="card-value">{formatCurrency(depositSummary.overall_summary.total_deposits)}</div>
                      </div>
                      <div className="summary-card">
                        <div className="card-label">Amount Accumulated</div>
                        <div className="card-value">{formatCurrency(depositSummary.overall_summary.total_accumulated)}</div>
                      </div>
                      <div className="summary-card">
                        <div className="card-label">Total Interest Earned</div>
                        <div className="card-value">{formatCurrency(depositSummary.overall_summary.total_interest)}</div>
                      </div>
                      <div className="summary-card">
                        <div className="card-label">Account Holders</div>
                        <div className="card-value">{depositSummary.overall_summary.total_holders}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Grouped by Account Holder - Horizontal Table View */}
                  <div className="summary-card">
                    <h3 className="table-section-title">📋 Holder-wise Breakdown</h3>
                    <div className="holders-table-wrapper">
                      <table className="holders-horizontal-table">
                        <thead>
                          <tr>
                            <th className="card-label">Account Holder</th>
                            <th className="card-label">Deposits</th>
                            <th className="card-label">Total Invested</th>
                            <th className="card-label">Amount Accumulated</th>
                            <th className="card-label">Interest Earned</th>
                            <th className="card-label">Maturity Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {depositSummary.summary_by_holder.map((holder, index) => (
                            <tr key={index} className="holder-row">
                              <td className="holder-name">
                                <span className="holder-badge">{holder.account_holder}</span>
                              </td>
                              <td className="card-value">
                                <span className="badge-count">{holder.count}</span>
                              </td>
                              <td className="card-value">{formatCurrency(holder.total_deposits)}</td>
                              <td className="card-value">{formatCurrency(holder.total_accumulated)}</td>
                              <td className="card-value">{formatCurrency(holder.total_interest)}</td>
                              <td className="card-value">{formatCurrency(holder.total_maturity_amount)}</td>
                              
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
                         
              <div className="quick-links">
                <div className="quick-link" onClick={() => navigate('/deposits')}>
                  <span className="icon">💰</span>
                  <span className="text">Manage Deposits</span>
                </div>
                <div className="quick-link" onClick={() => navigate('/snapshots')}>
                  <span className="icon">📸</span>
                  <span className="text">View Snapshots</span>
                </div>
                <div className="quick-link" onClick={handleDownloadExcel}>
                  <span className="icon">📥</span>
                  <span className="text">{exporting ? 'Exporting...' : 'Download Excel'}</span>
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
