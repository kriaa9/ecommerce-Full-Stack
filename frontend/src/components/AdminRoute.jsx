import {Navigate} from 'react-router-dom';
import authService from '../api/authService';

/**
 * AdminRoute - Requires user to be authenticated AND have ROLE_ADMIN
 * Redirects to login if not authenticated
 * Redirects to home if authenticated but not admin
 */
const AdminRoute = ({children}) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace/>;
    }

    if (!authService.isAdmin()) {
        // User is logged in but not an admin - redirect to home
        return <Navigate to="/" replace/>;
    }

    return children;
};

export default AdminRoute;