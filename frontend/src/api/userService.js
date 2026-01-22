import api from './axios';

const USER_ENDPOINTS = {
    GET_PROFILE: '/api/v1/users/me',
    UPDATE_PROFILE: '/api/v1/users/me',
    DELETE_ACCOUNT: '/api/v1/users/me',
};

export const userService = {
    /**
     * Get current user profile
     * @returns {Promise} - { UserResponse }
     */
    getProfile: async () => {
        const response = await api.get(USER_ENDPOINTS.GET_PROFILE);
        return response.data;
    },

    /**
     * Update user profile
     * @param {Object} userData - Matching UpdateUserRequest DTO
     * @returns {Promise} - { UserResponse }
     */
    updateProfile: async (userData) => {
        const response = await api.put(USER_ENDPOINTS.UPDATE_PROFILE, userData);
        return response.data;
    },

    /**
     * Delete current user account
     */
    deleteAccount: async () => {
        await api.delete(USER_ENDPOINTS.DELETE_ACCOUNT);
        localStorage.removeItem('token'); // Clean up token
    },
};

export default userService;