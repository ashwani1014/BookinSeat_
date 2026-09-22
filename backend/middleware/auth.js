const { verifyToken } = require('../config/jwt');
const { UnauthorizedError } = require('../utils/errors');

const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      throw new UnauthorizedError('Not authenticated. Please login.');
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired token. Please login again.');
    }

    // Add user ID to request
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
