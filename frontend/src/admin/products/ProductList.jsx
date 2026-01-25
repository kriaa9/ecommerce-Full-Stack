import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../api/adminService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

/**
 * ProductList - Page to display all products with CRUD actions
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteProduct(selectedId);
      setProducts(products.filter(prod => prod.id !== selectedId));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  const columns = [
    { 
      key: 'image', 
      label: 'Image', 
      render: (row) => row.imageUrl ? (
        <img src={row.imageUrl} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '4px' }}></div>
      )
    },
    { key: 'name', label: 'Name', render: (row) => <span style={{ fontWeight: '500' }}>{row.name}</span> },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category', render: (row) => row.category?.name || <span style={{ color: '#94a3b8' }}>Uncategorized</span> },
    { key: 'price', label: 'Price', render: (row) => `$${row.price?.toFixed(2)}` },
    { 
      key: 'stock', 
      label: 'Stock', 
      render: (row) => (
        <span style={{ color: row.stockQuantity > 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
          {row.stockQuantity}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (row) => (
        <div className="actions">
          <Link to={`/admin/products/${row.id}/edit`} className="btn-icon" title="Edit">✏️</Link>
          <button onClick={() => openDeleteModal(row.id)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>🗑️</button>
        </div>
      ) 
    }
  ];

  return (
    <div className="product-list-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <span>+</span> Add New Product
        </Link>
      </div>

      {error && <div className="admin-card" style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <div className="admin-card">
        <DataTable 
          columns={columns} 
          data={products} 
          loading={loading} 
          emptyMessage="No products found. Ready to sell? Create your first product." 
        />
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductList;
