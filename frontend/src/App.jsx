import { useState } from "react"; // Import hooks
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./auth/login/Login";
import Register from "./auth/register/Register";
import Profile from "./profile/Profile";
import AdminLayout from "./admin/dashboard/AdminLayout";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import AdminNotificationsPage from "./admin/dashboard/AdminNotificationsPage";
import AdminOrdersPage from "./admin/dashboard/AdminOrdersPage";
import CategoryList from "./admin/categories/CategoryList";
import CategoryForm from "./admin/categories/CategoryForm";
import ProductList from "./admin/products/ProductList";
import ProductForm from "./admin/products/ProductForm";
import ProductCatalog from "./catalog/ProductCatalog";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import authService from "./api/authService";
import { useCart } from "./context/CartContext";
import { CartProvider } from "./context/CartProvider";
import "./App.css";

// Separate Navigation Component
function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check auth state (Simple check: is there a token?)
  const isAuthenticated = authService.isAuthenticated(); // ✅ Use service for consistency
  const isAdmin = authService.isAdmin(); // Add isAdmin check

  // Hide nav on login/register pages
  if (["/login", "/register"].includes(location.pathname)) return null;

  const handleLogout = () => {
    // Modified handleLogout as per instruction
    authService.logout();
    setIsDropdownOpen(false); // Keep this from original
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link
          to="/"
          className="nav-logo"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          E-SHOP
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>

          {!isAdmin && ( // Conditionally render Cart link
            <Link
              to="/cart"
              className="nav-link cart-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart{" "}
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            /* --- LOGGED IN: SHOW USER DROPDOWN --- */
            <div className="user-menu-container">
              <button
                className="user-avatar-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="avatar-circle">U</div>
                {/* Placeholder Initial */}
                <span className="user-name">My Account</span>
                <span style={{ fontSize: "10px" }}>▼</span>
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
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* --- LOGGED OUT: SHOW LOGIN BUTTONS --- */
            <div className="nav-auth-links">
              <Link
                to="/login"
                className="nav-link btn-login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link btn-register"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* --- ADMIN ROUTES --- */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
          </Route>

          {/* --- USER ROUTES --- */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />

          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <div
                className="home-container"
                style={{ padding: "2rem", textAlign: "center" }}
              >
                <h1>Welcome to E-Shop</h1>
                <p>Your premium shopping destination.</p>
              </div>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
