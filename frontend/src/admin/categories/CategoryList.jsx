import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import adminService from '../../api/adminService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

/**
 * CategoryList - Page to display all categories with CRUD actions
 */
const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await adminService.getCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please try again.');
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
            await adminService.deleteCategory(selectedId);
            setCategories(categories.filter(cat => cat.id !== selectedId));
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Failed to delete category.');
        }
    };

    const columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'Name', render: (row) => <span style={{fontWeight: '500'}}>{row.name}</span>},
        {
            key: 'description',
            label: 'Description',
            render: (row) => row.description || <span style={{color: '#94a3b8'}}>No description</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="actions">
                    <Link to={`/admin/categories/${row.id}/edit`} className="btn-icon" title="Edit">✏️</Link>
                    <button onClick={() => openDeleteModal(row.id)} className="btn-icon" title="Delete"
                            style={{color: '#ef4444'}}>🗑️
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="category-list-page">
            <div className="admin-page-header">
                <h1>Categories</h1>
                <Link to="/admin/categories/new" className="btn-primary">
                    <span>+</span> Add New Category
                </Link>
            </div>

            {error && <div className="admin-card" style={{color: '#ef4444', marginBottom: '1rem'}}>{error}</div>}

            <div className="admin-card">
                <DataTable
                    columns={columns}
                    data={categories}
                    loading={loading}
                    emptyMessage="No categories found. Get started by creating your first category."
                />
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default CategoryList;
