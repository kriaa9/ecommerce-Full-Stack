import api from './axios';

/**
 * User notification service.
 * Provides methods for authenticated users to fetch and manage their notifications.
 */
const userNotificationService = {
    /**
     * Get all notifications for the current user.
     * @returns {Promise<Array>} List of notifications
     */
    getNotifications: async () => {
        const response = await api.get('/api/v1/notifications');
        return response.data;
    },

    /**
     * Get count of unread notifications for the current user.
     * @returns {Promise<number>} Unread count
     */
    getUnreadCount: async () => {
        const response = await api.get('/api/v1/notifications/unread-count');
        return response.data;
    },

    /**
     * Mark a notification as read.
     * @param {number} id - Notification ID
     */
    markAsRead: async (id) => {
        await api.patch(`/api/v1/notifications/${id}/read`);
    }
};

export default userNotificationService;
