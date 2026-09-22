const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');

class PaymentService {
  async processPayment(bookingId, userId, success = true) {
    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate('seatId')
      .populate('movieId');

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Verify user owns this booking
    if (booking.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError('You are not authorized to process payment for this booking');
    }

    // Check if booking is already processed
    if (booking.paymentStatus === 'completed') {
      throw new BadRequestError('Payment has already been completed for this booking');
    }

    if (booking.paymentStatus === 'failed') {
      throw new BadRequestError('Payment has already failed for this booking. Please create a new booking.');
    }

    // Check if booking is expired
    if (booking.isExpired) {
      booking.status = 'failed';
      booking.paymentStatus = 'failed';
      await booking.save();

      // Release the seat
      const seat = await Seat.findById(booking.seatId._id);
      if (seat) {
        await seat.releaseSeat();
      }

      throw new BadRequestError('Booking has expired. Please create a new booking.');
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (success) {
      // Payment successful
      booking.status = 'confirmed';
      booking.paymentStatus = 'completed';

      // Update seat status to booked
      const seat = await Seat.findById(booking.seatId._id);
      if (seat) {
        await seat.bookSeat(userId);
      }

      await booking.save();

      return {
        success: true,
        booking,
        message: 'Payment successful! Your booking is confirmed.',
      };
    } else {
      // Payment failed
      booking.status = 'failed';
      booking.paymentStatus = 'failed';

      // Release the seat
      const seat = await Seat.findById(booking.seatId._id);
      if (seat) {
        await seat.releaseSeat();
      }

      await booking.save();

      return {
        success: false,
        booking,
        message: 'Payment failed. Please try again.',
      };
    }
  }

  async getPaymentStatus(bookingId, userId) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError('You are not authorized to view this booking');
    }

    return {
      bookingId: booking._id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      amount: booking.amount,
      expiresAt: booking.expiresAt,
      isExpired: booking.isExpired,
    };
  }
}

module.exports = new PaymentService();
