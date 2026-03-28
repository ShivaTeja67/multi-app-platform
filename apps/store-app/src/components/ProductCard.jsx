import React from 'react';

function ProductCard({ product, quantity, onQuantityChange, onAddToCart, onViewDetails }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-body">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-description">{product.description}</div>
        <div className="product-rating">
          <span className="stars">⭐ {product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className="product-actions">
          <input
            type="number"
            min="1"
            className="quantity-input"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
          />
          <button className="btn btn-primary" onClick={onAddToCart}>
            Add
          </button>
          <button className="btn btn-secondary" onClick={onViewDetails}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
