import api from './axios';

const ENDPOINTS = {
  CATEGORIES: '/api/v1/admin/categories',
  PRODUCTS: '/api/v1/admin/products',
};

export const adminService = {
  // =====================
  // CATEGORY MANAGEMENT
  // =====================

  /**
   * Get all categories
   * @returns {Promise<Array>} List of categories
   */
  getCategories: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data;
  },

  /**
   * Create a new category
   * @param {Object} categoryData - { name, description, ... }
   * @returns {Promise<Object>} Created category
   */
  createCategory: async (categoryData) => {
    const response = await api.post(ENDPOINTS.CATEGORIES, categoryData);
    return response.data;
  },

  /**
   * Update an existing category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`${ENDPOINTS.CATEGORIES}/${id}`, categoryData);
    return response.data;
  },

  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<void>}
   */
  deleteCategory: async (id) => {
    await api.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
  },

  // =====================
  // PRODUCT MANAGEMENT
  // =====================

  /**
   * Get all products (admin view)
   * @returns {Promise<Array>} List of products
   */
  getProducts: async () => {
    const response = await api.get(ENDPOINTS.PRODUCTS);
    return response.data;
  },

  /**
   * Create a new product with image
   * @param {FormData} formData - Multipart form with product data + image
   * @returns {Promise<Object>} Created product
   */
  createProduct: async (formData) => {
    const response = await api.post(ENDPOINTS.PRODUCTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Update product details (JSON only, no image)
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: async (id, productData) => {
    const response = await api.put(`${ENDPOINTS.PRODUCTS}/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<void>}
   */
  deleteProduct: async (id) => {
    await api.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
  },
};

export default adminService;
