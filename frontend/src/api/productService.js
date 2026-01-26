import api from './axios';

const ENDPOINTS = {
  PUBLIC: '/api/products',
  ADMIN: '/api/v1/admin/products',
  CATEGORIES: '/api/categories', // Public endpoint for categories
};

export const productService = {
  /**
   * Get all products for the public catalog
   */
  getAllProducts: async () => {
    const response = await api.get(ENDPOINTS.PUBLIC);
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id) => {
    const response = await api.get(`${ENDPOINTS.PUBLIC}/${id}`);
    return response.data;
  },

  /**
   * Get all products for admin dashboard
   */
  getAdminProducts: async () => {
    const response = await api.get(ENDPOINTS.ADMIN);
    return response.data;
  },

  /**
   * Create a new product (Admin)
   */
  createProduct: async (formData) => {
    const response = await api.post(ENDPOINTS.ADMIN, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Update an existing product (Admin)
   */
  updateProduct: async (id, productData) => {
    const isFormData = productData instanceof FormData;
    const response = await api.put(`${ENDPOINTS.ADMIN}/${id}`, productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /**
   * Delete a product (Admin)
   */
  deleteProduct: async (id) => {
    await api.delete(`${ENDPOINTS.ADMIN}/${id}`);
  },

  /**
   * Get all categories for filtering (Public)
   */
  getCategories: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data;
  }
};

export default productService;
