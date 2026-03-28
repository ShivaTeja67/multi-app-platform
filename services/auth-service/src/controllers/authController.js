import User from '../models/User.js';
import Session from '../models/Session.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  getCookieOptions,
  getRefreshTokenExpiry
} from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Create session and tokens
    const refreshToken = generateRefreshToken();
    const accessToken = generateAccessToken(user._id.toString());

    const session = new Session({
      userId: user._id,
      refreshToken,
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
      expiresAt: getRefreshTokenExpiry()
    });
    await session.save();

    // Set cookies
    const cookieOptions = getCookieOptions();
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
      user: user.toJSON(),
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session and tokens
    const refreshToken = generateRefreshToken();
    const accessToken = generateAccessToken(user._id.toString());

    const session = new Session({
      userId: user._id,
      refreshToken,
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
      expiresAt: getRefreshTokenExpiry()
    });
    await session.save();

    // Set cookies
    const cookieOptions = getCookieOptions();
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({
      user: user.toJSON(),
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Session.findOneAndUpdate(
        { refreshToken },
        { isValid: false }
      );
    }

    const cookieOptions = getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (userId) {
      // Invalidate all user sessions
      await Session.updateMany(
        { userId, isValid: true },
        { isValid: false }
      );
    }

    const cookieOptions = getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verify = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const session = await Session.findOne({
      refreshToken,
      isValid: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      const cookieOptions = getCookieOptions();
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id.toString());

    const cookieOptions = getCookieOptions();
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

    res.json({
      user: user.toJSON(),
      message: 'Token refreshed'
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
