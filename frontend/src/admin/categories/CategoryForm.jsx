import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import adminService from '../../api/adminService';

/**
 * CategoryForm - Reusable form for creating and editing categories
 */
const CategoryForm = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const categories = await adminService.getCategories();
                const category = categories.find(cat => cat.id === parseInt(id));

                if (category) {
                    setFormData({
                        name: category.name || '',
                        description: category.description || ''
                    });
                } else {
                    setError('Category not found');
                }
            } catch (err) {
                console.error('Error fetching category:', err);
                setError('Failed to load category data');
            } finally {
                setLoading(false);
            }
        };

        if (isEditMode) {
            fetchCategory();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (isEditMode) {
                await adminService.updateCategory(id, formData);
            } else {
                await adminService.createCategory(formData);
            }
            navigate('/admin/categories');
        } catch (err) {
            console.error('Error saving category:', err);
            setError('Failed to save category. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading category data...</div>;

    return (
        <div className="category-form-page">
            <div className="admin-page-header">
                <h1>{isEditMode ? 'Edit Category' : 'Add New Category'}</h1>
                <Link to="/admin/categories" className="btn-secondary">
                    Cancel
                </Link>
            </div>

            <div className="admin-card" style={{maxWidth: '600px'}}>
                {error && <div style={{color: '#ef4444', marginBottom: '1rem'}}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                            Category Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Electronics"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{marginBottom: '2rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of this category..."
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div className="form-actions" style={{display: 'flex', gap: '1rem'}}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                            style={{flex: 1, justifyContent: 'center'}}
                        >
                            {submitting ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category')}
                        </button>
                        <Link to="/admin/categories" className="btn-secondary" style={{flex: 1, textAlign: 'center'}}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;