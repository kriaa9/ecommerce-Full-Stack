import { useState, useEffect } from 'react';
import notificationService from '../../api/notificationService';
import './AdminNotifications.css';

const AdminNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    if (loading) return <div className="admin-loading">Checking for updates...</div>;

    return (
        <div className="admin-notifications">
            <div className="admin-page-header">
                <h1>Admin Notifications</h1>
                <button className="btn-secondary" onClick={fetchNotifications}>Refresh</button>
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="admin-card empty"><p>No notifications yet. New orders will appear here.</p></div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`notification-card ${n.read ? 'read' : 'unread'}`}>
                            <div className="notif-icon">{n.type === 'NEW_ORDER' ? '🛍️' : '🔔'}</div>
                            <div className="notif-content">
                                <p className="notif-message">{n.message}</p>
                                <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                            {!n.read && <button className="btn-mark-read" onClick={() => markAsRead(n.id)}>Mark as Read</button>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminNotificationsPage;
