import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/me');
      setUser(response.data.user);
      setPage('home');
    } catch (error) {
      setUser(null);
      setPage('login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      setUser(response.data.user);
      setPage('home');
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  };

  const handleLogin = async (email, password) => {
    try {
      console.log('Main: Attempting login...');
      const response = await api.post('/login', { email, password });
      console.log('Main: Login successful', response.data);
      setUser(response.data.user);
      setPage('home');
    } catch (error) {
      console.log('Main: Login failed', error.response?.data);
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      setPage('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {user && page === 'home' && (
        <Home user={user} onLogout={handleLogout} />
      )}
      {!user && page === 'login' && (
        <Login onLogin={handleLogin} onGoToRegister={() => setPage('register')} />
      )}
      {!user && page === 'register' && (
        <Register onRegister={handleRegister} onGoToLogin={() => setPage('login')} />
      )}
    </div>
  );
}

export default App;
