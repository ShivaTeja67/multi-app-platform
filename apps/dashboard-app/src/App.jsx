import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Overview from './pages/Overview';
import Settings from './pages/Settings';

const authApi = axios.create({
  baseURL: '/api/auth',
  withCredentials: true
});

const dashboardApi = axios.create({
  baseURL: '/api/dashboard',
  withCredentials: true
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.get('/me');
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      try {
        await authApi.post('/refresh');
        const retry = await authApi.get('/me');
        setUser(retry.data.user);
        setError(null);
      } catch (refreshError) {
        setError('Unauthorized. Redirecting to login...');
        setTimeout(() => {
          window.location.href = 'http://app.myplatform.local:3000/login';
        }, 1500);
      }
    } finally {
      setLoading(false);
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
    <div className="dashboard-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>📊 Dashboard</h3>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentPage === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentPage('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div>
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        {currentPage === 'overview' && <Overview dashboardApi={dashboardApi} />}
        {currentPage === 'settings' && <Settings dashboardApi={dashboardApi} />}
      </div>
    </div>
  );
}

export default App;
