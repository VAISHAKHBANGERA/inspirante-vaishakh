const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized — no token provided' });
    }
const token = authHeader.split(' ')[1];
    
    // Fallback added here to match your login route and fix the Render crash
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vaishakh_secret_key_123');

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized — invalid token' });
  }
};

// Restrict to admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — admin access required' });
  }
  next();
};

// Restrict to student only
const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Forbidden — student access required' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly, studentOnly };
