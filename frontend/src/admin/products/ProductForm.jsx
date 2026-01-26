import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import productService from '../../api/productService';
import categoryService from '../../api/categoryService';
import './ProductForm.css';
import ImageUpload from "../../components/ImageUpload";

/**
 * Shared Form sub-components to keep the main JSX clean and scannable.
 */
const TextField = ({ label, name, value, onChange, placeholder, required = false, type = "text", step }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label}{required && " *"}
    </label>
    <input id={name} type={type} step={step} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="form-input" />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, rows = 4 }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="form-textarea"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label}{required && " *"}
    </label>
    <select id={name} name={name} value={value} onChange={onChange} required={required} className="form-select">
      <option value="">Select a category</option>
      {options.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="form-checkbox-group">
    <input id={name} type="checkbox" name={name} checked={checked} onChange={onChange} className="form-checkbox" />
    <label htmlFor={name} style={{ cursor: "pointer", fontWeight: "600", color: "#1e293b" }}>{label}</label>
  </div>
);

/**
 * ProductForm - Refactored for production standards.
 * NO inline styles, semantic HTML, and advanced component abstraction.
 */
const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    active: true,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const cats = await categoryService.getCategories();
        setCategories(Array.isArray(cats) ? cats : []);

        if (isEditMode) {
          const products = await productService.getAdminProducts();
          const product = products.find((p) => p.id === parseInt(id));

          if (product) {
            setFormData({
              name: product.name || "",
              description: product.description || "",
              sku: product.sku || "",
              price: product.price || "",
              stockQuantity: product.stockQuantity || "",
              categoryId: product.category?.id || "",
              active: product.active !== undefined ? product.active : true,
            });
            if (product.imageUrls && product.imageUrls.length > 0) {
              setPhotoPreview(product.imageUrls[0]);
            }
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (file) => {
    setPhotoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const postData = new FormData();
      const productBlob = new Blob(
        [
          JSON.stringify({
            name: formData.name,
            description: formData.description,
            sku: formData.sku,
            price: parseFloat(formData.price),
            stockQuantity: parseInt(formData.stockQuantity),
            categoryId: parseInt(formData.categoryId),
            active: formData.active,
          }),
        ],
        { type: "application/json" },
      );
      postData.append("product", productBlob);
      if (photoFile) {
        postData.append("images", photoFile);
      }

      if (isEditMode) {
        await productService.updateProduct(id, postData);
      } else {
        await productService.createProduct(postData);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Ensure SKU is unique and categories are valid.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading product details...</div>;

  return (
    <main className="product-form-page">
      <header className="admin-page-header">
        <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Link to="/admin/products" className="btn-secondary">Cancel</Link>
      </header>

      <form onSubmit={handleSubmit} className="admin-card admin-form-wide">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <div className="form-grid">
          {/* Main Form Section */}
          <section className="form-main">
            <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />

            <TextField label="SKU * (Unique Identifier)" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. LAPTOP-001" required />

            <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} />

            <div className="form-row">
              <TextField label="Price ($)" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
              <TextField label="Stock Quantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} required />
            </div>

            <SelectField label="Category" name="categoryId" value={formData.categoryId} onChange={handleChange} options={categories} required />

            <CheckboxField label="Product Visible to Public" name="active" checked={formData.active} onChange={handleChange} />
          </section>

          {/* Sidebar for Media */}
          <aside className="form-sidebar">
            <label className="form-label">Product Image</label>
            <ImageUpload
              currentImage={photoPreview}
              onImageSelect={handleImageSelect}
            />
            <p className="form-sidebar-hint">
              Upload a clear image of the product. Supported formats: JPG, PNG.
            </p>
          </aside>
        </div>

        <footer className="form-actions form-actions-border">
          <button type="submit" className="btn-primary btn-flex" disabled={submitting}>
            {submitting ? "Saving..." : (isEditMode ? "Update Product" : "Create Product")}
          </button>
          <Link to="/admin/products" className="btn-secondary btn-flex">Cancel</Link>
        </footer>
      </form>
    </main>
  );
};

export default ProductForm;
