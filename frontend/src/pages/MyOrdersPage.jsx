import { useState, useEffect } from 'react';
import orderService from '../api/orderService';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // In a real app, this would call user-specific orders
                // But our userService/orderService can handle the principal check on backend
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching my orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="page-loading">Loading your order history...</div>;

    return (
        <div className="my-orders-page">
            <div className="orders-container">
                <header className="page-header">
                    <h1>My Orders</h1>
                    <p>Track and manage your recent purchases.</p>
                </header>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <span className="icon">📦</span>
                        <h3>No orders found</h3>
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-meta">
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`order-status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </div>
                                </div>
                                <div className="order-details">
                                    <div className="order-items-preview">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="mini-item">
                                                <img src={item.product?.imageUrls?.[0]} alt={item.product?.name} />
                                                <div className="mini-item-info">
                                                    <p>{item.product?.name}</p>
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-summary">
                                        <div className="summary-line">
                                            <span>Total Amount:</span>
                                            <span className="grand-total">${order.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <p className="shipping-to">Shipping to: {order.shippingAddress}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
