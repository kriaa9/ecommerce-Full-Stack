import { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import orderService from '../../api/orderService';
import { Link } from 'react-router-dom';

/**
 * AdminDashboard - Main dashboard home page
 * Shows overview stats and quick actions
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalInventoryValue: 0,
        totalOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, ordersData] = await Promise.all([
                    adminService.getStats(),
                    orderService.getAllOrders()
                ]);
                setStats(statsData);
                setRecentOrders(ordersData.slice(0, 5)); // Show only latest 5
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="admin-loading">Loading dashboard insights...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1>Dashboard Overview</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <div className="stat-value">{stats.totalProducts}</div>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>Items in inventory</p>
                </div>
                <div className="stat-card">
                    <h3>Categories</h3>
                    <div className="stat-value">{stats.totalCategories}</div>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>Product groupings</p>
                </div>
                <div className="stat-card">
                    <h3>Inventory Value</h3>
                    <div className="stat-value">${stats.totalInventoryValue?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>Comb. value of all stock</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Orders</h3>
                    <div className="stat-value">{stats.totalOrders}</div>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>Awaiting processing</p>
                </div>
            </div>

            <div className="admin-card" style={{marginTop: '2rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                    <h2>Recent Orders</h2>
                    <Link to="/admin/orders" className="btn-text" style={{fontSize: '0.9rem', color: '#2563eb', fontWeight: '600'}}>View All</Link>
                </div>
                <div className="admin-table-container">
                    <div className="orders-summary-table">
                        {recentOrders.length === 0 ? (
                            <p style={{color: '#94a3b8', textAlign: 'center', padding: '1rem'}}>No orders yet.</p>
                        ) : (
                            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'}}>
                                <thead>
                                    <tr style={{textAlign: 'left', borderBottom: '1px solid #f1f5f9', color: '#64748b'}}>
                                        <th style={{padding: '0.75rem 0'}}>ID</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id} style={{borderBottom: '1px solid #f8fafc'}}>
                                            <td style={{padding: '0.75rem 0', fontWeight: '600'}}>#{order.id}</td>
                                            <td>{order.user.firstName} {order.user.lastName}</td>
                                            <td>${order.totalAmount.toFixed(2)}</td>
                                            <td>
                                                <span style={{fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: '#fef3c7', color: '#92400e'}}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{marginTop: '2rem'}}>
                <h2>Welcome back to the Admin Panel</h2>
                <p style={{color: '#64748b', marginTop: '0.75rem', lineHeight: '1.6'}}>
                    Your store metrics are up to date. You can manage your product catalog, categories, and view detailed inventory value from this dashboard.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
