import api from './axios';

/**
 * Order service for managing orders.
 * Provides methods for placing orders, viewing user orders, and admin operations.
 */
const orderService = {
    /**
     * Place a new order
     * @param {Object} orderData - { shippingAddress, paymentMethod, items: [{ productId, quantity }] }
     * @returns {Promise<Object>} Created order
     */
    placeOrder: async (orderData) => {
        const response = await api.post('/api/v1/orders', orderData);
        return response.data;
    },

    /**
     * Get orders for the logged-in user
     * @returns {Promise<Array>} List of orders
     */
    getMyOrders: async () => {
        const response = await api.get('/api/v1/orders/my-orders');
        return response.data;
    },

    /**
     * Get all orders (Admin only)
     * @returns {Promise<Array>} List of all orders
     */
    getAllOrders: async () => {
        const response = await api.get('/api/v1/admin/orders');
        return response.data;
    },

    /**
     * Update the status of an order (Admin only)
     * @param {number} orderId - The order ID
     * @param {string} status - New status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
     * @returns {Promise<Object>} Updated order
     */
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/api/v1/admin/orders/${orderId}/status`, { status });
        return response.data;
    }
};

export default orderService;
