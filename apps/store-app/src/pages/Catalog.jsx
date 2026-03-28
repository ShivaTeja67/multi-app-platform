import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

function Catalog({ storeApi, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await storeApi.get('/products');
      setProducts(response.data);
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const quantity = quantities[productId] || 1;
      await storeApi.post('/cart', { productId, quantity });
      setQuantities({ ...quantities, [productId]: 1 });
      onAddToCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities({ ...quantities, [productId]: qty });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (selectedProduct) {
    const product = products.find(p => p.id === selectedProduct);
    return (
      <div>
        <button className="back-btn" onClick={() => setSelectedProduct(null)}>
          ← Back to Catalog
        </button>
        <div className="product-detail">
          <div className="product-detail-grid">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-detail-info">
              <div className="product-category">{product.category}</div>
              <h2>{product.name}</h2>
              <div className="product-detail-meta">
                <div className="meta-item">
                  <div className="meta-label">Rating</div>
                  <div className="meta-value">⭐ {product.rating} ({product.reviews} reviews)</div>
                </div>
                <div className="meta-item">
                  <div className="meta-label">Stock</div>
                  <div className="meta-value">{product.inStock ? 'In Stock' : 'Out of Stock'}</div>
                </div>
              </div>
              <div className="product-detail-price">${product.price.toFixed(2)}</div>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {product.description}
              </p>
              <div className="product-detail-form">
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--dark)' }}>Product Catalog</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id] || 1}
            onQuantityChange={(value) => handleQuantityChange(product.id, value)}
            onAddToCart={() => handleAddToCart(product.id)}
            onViewDetails={() => setSelectedProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Catalog;
