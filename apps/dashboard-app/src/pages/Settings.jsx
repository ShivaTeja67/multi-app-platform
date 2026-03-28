import React, { useEffect, useState } from 'react';

function Settings({ dashboardApi }) {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await dashboardApi.get('/settings');
      setSettings(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dashboardApi.put('/settings', formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
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
      <h1 style={{ marginBottom: '2rem', color: 'var(--dark)' }}>Settings</h1>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme || ''}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications || false}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              Enable Notifications
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="emailDigest">Email Digest</label>
            <select
              id="emailDigest"
              name="emailDigest"
              value={formData.emailDigest || ''}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language || ''}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone || ''}
              onChange={handleChange}
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST (Eastern)</option>
              <option value="CST">CST (Central)</option>
              <option value="MST">MST (Mountain)</option>
              <option value="PST">PST (Pacific)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </form>

        {saved && (
          <div className="toast">
            ✓ Settings saved successfully
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', maxWidth: '600px' }}>
        <h3>Account Information</h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          This is a demonstration dashboard. Settings are stored in memory and will reset on page refresh.
        </p>
      </div>
    </div>
  );
}

export default Settings;
