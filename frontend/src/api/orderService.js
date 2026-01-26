import api from './axios';

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
    }
};

export default orderService;
