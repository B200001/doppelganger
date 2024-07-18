// backend/src/utils/tokenUtils.js
import jwt from 'jsonwebtoken';

const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    {
      userId,
      isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

export { generateToken, verifyToken };
