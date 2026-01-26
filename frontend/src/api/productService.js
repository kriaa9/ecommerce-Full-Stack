import api from './axios';

const ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
};

export const productService = {
  /**
   * Get all products for the public catalog
   * @returns {Promise<Array>} List of products
   */
  getAllProducts: async () => {
    const response = await api.get(ENDPOINTS.PRODUCTS);
    return response.data;
  },

  /**
   * Get a single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (id) => {
    const response = await api.get(`${ENDPOINTS.PRODUCTS}/${id}`);
    return response.data;
  },

  /**
   * Get all categories for filtering (Uses admin endpoint which is now permitted or public)
   * Note: I may need to check if /api/v1/admin/categories is public. 
   * If not, I should ideally have a public categories endpoint.
   * For now, I will try fetching from the existing one.
   */
  getCategories: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data;
  }
};

export default productService;
