const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'Access denied. Not a member of the Inner Circle.' });
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid sovereign token.' });
    }
  } else {
    res.status(401).json({ message: 'No token. Inner Circle access required.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Forbidden. Royal decree required.' });
};

module.exports = { protect, adminOnly };