import { Navigate } from 'react-router-dom';
import authService from '../api/authService';

/**
 * ProtectedRoute - Requires user to be authenticated
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
