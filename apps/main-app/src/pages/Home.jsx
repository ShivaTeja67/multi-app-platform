import React from 'react';

function Home({ user, onLogout }) {
  const apps = [
    {
      name: 'Dashboard',
      description: 'View your stats, activity, and manage your account settings',
      url: 'http://localhost:3001',
      icon: '📊',
      status: 'Protected'
    },
    {
      name: 'Store',
      description: 'Browse our product catalog and manage your shopping cart',
      url: 'http://localhost:3002',
      icon: '🛍️',
      status: 'Protected'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Multi-App Platform</h1>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="home-content">
        <div className="welcome-card">
          <h2>Welcome, {user.name}! 👋</h2>
          <p>
            You're now logged into our platform. Thanks to our cross-subdomain SSO,
            you'll remain authenticated across all apps without re-logging in.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Connected as: {user.email}
          </p>
        </div>

        <div className="apps-grid">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="app-card"
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {app.icon}
              </div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <span className="app-card-badge">{app.status}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
