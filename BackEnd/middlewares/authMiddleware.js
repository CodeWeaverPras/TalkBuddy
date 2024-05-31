const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.payload;

      req.user = await User.findById(userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token Failed!');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { authenticateUser };
