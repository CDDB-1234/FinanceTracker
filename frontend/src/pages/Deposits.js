import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Deposits.css';

const Deposits = () => {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    investment_account_type: '',
    bank: '',
    deposit_on_maturity: '',
    account_number: '',
    deposit_amount: '',
    amount_accumulated: '',
    start_date: '',
    maturity_date: '',
    interest_rate: '',
    interest_amount: '',
    maturity_amount: '',
    account_holder: '',
    account_status: 'Active',
    comments: '',
    plan_on_maturity: '',
    deposit_type: ''
  });

  const [filters, setFilters] = useState({
    investment_account_type: '',
    bank: '',
    account_status: '',
    account_holder: '',
    start_date: '',
    maturity_date: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    banks: [],
    accountTypes: [],
    accountStatuses: ['Active', 'Matured', 'Closed'],
    accountHolders: []
  });

  useEffect(() => {
    fetchDeposits();
    fetchSummary();
    fetchFilterOptions();
  }, [page, filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deposits/filter/options`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setFilterOptions({
          banks: response.data.banks || [],
          accountTypes: response.data.account_types || [],
          accountStatuses: ['Active', 'Matured', 'Closed'],
          accountHolders: response.data.account_holders || []
        });
      }
    } catch (err) {
      // Use default options if endpoint doesn't exist yet
      console.log('Filter options endpoint not available yet');
    }
  };

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/deposits?page=${page}&limit=10`;
      
      // Add filter parameters
      if (filters.investment_account_type) {
        url += `&investment_account_type=${encodeURIComponent(filters.investment_account_type)}`;
      }
      if (filters.bank) {
        url += `&bank=${encodeURIComponent(filters.bank)}`;
      }
      if (filters.account_status) {
        url += `&account_status=${encodeURIComponent(filters.account_status)}`;
      }
      if (filters.account_holder) {
        url += `&account_holder=${encodeURIComponent(filters.account_holder)}`;
      }
      if (filters.start_date) {
        url += `&start_date=${encodeURIComponent(filters.start_date)}`;
      }
      if (filters.maturity_date) {
        url += `&maturity_date=${encodeURIComponent(filters.maturity_date)}`;
      }

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDeposits(response.data.deposits || []);
      setTotalPages(response.data.pages || 1);
      setError('');
      setPage(1);

    } catch (err) {
      setError('Failed to fetch deposits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deposits/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to page 1 when filtering
  };

  const clearFilters = () => {
    setFilters({
      investment_account_type: '',
      bank: '',
      account_status: '',
      account_holder: '',
      start_date: '',
      maturity_date: ''
    });
    setPage(1);
  };

  const isFilterActive = () => {
    return Object.values(filters).some(val => val !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update
        await axios.put(`${API_BASE_URL}/deposits/${editingId}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        // Create
        await axios.post(`${API_BASE_URL}/deposits`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      fetchDeposits();
      fetchSummary();
      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save deposit');
    }
  };

  const handleEdit = (deposit) => {
    setFormData(deposit);
    setEditingId(deposit._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const openDetailModal = (deposit) => {
    setSelectedDeposit(deposit);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedDeposit(null);
    setShowDetailModal(false);
  };

  const handleCopyDeposit = (deposit) => {
    // Create a copy with cleared ID and audit fields
    const copiedData = {
      ...deposit,
      account_number: '', // Clear account number as it should be unique or updated
      _id: undefined,
      createdBy: undefined,
      updatedBy: undefined,
      created_at: undefined,
      updated_at: undefined,
    };
    
    // Set form data with copied information
    setFormData(copiedData);
    setEditingId(null); // Clear edit mode - this will create new deposit
    setShowForm(true);
    closeDetailModal();
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deposit?')) {
      try {
        await axios.delete(`${API_BASE_URL}/deposits/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchDeposits();
        fetchSummary();
        setError('');
      } catch (err) {
        setError('Failed to delete deposit');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      investment_account_type: '',
      bank: '',
      deposit_on_maturity: '',
      account_number: '',
      deposit_amount: '',
      amount_accumulated: '',
      start_date: '',
      maturity_date: '',
      interest_rate: '',
      interest_amount: '',
      maturity_amount: '',
      account_holder: '',
      account_status: 'Active',
      comments: '',
      plan_on_maturity: '',
      deposit_type: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const isMaturityThisMonth = (maturityDate) => {
    if (!maturityDate) return false;
    
    try {
      const maturity = new Date(maturityDate);
      const now = new Date();
      
      // Compare month and year only (ignore day)
      return maturity.getMonth() === now.getMonth() && 
             maturity.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="deposits-container">
      <div className="deposits-header">
        <div className="deposits-header-left">
          <button 
            className="btn-back-home"
            onClick={() => navigate('/dashboard')}
            title="Back to Dashboard"
          >
            ← Back to Dashboard
          </button>
          <h2>💰 Deposits Management</h2>
        </div>
        <button 
          className="btn-add-deposit"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Deposit'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          <div className="card">
            <div className="card-label">Total Deposits</div>
            <div className="card-value">{formatCurrency(summary.total_deposits)}</div>
            <div className="card-count">{summary.count} accounts</div>
          </div>
          <div className="card">
            <div className="card-label">Amount Accumulated</div>
            <div className="card-value">{formatCurrency(summary.total_accumulated)}</div>
          </div>
          <div className="card">
            <div className="card-label">Total Interest Earned</div>
            <div className="card-value">{formatCurrency(summary.total_interest)}</div>
          </div>
          <div className="card">
            <div className="card-label">Maturity Amount</div>
            <div className="card-value">{formatCurrency(summary.total_maturity_amount)}</div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="filter-section">
        <button 
          className="btn-filter-toggle"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? '▼ Hide Filters' : '▶ Show Filters'}
          {isFilterActive() && <span className="filter-active-badge">●</span>}
        </button>

        {showFilter && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Investment Account Type</label>
                <select
                  name="investment_account_type"
                  value={filters.investment_account_type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="Savings Account">Savings Account</option>
                  <option value="Current Account">Current Account</option>
                  <option value="Money Market">Money Market</option>
                  <option value="Certificate of Deposit">Certificate of Deposit</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Bank</label>
                <select
                  name="bank"
                  value={filters.bank}
                  onChange={handleFilterChange}
                >
                  <option value="">All Banks</option>
                  {filterOptions.banks.length > 0 ? (
                    filterOptions.banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))
                  ) : (
                    <>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="SBI">SBI</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra</option>
                    </>
                  )}
                </select>
              </div>

              <div className="filter-group">
                <label>Account Status</label>
                <select
                  name="account_status"
                  value={filters.account_status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Matured">Matured</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Account Holder</label>
                <select
                  name="account_holder"
                  value={filters.account_holder}
                  onChange={handleFilterChange}
                >
                  <option value="">All Holders</option>
                  {filterOptions.accountHolders.length > 0 ? (
                    filterOptions.accountHolders.map(holder => (
                      <option key={holder} value={holder}>{holder}</option>
                    ))
                  ) : (
                    <>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                    </>
                  )}
                </select>
              </div>

              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label>Maturity Date</label>
                <input
                  type="date"
                  name="maturity_date"
                  value={filters.maturity_date}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button 
                className="btn-clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="deposit-form-container">
          <h3>{editingId ? 'Edit Deposit' : 'Add New Deposit'}</h3>
          <form onSubmit={handleSubmit} className="deposit-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Investment Account Type</label>
                <select
                  type="text"
                  name="investment_account_type"
                  value={formData.investment_account_type}
                  onChange={handleInputChange}
				required
                >
				<option value="">Select Type</option>
                  <option value="FD">Fixed Deposit</option>
                  <option value="RD">Recurring Deposit</option>
                  <option value="SA">Savings Account</option>
				  <option value="PPF">PPF</option>
				  <option value="NPS">NPS</option>
				  <option value="EPF">EPF</option>
				  <option value="KVP">Kisan Vikas Patra</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <select
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
        
                  required
				  >
				  <option value="">Select Bank</option>
                  <option value="HDFC">HDFC</option>
                  <option value="AXIS">AXIS</option>
                  <option value="KOTAK">KOTAK</option>
				  <option value="SBI">SBI</option>
				  <option value="UBI">UBI</option>
				  <option value="PO">PostOffice</option>
                </select>
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Holder</label>
                <input
                  type="text"
                  name="account_holder"
                  value={formData.account_holder}
                  onChange={handleInputChange}
                  placeholder="Account Holder Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deposit Type</label>
                <select
                  name="deposit_type"
                  value={formData.deposit_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="long">Long Term</option>
                  <option value="short">Short Term</option>
                </select>
              </div>

              <div className="form-group">
                <label>Deposit Amount (₹)</label>
                <input
                  type="number"
                  name="deposit_amount"
                  value={formData.deposit_amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  name="interest_rate"
                  value={formData.interest_rate}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Maturity Date</label>
                <input
                  type="date"
                  name="maturity_date"
                  value={formData.maturity_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Interest Amount (₹)</label>
                <input
                  type="number"
                  name="interest_amount"
                  value={formData.interest_amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Maturity Amount (₹)</label>
                <input
                  type="number"
                  name="maturity_amount"
                  value={formData.maturity_amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Amount Accumulated (₹)</label>
                <input
                  type="number"
                  name="amount_accumulated"
                  value={formData.amount_accumulated}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Account Status</label>
                <select
                  name="account_status"
                  value={formData.account_status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Matured">Matured</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Plan on Maturity</label>
                <select
                  name="plan_on_maturity"
                  value={formData.plan_on_maturity}
                  onChange={handleInputChange}
                >
                  <option value="">Select Option</option>
                  <option value="Reinvest">Reinvest</option>
                  <option value="Withdraw">Withdraw</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Deposit on Maturity</label>
                <select
                  name="deposit_on_maturity"
                  value={formData.deposit_on_maturity}
                  onChange={handleInputChange}
                >
                  <option value="">Select Option</option>
                  <option value="Principal">Principal</option>
                  <option value="Interest">Interest</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Additional comments..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update Deposit' : 'Add Deposit'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deposits Table */}
      {loading ? (
        <div className="loading">Loading deposits...</div>
      ) : deposits.length === 0 ? (
        <div className="empty-state">
          <p>No deposits found. Add one to get started!</p>
        </div>
      ) : (
        <div className="deposits-table-wrapper">
          <table className="deposits-table">
            <thead>
              <tr>
                <th>Bank</th>
                <th>Account Holder</th>
                <th>Deposit Amount</th>
                <th>Interest Rate</th>
                <th>Start Date</th>
                <th>Maturity Date</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Updated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map(deposit => (
                <tr 
                  key={deposit._id} 
                  className={`status-${deposit.account_status} deposit-row ${deposit.maturity_date && isMaturityThisMonth(deposit.maturity_date) ? 'maturity-highlight' : ''}`}
                  onClick={() => openDetailModal(deposit)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{deposit.bank}</td>
                  <td>{deposit.account_holder}</td>
                  <td>{formatCurrency(deposit.deposit_amount)}</td>
                  <td>{deposit.interest_rate}%</td>
                  <td>{formatDate(deposit.start_date)}</td>
                  <td>{formatDate(deposit.maturity_date)}</td>
                  <td>
                    <span className={`status-badge status-${deposit.account_status}`}>
                      {deposit.account_status}
                    </span>
                  </td>
                  <td>{deposit.createdBy || 'System'}</td>
                  <td>{deposit.updatedBy || 'System'}</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(deposit)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(deposit._id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedDeposit && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Deposit Details - {selectedDeposit.account_holder}</h3>
              <button className="modal-close" onClick={closeDetailModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-grid">
                {/* Row 1 */}
                <div className="detail-field">
                  <label>Investment Account Type</label>
                  <div className="detail-value">{selectedDeposit.investment_account_type || 'N/A'}</div>
                </div>
                <div className="detail-field">
                  <label>Bank</label>
                  <div className="detail-value">{selectedDeposit.bank || 'N/A'}</div>
                </div>
                <div className="detail-field">
                  <label>Account Number</label>
                  <div className="detail-value">{selectedDeposit.account_number || 'N/A'}</div>
                </div>

                {/* Row 2 */}
                <div className="detail-field">
                  <label>Account Holder</label>
                  <div className="detail-value">{selectedDeposit.account_holder || 'N/A'}</div>
                </div>
                <div className="detail-field">
                  <label>Deposit Type</label>
                  <div className="detail-value">{selectedDeposit.deposit_type || 'N/A'}</div>
                </div>
                <div className="detail-field">
                  <label>Account Status</label>
                  <div className="detail-value">
                    <span className={`status-badge status-${selectedDeposit.account_status}`}>
                      {selectedDeposit.account_status}
                    </span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="detail-field">
                  <label>Deposit Amount (₹)</label>
                  <div className="detail-value">{formatCurrency(selectedDeposit.deposit_amount)}</div>
                </div>
                <div className="detail-field">
                  <label>Interest Rate (%)</label>
                  <div className="detail-value">{selectedDeposit.interest_rate}%</div>
                </div>
                <div className="detail-field">
                  <label>Interest Amount (₹)</label>
                  <div className="detail-value">{formatCurrency(selectedDeposit.interest_amount)}</div>
                </div>

                {/* Row 4 */}
                <div className="detail-field">
                  <label>Maturity Amount (₹)</label>
                  <div className="detail-value">{formatCurrency(selectedDeposit.maturity_amount)}</div>
                </div>
                <div className="detail-field">
                  <label>Amount Accumulated (₹)</label>
                  <div className="detail-value">{formatCurrency(selectedDeposit.amount_accumulated)}</div>
                </div>
                <div className="detail-field">
                  <label>Start Date</label>
                  <div className="detail-value">{formatDate(selectedDeposit.start_date)}</div>
                </div>

                {/* Row 5 */}
                <div className="detail-field">
                  <label>Maturity Date</label>
                  <div className="detail-value">{formatDate(selectedDeposit.maturity_date)}</div>
                </div>
                <div className="detail-field">
                  <label>Plan on Maturity</label>
                  <div className="detail-value">{selectedDeposit.plan_on_maturity || 'N/A'}</div>
                </div>
                <div className="detail-field">
                  <label>Deposit on Maturity</label>
                  <div className="detail-value">{selectedDeposit.deposit_on_maturity || 'N/A'}</div>
                </div>

                {/* Row 6 */}
                <div className="detail-field">
                  <label>Created By</label>
                  <div className="detail-value">{selectedDeposit.createdBy || 'System'}</div>
                </div>
                <div className="detail-field">
                  <label>Updated By</label>
                  <div className="detail-value">{selectedDeposit.updatedBy || 'System'}</div>
                </div>
                <div className="detail-field">
                  <label>Last Modified</label>
                  <div className="detail-value">{formatDate(selectedDeposit.updated_at) || formatDate(selectedDeposit.created_at) || 'N/A'}</div>
                </div>

                {/* Row 7 - Full width Comments */}
                <div className="detail-field full-width">
                  <label>Comments</label>
                  <div className="detail-value comments">{selectedDeposit.comments || 'No comments'}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-copy" onClick={() => { handleCopyDeposit(selectedDeposit); }}>
                📋 Copy & Create New
              </button>
              <button className="btn-modal-edit" onClick={() => { handleEdit(selectedDeposit); closeDetailModal(); }}>
                ✎ Edit Deposit
              </button>
              <button className="btn-modal-close" onClick={closeDetailModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;
