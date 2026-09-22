const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'],
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes'],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5'],
  },
  poster: {
    type: String,
    default: '',
  },
  showtime: {
    type: Date,
    required: [true, 'Please provide a showtime'],
  },
  theater: {
    type: String,
    required: [true, 'Please provide theater name'],
    trim: true,
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    default: 100,
  },
  pricePerSeat: {
    type: Number,
    required: [true, 'Please provide price per seat'],
    min: [0, 'Price cannot be negative'],
  },
  rows: {
    type: Number,
    default: 10,
  },
  seatsPerRow: {
    type: Number,
    default: 10,
  },
}, {
  timestamps: true,
});

// Index for faster queries
movieSchema.index({ showtime: 1 });
movieSchema.index({ genre: 1 });

// Virtual for checking if movie is in the past
movieSchema.virtual('isPast').get(function() {
  return new Date(this.showtime) < new Date();
});

// Ensure virtuals are included in JSON
movieSchema.set('toJSON', { virtuals: true });
movieSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Movie', movieSchema);
