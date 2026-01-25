import { useState } from 'react'; // Import hooks
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './auth/login/Login';
import Register from './auth/register/Register';
import Profile from './profile/Profile';
import AdminLayout from './admin/dashboard/AdminLayout';
import AdminDashboard from './admin/dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import authService from './api/authService'; // ✅ Import authService
import './App.css';

// Separate Navigation Component
function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Check auth state (Simple check: is there a token?)
    const isAuthenticated = authService.isAuthenticated(); // ✅ Use service for consistency

    // Hide nav on login/register pages
    if (['/login', '/register'].includes(location.pathname)) return null;

    const handleLogout = async () => {
        // ✅ Call the service to handle backend notification + local cleanup
        await authService.logout();

        setIsDropdownOpen(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">E-Shop</Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/products" className="nav-link">Products</Link>

                    {isAuthenticated ? (
                        /* --- LOGGED IN: SHOW USER DROPDOWN --- */
                        <div className="user-menu-container">
                            <button
                                className="user-avatar-btn"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="avatar-circle">U</div> {/* Placeholder Initial */}
                                <span className="user-name">My Account</span>
                                <span style={{ fontSize: '10px' }}>▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Orders
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* --- LOGGED OUT: SHOW LOGIN BUTTONS --- */
                        <>
                            <Link to="/login" className="nav-link btn-login">Login</Link>
                            <Link to="/register" className="nav-link btn-register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* --- ADMIN ROUTES --- */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* Placeholder for future admin sub-routes */}
                    <Route path="categories" element={<div>Categories Page (Coming Soon)</div>} />
                    <Route path="products" element={<div>Products Page (Coming Soon)</div>} />
                </Route>
                <Route
                    path="/"
                    element={
                        <div className="home-container" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h1>Welcome to E-Shop</h1>
                            <p>Your premium shopping destination.</p>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;