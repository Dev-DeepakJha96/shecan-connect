const jwt = require('jsonwebtoken');
const config = require('../config');
const Admin = require('../models/admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
    }

    return next();
  } catch (error) {
    // Do not leak error details in production
    if (config.app.env === 'development') console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ success: false, message: 'Not authorized' });
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.admin.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, roleCheck };
