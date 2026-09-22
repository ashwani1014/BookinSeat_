const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Please provide a movie ID'],
    index: true,
  },
  seatNumber: {
    type: String,
    required: [true, 'Please provide a seat number'],
    trim: true,
  },
  row: {
    type: String,
    required: [true, 'Please provide a row'],
    trim: true,
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['available', 'selected', 'held', 'booked'],
    default: 'available',
    index: true,
  },
  heldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  heldAt: {
    type: Date,
    default: null,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  bookedAt: {
    type: Date,
    default: null,
  },
  price: {
    type: Number,
    required: [true, 'Please provide seat price'],
    min: [0, 'Price cannot be negative'],
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique seat per movie
seatSchema.index({ movieId: 1, seatNumber: 1, row: 1 }, { unique: true });

// Index for querying available seats
seatSchema.index({ movieId: 1, status: 1 });

// Method to hold a seat
seatSchema.methods.holdSeat = function(userId) {
  this.status = 'held';
  this.heldBy = userId;
  this.heldAt = new Date();
  return this.save();
};

// Method to book a seat
seatSchema.methods.bookSeat = function(userId) {
  this.status = 'booked';
  this.bookedBy = userId;
  this.bookedAt = new Date();
  this.heldBy = null;
  this.heldAt = null;
  return this.save();
};

// Method to release a held seat
seatSchema.methods.releaseSeat = function() {
  this.status = 'available';
  this.heldBy = null;
  this.heldAt = null;
  return this.save();
};

module.exports = mongoose.model('Seat', seatSchema);
