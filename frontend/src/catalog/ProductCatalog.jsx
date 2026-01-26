import { useState, useEffect } from 'react';
import productService from '../api/productService';
import './ProductCatalog.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          productService.getCategories()
        ]);
        
        console.log('Public Catalog - Products Received:', productsData);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        // Find max price for initial range
        if (productsData.length > 0) {
          const maxP = Math.max(...productsData.map(p => p.price));
          setPriceRange(prev => ({ ...prev, max: Math.ceil(maxP) }));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching catalog data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?.id === parseInt(selectedCategory));
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  if (loading) return <div className="catalog-loading">Loading our collection...</div>;

  return (
    <div className="catalog-container">
      <aside className="catalog-sidebar">
        <div className="sidebar-section">
          <h3>Search</h3>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Categories</h3>
          <ul className="category-list">
            <li 
              className={selectedCategory === 'all' ? 'active' : ''} 
              onClick={() => setSelectedCategory('all')}
            >
              All Products
            </li>
            {categories.map(cat => (
              <li 
                key={cat.id} 
                className={selectedCategory === cat.id.toString() ? 'active' : ''} 
                onClick={() => setSelectedCategory(cat.id.toString())}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Price Range</h3>
          <div className="price-filter">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              value={priceRange.max} 
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            />
            <div className="price-labels">
              <span>$0</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-text-reset" 
          onClick={() => {
            setSelectedCategory('all');
            setSearchTerm('');
            setPriceRange({ min: 0, max: 2000 });
          }}
        >
          Reset All Filters
        </button>
      </aside>

      <main className="catalog-main">
        <header className="catalog-header">
          <div className="results-count">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
          <div className="catalog-actions">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </header>

        {error && <div className="catalog-error">{error}</div>}

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category.</p>
            <button className="btn-secondary" onClick={() => setSelectedCategory('all')}>Clear Filter</button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-image">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img src={product.imageUrls[0]} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">No Image Available</div>
                  )}
                  {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                    <span className="badge warning">Low Stock</span>
                  )}
                  {product.stockQuantity === 0 && (
                    <span className="badge danger">Out of Stock</span>
                  )}
                </div>
                <div className="product-card-info">
                  <span className="product-card-category">{product.category?.name || 'Uncategorized'}</span>
                  <h4 className="product-card-title">{product.name}</h4>
                  <div className="product-card-bottom">
                    <span className="product-card-price">${product.price.toFixed(2)}</span>
                    <button className="btn-add-cart" disabled={product.stockQuantity === 0}>
                      {product.stockQuantity === 0 ? 'Sold Out' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductCatalog;
