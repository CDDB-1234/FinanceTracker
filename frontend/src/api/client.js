// API client configuration for frontend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authorization header with token
   */
  getAuthHeader() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Auth endpoints
   */
  auth = {
    register: (name, email, password) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }),

    login: (email, password) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),

    verify: () =>
      this.request('/auth/verify', {
        method: 'GET'
      })
  };
}

export default new APIClient();
