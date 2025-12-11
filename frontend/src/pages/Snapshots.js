import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import snapshotApi from '../api/snapshotApi';
import '../styles/Snapshots.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Snapshots = () => {
  const navigate = useNavigate();
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'User';

  const ITEMS_PER_PAGE = 10;

  // Get user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSnapshots();
  }, [token, navigate, page]);

  const fetchSnapshots = async () => {
    setLoading(true);
    setError('');
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const result = await snapshotApi.getSnapshots(token, ITEMS_PER_PAGE, skip);
      setSnapshots(result.snapshots || []);
      setTotalPages(Math.ceil((result.total || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err.message || 'Failed to fetch snapshots');
      setSnapshots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    setLoading(true);
    setError('');
    try {
      await snapshotApi.createSnapshot(token);
      setShowCreateModal(false);
      fetchSnapshots();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create snapshot');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnapshot = async (snapshotId) => {
    if (window.confirm('Are you sure you want to delete this snapshot?')) {
      try {
        await snapshotApi.deleteSnapshot(token, snapshotId);
        fetchSnapshots();
        if (showDetailModal && selectedSnapshot?._id === snapshotId) {
          setShowDetailModal(false);
          setSelectedSnapshot(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to delete snapshot');
      }
    }
  };

  const openDetailModal = (snapshot) => {
    setSelectedSnapshot(snapshot);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedSnapshot(null);
  };

  const formatCurrency = (value) => {
    // Handle null, undefined, or NaN values
    if (value === null || value === undefined || isNaN(value)) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(0);
    }
    
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="snapshots-container">
      <div className="snapshots-header">
        <div className="snapshots-header-left">
          <button 
            className="btn-back-home"
            onClick={() => navigate('/dashboard')}
          >
            ← Dashboard
          </button>
          <h1>Portfolio Snapshots</h1>
        </div>
        <button 
          className="btn-create-snapshot"
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          📸 Create Snapshot
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Creating snapshot...</div>}

      {snapshots.length === 0 && !loading && (
        <div className="empty-state">
          <p>No snapshots yet. Create your first snapshot to track your portfolio.</p>
        </div>
      )}

      {snapshots.length > 0 && (
        <div className="snapshots-table-container">
          <table className="snapshots-table">
            <thead>
              <tr>
                <th>Created Date</th>
                <th>Created By</th>
                <th>Cash</th>
                <th>Savings</th>
                <th>FD</th>
                <th>RD</th>
                <th>PPF</th>
                <th>EPF</th>
                <th>NPS</th>
                <th>MF</th>
                <th>Stocks</th>
                <th>Gold</th>
                <th>Loans</th>
                <th>Emergency Fund</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map(snapshot => (
                <tr 
                  key={snapshot._id}
                  onClick={() => openDetailModal(snapshot)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{formatDate(snapshot.createdAt)}</td>
                  <td>{snapshot.createdBy}</td>
                  <td>{formatCurrency(snapshot.cash)}</td>
                  <td>{formatCurrency(snapshot.savings)}</td>
                  <td>{formatCurrency(snapshot.fd)}</td>
                  <td>{formatCurrency(snapshot.rd)}</td>
                  <td>{formatCurrency(snapshot.ppf)}</td>
                  <td>{formatCurrency(snapshot.epf)}</td>
                  <td>{formatCurrency(snapshot.nps)}</td>
                  <td>{formatCurrency(snapshot.mf)}</td>
                  <td>{formatCurrency(snapshot.stocks)}</td>
                  <td>{formatCurrency(snapshot.gold)}</td>
                  <td>{formatCurrency(snapshot.loans)}</td>
                  <td className="emergency-fund">{formatCurrency(snapshot.emergency_fund)}</td>
                  <td className="total-column">{formatCurrency(snapshot.total)}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(snapshot);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>{page} / {totalPages}</span>
          <button 
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Create Snapshot Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Snapshot</h2>
            <p>A snapshot will be created with the current portfolio data from all your deposits.</p>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleCreateSnapshot}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Snapshot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSnapshot && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Portfolio Snapshot</h2>
              <button className="btn-close" onClick={closeDetailModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="snapshot-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">{formatDate(selectedSnapshot.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created By</span>
                  <span className="detail-value">{selectedSnapshot.createdBy}</span>
                </div>

                <div className="detail-section">
                  <h3>Assets</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Cash</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.cash)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Savings Account</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.savings)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fixed Deposits</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.fd)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Recurring Deposits</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.rd)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">PPF</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.ppf)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">EPF</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.epf)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">NPS</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.nps)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mutual Funds</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.mf)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Stocks</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.stocks)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gold</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.gold)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Loans</span>
                      <span className="detail-value">{formatCurrency(selectedSnapshot.loans)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Emergency Fund</span>
                      <span className="detail-value emergency">{formatCurrency(selectedSnapshot.emergency_fund)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-total">
                  <span className="label">Total Portfolio Value</span>
                  <span className="value">{formatCurrency(selectedSnapshot.total)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-delete"
                onClick={() => {
                  handleDeleteSnapshot(selectedSnapshot._id);
                }}
              >
                🗑️ Delete Snapshot
              </button>
              <button 
                className="btn-close-modal"
                onClick={closeDetailModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Snapshots;
