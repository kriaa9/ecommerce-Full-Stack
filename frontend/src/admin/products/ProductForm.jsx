import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import adminService from "../../api/adminService";
import ImageUpload from "../../components/ImageUpload";

/**
 * ProductForm - Page for creating and editing products
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
        // Fetch categories for dropdown
        const cats = await adminService.getCategories();
        setCategories(Array.isArray(cats) ? cats : []);

        if (isEditMode) {
          // Fetch specific product to edit
          const products = await adminService.getProducts();
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
        // Now passing postData (FormData) to support image updates on backend
        await adminService.updateProduct(id, postData);
      } else {
        await adminService.createProduct(postData);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      setError(
        "Failed to save product. Please check that SKU is unique and all fields are valid.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="admin-loading">Loading product details...</div>;

  return (
    <div className="product-form-page">
      <div className="admin-page-header">
        <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Link to="/admin/products" className="btn-secondary">
          Cancel
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="admin-card"
        style={{ maxWidth: "800px" }}
      >
        {error && (
          <div
            style={{
              color: "#ef4444",
              marginBottom: "1.25rem",
              padding: "0.75rem",
              background: "#fee2e2",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: "2rem",
          }}
        >
          {/* Main Info */}
          <div className="form-main">
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                SKU * (Unique Identifier)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="e.g. LAPTOP-001"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: "#fff",
                }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", background: "#f8fafc", borderRadius: "8px" }}>
              <input
                type="checkbox"
                name="active"
                id="active-toggle"
                checked={formData.active}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label htmlFor="active-toggle" style={{ cursor: "pointer", fontWeight: "600", color: "#1e293b" }}>
                Product Visible to Public
              </label>
            </div>
          </div>

          {/* Image Sidebar */}
          <div className="form-sidebar">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Product Image
            </label>
            <ImageUpload
              currentImage={photoPreview}
              onImageSelect={handleImageSelect}
            />
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginTop: "1rem",
              }}
            >
              Upload a clear image of the product. Supported formats: JPG, PNG.
            </p>
          </div>
        </div>

        <div
          className="form-actions"
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            borderTop: "1px solid #f1f5f9",
            paddingTop: "1.5rem",
          }}
        >
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {submitting
              ? "Saving..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
          </button>
          <Link
            to="/admin/products"
            className="btn-secondary"
            style={{ flex: 1, textAlign: "center" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
