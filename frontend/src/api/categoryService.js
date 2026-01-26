import api from './axios';

const CATEGORY_ENDPOINTS = {
    ADMIN: '/api/v1/admin/categories',
    PUBLIC: '/api/categories'
};

const categoryService = {
    /**
     * Get all categories (Public)
     */
    getCategories: async () => {
        const response = await api.get(CATEGORY_ENDPOINTS.PUBLIC);
        return response.data;
    },

    /**
     * Create a new category (Admin)
     */
    createCategory: async (categoryData) => {
        const response = await api.post(CATEGORY_ENDPOINTS.ADMIN, categoryData);
        return response.data;
    },

    /**
     * Update an existing category (Admin)
     */
    updateCategory: async (id, categoryData) => {
        const response = await api.put(`${CATEGORY_ENDPOINTS.ADMIN}/${id}`, categoryData);
        return response.data;
    },

    /**
     * Delete a category (Admin)
     */
    deleteCategory: async (id) => {
        await api.delete(`${CATEGORY_ENDPOINTS.ADMIN}/${id}`);
    }
};

export default categoryService;
