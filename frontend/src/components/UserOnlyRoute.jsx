import { Navigate } from 'react-router-dom';
import authService from '../api/authService';

/**
 * UserOnlyRoute - Requires user to be authenticated AND NOT be an admin
 * Admins should not access cart, checkout, or order placement
 * Redirects to login if not authenticated
 * Redirects to admin dashboard if user is admin
 */
const UserOnlyRoute = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (authService.isAdmin()) {
        // Admins should use admin panel, not customer features
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default UserOnlyRoute;
