import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import categoryService from '../../api/categoryService';

/**
 * Shared Form Field sub-components for a cleaner main JSX
 */
const FormField = ({ label, name, value, onChange, placeholder, required = false }) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            {label}{required && ' *'}
        </label>
        <input
            id={name}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="form-input"
            aria-required={required}
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="form-textarea"
        />
    </div>
);

/**
 * CategoryForm - Reusable form for creating and editing categories.
 * Refactored for production standards: NO inline styles, semantic HTML, and component abstraction.
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
                const cats = await categoryService.getCategories();
                const category = cats.find(cat => cat.id === parseInt(id));

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
                await categoryService.updateCategory(id, formData);
            } else {
                await categoryService.createCategory(formData);
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
        <main className="category-form-page">
            <header className="admin-page-header">
                <h1>{isEditMode ? 'Edit Category' : 'Add New Category'}</h1>
                <Link to="/admin/categories" className="btn-secondary">
                    Cancel
                </Link>
            </header>

            <article className="admin-card admin-form-card">
                {error && (
                    <p className="error-message" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <FormField
                        label="Category Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Electronics"
                        required
                    />

                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of this category..."
                    />

                    <footer className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary btn-flex"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category')}
                        </button>
                        <Link to="/admin/categories" className="btn-secondary btn-flex">
                            Cancel
                        </Link>
                    </footer>
                </form>
            </article>
        </main>
    );
};

export default CategoryForm;