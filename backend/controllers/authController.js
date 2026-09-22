const authService = require('../services/authService');
const { ValidationError } = require('../utils/errors');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        throw new ValidationError('Please provide name, email, and password');
      }

      if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      const result = await authService.register(name, email, password);

      // Set HTTP-only cookie with token
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        throw new ValidationError('Please provide email and password');
      }

      const result = await authService.login(email, password);

      // Set HTTP-only cookie with token
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // Clear cookie
      res.clearCookie('token');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
