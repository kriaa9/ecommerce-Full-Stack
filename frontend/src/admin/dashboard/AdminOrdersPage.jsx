import { useState, useEffect } from 'react';
import orderService from '../../api/orderService';
import './AdminOrders.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        
        // Handle array format [YYYY, M, D, H, m, s]
        if (Array.isArray(dateValue)) {
            const [year, month, day, hour = 0, minute = 0] = dateValue;
            return new Date(year, month - 1, day, hour, minute).toLocaleString();
        }
        
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            console.log('Admin Orders - Received Data:', data);
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="admin-loading">Loading orders...</div>;

    return (
        <div className="admin-orders">
            <div className="admin-page-header">
                <h1>Customer Orders</h1>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <button className="btn-secondary" onClick={fetchOrders}>Refresh List</button>
                    <div className="admin-stats-badge">Total: {orders.length} orders</div>
                </div>
            </div>

            <div className="orders-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Contact Info</th>
                            <th>Shipping Address</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-table">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        <div className="customer-cell">
                                            <div className="customer-avatar">
                                                {order.user.profilePhotoUrl ? (
                                                    <img src={order.user.profilePhotoUrl} alt="Customer" />
                                                ) : (
                                                    <div className="placeholder">{order.user.firstName.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div className="customer-name">
                                                {order.user.firstName} {order.user.lastName}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <span className="info-item">📞 {order.user.mobile || order.user.telephone || 'N/A'}</span>
                                            <span className="info-item">📧 {order.user.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="address-cell" title={order.shippingAddress}>
                                            {order.shippingAddress}
                                        </div>
                                    </td>
                                    <td className="total-cell">${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
