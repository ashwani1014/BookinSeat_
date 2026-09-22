const paymentService = require('../services/paymentService');
const { ValidationError } = require('../utils/errors');

class PaymentController {
  async processPayment(req, res, next) {
    try {
      const { bookingId } = req.params;
      const { success } = req.body; // For simulation: true for success, false for failure
      const userId = req.user.userId;

      // Default to success if not provided (for easier testing)
      const paymentSuccess = success !== undefined ? success : true;

      const result = await paymentService.processPayment(bookingId, userId, paymentSuccess);

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentStatus(req, res, next) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.userId;

      const status = await paymentService.getPaymentStatus(bookingId, userId);

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
