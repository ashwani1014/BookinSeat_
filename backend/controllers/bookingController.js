const bookingService = require('../services/bookingService');
const { ValidationError } = require('../utils/errors');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const { movieId, seatId } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!movieId || !seatId) {
        throw new ValidationError('Please provide movieId and seatId');
      }

      const booking = await bookingService.createBooking(userId, movieId, seatId);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.userId;

      const booking = await bookingService.getBookingById(bookingId, userId);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBookings(req, res, next) {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await bookingService.getUserBookings(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.bookings,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.userId;

      const booking = await bookingService.cancelBooking(bookingId, userId);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async releaseExpiredBookings(req, res, next) {
    try {
      const count = await bookingService.releaseExpiredBookings();

      res.status(200).json({
        success: true,
        message: `Released ${count} expired bookings`,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
