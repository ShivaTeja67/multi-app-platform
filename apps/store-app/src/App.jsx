import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';

const authApi = axios.create({
  baseURL: '/api/auth',
  withCredentials: true
});

const storeApi = axios.create({
  baseURL: '/api/store',
  withCredentials: true
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('catalog');
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Store: Checking auth...');
      const response = await authApi.get('/me');
      console.log('Store: Auth successful', response.data);
      setUser(response.data.user);
      setError(null);
      updateCartCount();
    } catch (error) {
      console.log('Store: Auth failed', error.response?.status, error.response?.data);
      try {
        await authApi.post('/refresh');
        const retry = await authApi.get('/me');
        setUser(retry.data.user);
        setError(null);
        updateCartCount();
        console.log('Store: Auth successful after refresh', retry.data);
      } catch (refreshError) {
        console.log('Store: Refresh failed', refreshError.response?.status, refreshError.response?.data);
        setError('Unauthorized. Redirecting to login...');
        setTimeout(() => {
          window.location.href = 'http://app.myplatform.local:3000/login';
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = async () => {
    try {
      const response = await storeApi.get('/cart');
      const itemCount = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(itemCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.post('/logout');
      window.location.href = 'http://app.myplatform.local:3000/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>⚠️ Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="store-app">
      <header className="header">
        <div className="header-content">
          <h1>🛍️ Store</h1>
          <div className="header-right">
            <button
              className={`nav-btn ${currentPage === 'catalog' ? 'active' : ''}`}
              onClick={() => setCurrentPage('catalog')}
            >
              Catalog
            </button>
            <button
              className={`nav-btn cart-btn ${currentPage === 'cart' ? 'active' : ''}`}
              onClick={() => setCurrentPage('cart')}
            >
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="store-content">
        {currentPage === 'catalog' && (
          <Catalog
            storeApi={storeApi}
            onAddToCart={() => {
              updateCartCount();
              showNotification('✓ Item added to cart');
            }}
          />
        )}
        {currentPage === 'cart' && (
          <Cart
            storeApi={storeApi}
            onCartUpdate={() => updateCartCount()}
            onNotification={showNotification}
          />
        )}
      </main>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default App;
