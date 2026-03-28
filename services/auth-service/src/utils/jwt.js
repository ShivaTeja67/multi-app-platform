import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = () => {
  return jwt.sign(
    { random: Math.random() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN || '.myplatform.local';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : false,
    domain: cookieDomain,
    path: '/'
  };
};

export const getRefreshTokenExpiry = () => {
  // Parse JWT_REFRESH_EXPIRES_IN (e.g., "7d")
  const pattern = /(\d+)([dhms])/;
  const match = process.env.JWT_REFRESH_EXPIRES_IN.match(pattern);
  
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days
  
  const [, value, unit] = match;
  const num = parseInt(value);
  
  const multiplicators = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000
  };
  
  return new Date(Date.now() + num * multiplicators[unit]);
};
