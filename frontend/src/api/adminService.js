import api from './axios';

const ADMIN_ENDPOINTS = {
  STATS: '/api/v1/admin/stats',
};

export const adminService = {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} { totalProducts, totalCategories, totalInventoryValue, totalOrders }
   */
  getStats: async () => {
    const response = await api.get(ADMIN_ENDPOINTS.STATS);
    return response.data;
  }
};

export default adminService;
