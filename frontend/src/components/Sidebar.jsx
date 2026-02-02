import {NavLink} from 'react-router-dom';
import {useState, useEffect} from 'react';
import notificationService from '../api/notificationService';
import logger from '../utils/logger';
import './Sidebar.css';

/**
 * Admin Sidebar Navigation
 * Uses NavLink for active state styling
 */
const Sidebar = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const data = await notificationService.getUnreadCount();
                setUnreadCount(data);
            } catch (err) {
                logger.error('Error fetching unread count:', err);
            }
        };
        fetchUnread();
        // Check every minute
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <button 
                className="admin-sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            {isSidebarOpen && (
                <div 
                    className="admin-sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2>Admin Panel</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/admin/dashboard"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sidebar-icon">📊</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sidebar-icon">🛒</span>
                    Orders
                </NavLink>

                <NavLink
                    to="/admin/notifications"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sidebar-icon">🔔</span>
                    Notifications
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sidebar-icon">📁</span>
                    Categories
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sidebar-icon">📦</span>
                    Products
                </NavLink>

                <div className="sidebar-divider"></div>

                <NavLink
                    to="/"
                    className="sidebar-link"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sidebar-icon">🏠</span>
                    Back to Store
                </NavLink>
            </nav>
        </aside>
    </>
    );
};

export default Sidebar;
