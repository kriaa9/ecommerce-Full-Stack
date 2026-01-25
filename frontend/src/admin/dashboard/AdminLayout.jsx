import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './AdminLayout.css';

/**
 * AdminLayout - Main layout wrapper for admin pages
 * Contains sidebar navigation and content area
 * Uses Outlet for nested route rendering
 */
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
