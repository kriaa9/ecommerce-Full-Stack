import {NavLink} from 'react-router-dom';
import './Sidebar.css';

/**
 * Admin Sidebar Navigation
 * Uses NavLink for active state styling
 */
const Sidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Admin Panel</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/admin/dashboard"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📊</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📁</span>
                    Categories
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📦</span>
                    Products
                </NavLink>

                <div className="sidebar-divider"></div>

                <NavLink
                    to="/"
                    className="sidebar-link"
                >
                    <span className="sidebar-icon">🏠</span>
                    Back to Store
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
