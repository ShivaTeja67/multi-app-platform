import React, { useEffect, useState } from 'react';

function Overview({ dashboardApi }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes, ordersRes] = await Promise.all([
        dashboardApi.get('/stats'),
        dashboardApi.get('/activity'),
        dashboardApi.get('/orders')
      ]);

      setStats(statsRes.data);
      setActivity(activityRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: 'var(--dark)' }}>Overview</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">Total Orders</div>
            <div className="value">{stats.totalOrders.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="label">Revenue</div>
            <div className="value">${stats.revenue.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="label">Active Users</div>
            <div className="value">{stats.activeUsers.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="label">Conversion Rate</div>
            <div className="value">{stats.conversionRate}%</div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Activity Feed */}
        {activity && (
          <div className="card">
            <h2>Recent Activity</h2>
            <div>
              {activity.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-icon">
                    {item.type === 'order' && '📦'}
                    {item.type === 'user' && '👤'}
                    {item.type === 'payment' && '💳'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-description">{item.description}</div>
                    <div className="activity-details">
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      {item.amount && <span>${item.amount.toFixed(2)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {orders && (
          <div className="card">
            <h2>Recent Orders</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>
                        <span
                          className={`status-badge status-${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>${order.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview;
