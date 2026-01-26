import api from './axios';

const notificationService = {
    /**
     * Get all notifications (Admin only)
     * @returns {Promise<Array>} List of notifications
     */
    getNotifications: async () => {
        const response = await api.get('/api/v1/admin/notifications');
        return response.data;
    },

    /**
     * Get unread notification count
     * @returns {Promise<number>}
     */
    getUnreadCount: async () => {
        const response = await api.get('/api/v1/admin/notifications/unread-count');
        return response.data;
    },

    /**
     * Mark notification as read
     * @param {number} id - Notification ID
     */
    markAsRead: async (id) => {
        await api.patch(`/api/v1/admin/notifications/${id}/read`);
    }
};

export default notificationService;
