const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('role');
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticate;
