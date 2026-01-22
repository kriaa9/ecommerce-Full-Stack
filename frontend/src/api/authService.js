import api from './axios';

const AUTH_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/authenticate',
  LOGOUT: '/api/v1/auth/logout',
};

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { firstname, lastname, email, password }
   * @returns {Promise} - { token }
   */
  register: async (userData) => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { token }
   */
  login: async (credentials) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Logout user (Server + Client)
   * Calls backend to invalidate session, then clears local storage.
   */
  logout: async () => {
    try {
      // 1. Attempt to tell the server we are logging out
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Server logout failed (token might be expired), clearing local session anyway.", error);
    } finally {
      // 2. Always remove token from local storage, even if server request fails
      localStorage.removeItem('token');
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;