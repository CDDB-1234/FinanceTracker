import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/DepositSummaryByBank.css';

const DepositSummaryByBank = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/deposits/summary/by-bank-holder`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSummary(response.data);
        setError('');
      } else {
        setError('Failed to load summary');
      }
    } catch (err) {
      setError('Failed to fetch summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '₹ 0.00';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return <div className="deposit-summary-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="deposit-summary-container"><p className="error">{error}</p></div>;
  }

  return (
    <div className="deposit-summary-container">
      <header className="summary-header">
        <h1>📊 Deposit Summary by Bank & Holder</h1>
        <button className="btn-back" onClick={() => navigate('/deposits')}>
          ← Back to Deposits
        </button>
      </header>

      {summary && summary.summary && Object.keys(summary.summary).length > 0 ? (
        <div className="summary-content">
          {/* Summary Table */}
          <div className="table-wrapper">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Recurring Deposit</th>
                  <th>Fixed Deposits</th>
                  <th>PPF</th>
                  <th>Savings</th>
                  <th>Holder</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.summary).map(([bank, holders]) => {
                  const bankRows = Object.entries(holders).map(([holder, data], holderIndex) => (
                    <tr key={`${bank}-${holder}-${holderIndex}`}>
                      {holderIndex === 0 && (
                        <td rowSpan={Object.keys(holders).length} className="bank-name">
                          {bank}
                        </td>
                      )}
                      <td className="amount">{formatCurrency(data['Recurring Deposit'])}</td>
                      <td className="amount">{formatCurrency(data['Fixed Deposits'])}</td>
                      <td className="amount">{formatCurrency(data['PPF'])}</td>
                      <td className="amount">{formatCurrency(data['Savings'])}</td>
                      <td className="holder-name">{holder}</td>
                      <td className="total-amount">{formatCurrency(data['total_amount'])}</td>
                    </tr>
                  ));

                  // Calculate bank total
                  const bankTotal = Object.values(holders).reduce((sum, data) => sum + data['total_amount'], 0);
                  const bankRecurring = Object.values(holders).reduce((sum, data) => sum + data['Recurring Deposit'], 0);
                  const bankFixed = Object.values(holders).reduce((sum, data) => sum + data['Fixed Deposits'], 0);
                  const bankPPF = Object.values(holders).reduce((sum, data) => sum + data['PPF'], 0);
                  const bankSavings = Object.values(holders).reduce((sum, data) => sum + data['Savings'], 0);

                  bankRows.push(
                    <tr key={`${bank}-total`} className="bank-subtotal">
                      <td className="subtotal-label">Subtotal ({bank})</td>
                      <td className="amount">{formatCurrency(bankRecurring)}</td>
                      <td className="amount">{formatCurrency(bankFixed)}</td>
                      <td className="amount">{formatCurrency(bankPPF)}</td>
                      <td className="amount">{formatCurrency(bankSavings)}</td>
                      <td colSpan="1"></td>
                      <td className="total-amount">{formatCurrency(bankTotal)}</td>
                    </tr>
                  );

                  return bankRows;
                })}
              </tbody>
              <tfoot>
                <tr className="grand-total-row">
                  <td colSpan="6" className="grand-total-label">Grand Total</td>
                  <td className="grand-total-amount">{formatCurrency(summary.grand_total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Investment</h3>
              <p className="amount-large">{formatCurrency(summary.grand_total)}</p>
            </div>
            <div className="summary-card">
              <h3>Banks</h3>
              <p className="amount-large">{Object.keys(summary.summary).length}</p>
            </div>
            <div className="summary-card">
              <h3>Account Holders</h3>
              <p className="amount-large">
                {Object.values(summary.summary).reduce((sum, holders) => sum + Object.keys(holders).length, 0)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-data">No deposits found</p>
      )}
    </div>
  );
};

export default DepositSummaryByBank;
