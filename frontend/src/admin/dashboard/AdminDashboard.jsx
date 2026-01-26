/**
 * AdminDashboard - Main dashboard home page
 * Shows overview stats and quick actions
 */
const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <div className="stat-value">--</div>
                </div>
                <div className="stat-card">
                    <h3>Categories</h3>
                    <div className="stat-value">--</div>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <div className="stat-value">--</div>
                </div>
                <div className="stat-card">
                    <h3>Revenue</h3>
                    <div className="stat-value">--</div>
                </div>
            </div>

            <div className="admin-card">
                <h2>Welcome to the Admin Dashboard</h2>
                <p style={{color: '#64748b', marginTop: '0.5rem'}}>
                    Use the sidebar to manage categories and products.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
