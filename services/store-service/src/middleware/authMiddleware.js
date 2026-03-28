import jwt from 'jsonwebtoken';

export const verifyAuth = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      console.log('Store auth failed: no accessToken cookie', req.cookies);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Store auth failed: token verify error', error?.message, req.cookies);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
