import { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await adminService.getStats();
                setStats(data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
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
                <h2>Welcome back to the Admin Panel</h2>
                <p style={{color: '#64748b', marginTop: '0.75rem', lineHeight: '1.6'}}>
                    Your store metrics are up to date. You can manage your product catalog, categories, and view detailed inventory value from this dashboard.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
