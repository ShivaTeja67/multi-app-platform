const mockStats = {
  totalOrders: 1234,
  revenue: 45678.90,
  activeUsers: 567,
  conversionRate: 3.45
};

const mockActivity = [
  {
    id: 1,
    type: 'order',
    description: 'Order #1001 placed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    amount: 299.99
  },
  {
    id: 2,
    type: 'user',
    description: 'New user registered',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    amount: null
  },
  {
    id: 3,
    type: 'order',
    description: 'Order #1002 shipped',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    amount: 149.99
  },
  {
    id: 4,
    type: 'payment',
    description: 'Payment received',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    amount: 599.98
  },
  {
    id: 5,
    type: 'order',
    description: 'Order #1003 placed',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    amount: 79.99
  }
];

const mockOrders = [
  {
    id: '#1003',
    customer: 'John Doe',
    amount: 79.99,
    status: 'pending',
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: '#1002',
    customer: 'Jane Smith',
    amount: 149.99,
    status: 'shipped',
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '#1001',
    customer: 'Bob Johnson',
    amount: 299.99,
    status: 'delivered',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

const mockSettings = {
  theme: 'light',
  notifications: true,
  emailDigest: 'daily',
  language: 'en',
  timezone: 'UTC'
};

export const getStats = (req, res) => {
  res.json(mockStats);
};

export const getActivity = (req, res) => {
  res.json(mockActivity);
};

export const getOrders = (req, res) => {
  res.json(mockOrders);
};

export const getSettings = (req, res) => {
  res.json(mockSettings);
};

export const updateSettings = (req, res) => {
  const { theme, notifications, emailDigest, language, timezone } = req.body;
  const updatedSettings = {
    theme: theme || mockSettings.theme,
    notifications: notifications !== undefined ? notifications : mockSettings.notifications,
    emailDigest: emailDigest || mockSettings.emailDigest,
    language: language || mockSettings.language,
    timezone: timezone || mockSettings.timezone
  };
  res.json({
    message: 'Settings updated',
    settings: updatedSettings
  });
};
