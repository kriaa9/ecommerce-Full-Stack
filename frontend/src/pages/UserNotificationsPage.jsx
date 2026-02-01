import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userNotificationService from '../api/userNotificationService';
import './UserNotificationsPage.css';

/**
 * User Notifications Page
 * Displays all notifications for the authenticated user.
 * Allows marking notifications as read.
 */
const UserNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await userNotificationService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Mark a notification as read and update local state.
     */
    const markAsRead = async (id) => {
        try {
            await userNotificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    if (loading) return <div className="page-loading">Loading notifications...</div>;

    return (
        <div className="user-notifications-page">
            <div className="notifications-container">
                <header className="page-header">
                    <h1>🔔 My Notifications</h1>
                    <p>Stay updated on your order statuses.</p>
                </header>

                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        <span className="icon">📭</span>
                        <h3>No notifications yet</h3>
                        <p>You'll see updates about your orders here.</p>
                        <Link to="/orders" className="btn-primary">View My Orders</Link>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(n => (
                            <div key={n.id} className={`notification-card ${n.read ? 'read' : 'unread'}`}>
                                <div className="notif-icon">
                                    {n.type === 'ORDER_STATUS_UPDATE' ? '📦' : '🔔'}
                                </div>
                                <div className="notif-content">
                                    <p className="notif-message">{n.message}</p>
                                    <span className="notif-time">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                {!n.read && (
                                    <button
                                        className="btn-mark-read"
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotificationsPage;
