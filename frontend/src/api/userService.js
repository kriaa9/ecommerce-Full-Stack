import api from './axios';

const USER_ENDPOINTS = {
    GET_PROFILE: '/api/v1/users/me',
    UPDATE_PROFILE: '/api/v1/users/me',
    DELETE_ACCOUNT: '/api/v1/users/me',
    UPLOAD_PHOTO: '/api/v1/users/me/photo',
    DELETE_PHOTO: '/api/v1/users/me/photo',
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

    /**
     * Upload profile photo
     * @param {FormData} formData - Form data containing the photo
     * @returns {Promise} - { UserResponse }
     */
    uploadProfilePhoto: async (formData) => {
        const response = await api.post(USER_ENDPOINTS.UPLOAD_PHOTO, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Delete profile photo
     * @returns {Promise} - { UserResponse }
     */
    deleteProfilePhoto: async () => {
        const response = await api.delete(USER_ENDPOINTS.DELETE_PHOTO);
        return response.data;
    },
};

export default userService;