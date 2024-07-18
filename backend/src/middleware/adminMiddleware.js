// backend/src/middleware/adminMiddleware.js
import { verifyToken } from '../utils/tokenUtils.js';
import Admin from '../models/Admin.js';

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const admin = await Admin.findById(decodedToken.userId);
    if (!admin) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default adminMiddleware;
