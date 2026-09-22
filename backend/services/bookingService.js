const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Movie = require('../models/Movie');
const { NotFoundError, ConflictError, BadRequestError, UnauthorizedError } = require('../utils/errors');

class BookingService {
  async createBooking(userId, movieId, seatId) {
    // Validate movie exists and is not in the past
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    if (movie.isPast) {
      throw new BadRequestError('Cannot book seats for a movie that has already passed');
    }

    // Validate seat exists and belongs to the movie
    const seat = await Seat.findById(seatId);
    if (!seat) {
      throw new NotFoundError('Seat not found');
    }

    if (seat.movieId.toString() !== movieId.toString()) {
      throw new BadRequestError('Seat does not belong to this movie');
    }

    // CRITICAL: Atomic booking operation with findOneAndUpdate
    // This prevents race conditions by using MongoDB's atomic operation
    // The unique index on (movieId, seatId) provides database-level protection
    const booking = await Booking.findOneAndUpdate(
      {
        movieId: movieId,
        seatId: seatId,
        status: { $in: ['pending', 'confirmed'] },
      },
      {
        $setOnInsert: {
          userId: userId,
          status: 'pending',
          amount: seat.price,
          paymentStatus: 'pending',
        },
      },
      {
        upsert: false, // Only update if exists, don't insert
        new: true,
        runValidators: true,
      }
    );

    // If booking exists, it means someone else already booked this seat
    if (booking) {
      throw new ConflictError('Seat is no longer available');
    }

    // Try to create new booking
    try {
      const newBooking = await Booking.create({
        movieId: movieId,
        seatId: seatId,
        userId: userId,
        status: 'pending',
        amount: seat.price,
        paymentStatus: 'pending',
      });

      // Update seat status to 'held'
      await seat.holdSeat(userId);

      return newBooking;
    } catch (error) {
      // Handle duplicate key error from unique index
      if (error.code === 11000) {
        throw new ConflictError('Seat is no longer available');
      }
      throw error;
    }
  }

  async getBookingById(bookingId, userId) {
    const booking = await Booking.findById(bookingId)
      .populate('movieId')
      .populate('seatId')
      .populate('userId', 'name email');

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Check if user owns this booking
    if (booking.userId._id.toString() !== userId.toString()) {
      throw new UnauthorizedError('You are not authorized to view this booking');
    }

    return booking;
  }

  async getUserBookings(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ userId })
      .populate('movieId')
      .populate('seatId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments({ userId });

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async cancelBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError('You are not authorized to cancel this booking');
    }

    if (booking.status === 'confirmed') {
      throw new BadRequestError('Cannot cancel a confirmed booking');
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Release the seat
    const seat = await Seat.findById(booking.seatId);
    if (seat) {
      await seat.releaseSeat();
    }

    return booking;
  }

  async releaseExpiredBookings() {
    // Find and release expired pending bookings
    const expiredBookings = await Booking.find({
      status: 'pending',
      expiresAt: { $lt: new Date() },
    });

    for (const booking of expiredBookings) {
      booking.status = 'failed';
      await booking.save();

      const seat = await Seat.findById(booking.seatId);
      if (seat) {
        await seat.releaseSeat();
      }
    }

    return expiredBookings.length;
  }
}

module.exports = new BookingService();
