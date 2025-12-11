/**
 * Snapshot API Client - Handles snapshot-related API calls
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const snapshotApi = {
  /**
   * Create a new snapshot
   */
  createSnapshot: async (token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/snapshots`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all snapshots for the user
   */
  getSnapshots: async (token, limit = 50, skip = 0) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/snapshots`, {
        params: { limit, skip },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single snapshot by ID
   */
  getSnapshot: async (token, snapshotId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/snapshots/${snapshotId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a snapshot
   */
  deleteSnapshot: async (token, snapshotId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/snapshots/${snapshotId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default snapshotApi;
