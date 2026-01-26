import {NavLink} from 'react-router-dom';
import {useState, useEffect} from 'react';
import notificationService from '../api/notificationService';
import './Sidebar.css';

/**
 * Admin Sidebar Navigation
 * Uses NavLink for active state styling
 */
const Sidebar = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const data = await notificationService.getUnreadCount();
                setUnreadCount(data);
            } catch (err) {
                console.error('Error fetching unread count:', err);
            }
        };
        fetchUnread();
        // Check every minute
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, []);

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
                    to="/admin/orders"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">🛒</span>
                    Orders
                </NavLink>

                <NavLink
                    to="/admin/notifications"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">🔔</span>
                    Notifications
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
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
