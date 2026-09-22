const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Please provide a movie ID'],
  },
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: [true, 'Please provide a seat ID'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID'],
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'failed'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: [true, 'Please provide booking amount'],
    min: [0, 'Amount cannot be negative'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Booking expires in 15 minutes
      return new Date(Date.now() + 15 * 60 * 1000);
    },
  },
}, {
  timestamps: true,
});

// CRITICAL: Unique compound index to prevent duplicate bookings for same movie and seat
// This is the primary defense against concurrent booking race conditions
bookingSchema.index({ movieId: 1, seatId: 1 }, { unique: true });

// Index for user's bookings
bookingSchema.index({ userId: 1, createdAt: -1 });

// Index for expired bookings
bookingSchema.index({ expiresAt: 1, status: 1 });

// Virtual to check if booking is expired
bookingSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate seat availability
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Seat = mongoose.model('Seat');
    const seat = await Seat.findById(this.seatId);

    if (!seat) {
      return next(new Error('Seat not found'));
    }

    if (seat.movieId.toString() !== this.movieId.toString()) {
      return next(new Error('Seat does not belong to this movie'));
    }

    if (seat.status === 'booked') {
      return next(new Error('Seat is already booked'));
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
