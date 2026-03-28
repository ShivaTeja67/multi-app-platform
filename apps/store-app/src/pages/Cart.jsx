import React, { useEffect, useState } from 'react';

function Cart({ storeApi, onCartUpdate, onNotification }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await storeApi.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await storeApi.put('/cart', { productId, quantity: newQuantity });
      await fetchCart();
      onCartUpdate();
      onNotification('✓ Cart updated');
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await storeApi.delete(`/cart/${productId}`);
      await fetchCart();
      onCartUpdate();
      onNotification('✓ Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      try {
        await storeApi.delete('/cart');
        await fetchCart();
        onCartUpdate();
        onNotification('✓ Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>🛒</h2>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a href="#" onClick={() => window.location.reload()} className="btn btn-primary">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--dark)' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        <div>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.category}</p>
                  <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
                </div>
                <div className="cart-item-quantity">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                  />
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-item-total">${item.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${(cart.total * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${(cart.total * 1.1).toFixed(2)}</span>
          </div>

          <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
