import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Deposits.css';

const DepositTypeSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shortDeposits, setShortDeposits] = useState([]);
  const [longDeposits, setLongDeposits] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllDeposits();
  }, []);

  const fetchAllDeposits = async () => {
    try {
      setLoading(true);
      // request a large limit to get all deposits for summary
      const url = `${API_BASE_URL}/deposits?page=1&limit=1000`;
      const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      const all = resp.data.deposits || [];
      const short = all.filter(d => (d.deposit_type || '').toLowerCase() === 'short');
      const long = all.filter(d => (d.deposit_type || '').toLowerCase() === 'long');
      // sort by maturity date (earliest first). Put items without maturity_date at the end.
      const parseDate = (s) => {
        try {
          return s ? new Date(s) : null;
        } catch { return null; }
      };
      const sortByMaturity = (a, b) => {
        const da = parseDate(a.maturity_date);
        const db = parseDate(b.maturity_date);
        if (!da && !db) return 0;
        if (!da) return 1; // a after b
        if (!db) return -1; // a before b
        return da - db;
      };
      short.sort(sortByMaturity);
      long.sort(sortByMaturity);
      setShortDeposits(short);
      setLongDeposits(long);
      setError('');
    } catch (err) {
      setError('Failed to load deposits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString();
  };

  const groupByGoal = (items) => {
    return items.reduce((acc, d) => {
      const key = d.deposit_goal || 'Unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
      return acc;
    }, {});
  };

  const [expandedGoals, setExpandedGoals] = useState({});

  const toggleGoal = (sectionKey) => {
    setExpandedGoals(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const renderTable = (items) => (
    <table className="deposits-table">
      <thead>
        <tr>
          <th>Bank</th>
          <th>Account Holder</th>
          <th>Account Number</th>
          <th>Account Type</th>
          <th>Amount Accumulated</th>
          <th>Interest Rate</th>
          <th>Start Date</th>
          <th>Maturity Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map(d => (
          <tr key={d._id}>
            <td>{d.bank}</td>
            <td>{d.account_holder}</td>
            <td>{d.account_number}</td>
            <td>{d.investment_account_type}</td>
            <td>{formatCurrency(d.amount_accumulated)}</td>
            <td>{d.interest_rate}%</td>
            <td>{formatDate(d.start_date)}</td>
            <td>{formatDate(d.maturity_date)}</td>
            <td>{d.account_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="deposits-container">
      <div className="deposits-header">
        <div className="deposits-header-left">
          <button className="btn-back-home" onClick={() => navigate('/deposits')} title="Back to Deposits">← Back to Deposits</button>
          <h2>Deposit Type Summary</h2>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading summary...</div>
      ) : (
        <div>
          <div className="summary-cards">
            <div className="card">
              <div className="card-label">Short Term — Amount Accumulated</div>
              <div className="card-value">{formatCurrency(shortDeposits.reduce((s, i) => s + (Number(i.amount_accumulated) || 0), 0))}</div>
              <div className="card-count">{shortDeposits.length} accounts</div>
            </div>
            <div className="card">
              <div className="card-label">Long Term — Amount Accumulated</div>
              <div className="card-value">{formatCurrency(longDeposits.reduce((s, i) => s + (Number(i.amount_accumulated) || 0), 0))}</div>
              <div className="card-count">{longDeposits.length} accounts</div>
            </div>
          </div>

          <h3>Short Term Deposits</h3>
          {shortDeposits.length === 0 ? (
            <div className="empty-state">No short term deposits found.</div>
          ) : (
            Object.entries(groupByGoal(shortDeposits)).map(([goal, items]) => {
              const total = items.reduce((s, i) => s + (Number(i.amount_accumulated) || 0), 0);
              const sectionKey = `short-${goal}`;
              const isExpanded = expandedGoals[sectionKey] ?? false;
              return (
                <div key={sectionKey} className="deposits-table-wrapper goal-section" style={{ marginBottom: 16 }}>
                  <div className="goal-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <button className="btn-toggle" onClick={(e) => { e.stopPropagation(); toggleGoal(sectionKey); }} style={{ cursor: 'pointer' }}>
                      {isExpanded ? '▼' : '▶'}
                    </button>
                    <div className="card" style={{ display: 'inline-block' }} onClick={() => toggleGoal(sectionKey)}>
                      <div className="card-label">{goal}</div>
                      <div className="card-value">{formatCurrency(total)}</div>
                      <div className="card-count">{items.length} accounts</div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ overflowX: 'auto' }}>
                      {renderTable(items)}
                    </div>
                  )}
                </div>
              );
            })
          )}

          <h3 style={{ marginTop: '24px' }}>Long Term Deposits</h3>
          {longDeposits.length === 0 ? (
            <div className="empty-state">No long term deposits found.</div>
          ) : (
            Object.entries(groupByGoal(longDeposits)).map(([goal, items]) => {
              const total = items.reduce((s, i) => s + (Number(i.amount_accumulated) || 0), 0);
              const sectionKey = `long-${goal}`;
              const isExpanded = expandedGoals[sectionKey] ?? false;
              return (
                <div key={sectionKey} className="deposits-table-wrapper goal-section" style={{ marginBottom: 16 }}>
                  <div className="goal-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <button className="btn-toggle" onClick={(e) => { e.stopPropagation(); toggleGoal(sectionKey); }} style={{ cursor: 'pointer' }}>
                      {isExpanded ? '▼' : '▶'}
                    </button>
                    <div className="card" style={{ display: 'inline-block' }} onClick={() => toggleGoal(sectionKey)}>
                      <div className="card-label">{goal}</div>
                      <div className="card-value">{formatCurrency(total)}</div>
                      <div className="card-count">{items.length} accounts</div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ overflowX: 'auto' }}>
                      {renderTable(items)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DepositTypeSummary;
