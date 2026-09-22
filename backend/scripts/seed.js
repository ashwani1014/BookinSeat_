const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const Seat = require('../models/Seat');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Seat.deleteMany({});
    console.log('Cleared existing data');

    // Sample movies
    const movies = [
      {
        title: 'The Dark Knight',
        description: 'Batman raises the stakes in his war on crime.',
        genre: 'Action',
        duration: 152,
        rating: 4.8,
        poster: '',
        showtime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        theater: 'Cinema Hall 1',
        totalSeats: 100,
        pricePerSeat: 12,
        rows: 10,
        seatsPerRow: 10,
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        genre: 'Sci-Fi',
        duration: 148,
        rating: 4.7,
        poster: '',
        showtime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        theater: 'Cinema Hall 2',
        totalSeats: 100,
        pricePerSeat: 14,
        rows: 10,
        seatsPerRow: 10,
      },
      {
        title: 'The Avengers',
        description: 'Earth mightiest heroes must come together and learn to fight as a team.',
        genre: 'Action',
        duration: 143,
        rating: 4.6,
        poster: '',
        showtime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        theater: 'Cinema Hall 3',
        totalSeats: 100,
        pricePerSeat: 15,
        rows: 10,
        seatsPerRow: 10,
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space.',
        genre: 'Sci-Fi',
        duration: 169,
        rating: 4.9,
        poster: '',
        showtime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        theater: 'IMAX Theater',
        totalSeats: 80,
        pricePerSeat: 18,
        rows: 8,
        seatsPerRow: 10,
      },
    ];

    const createdMovies = await Movie.insertMany(movies);
    console.log(`Created ${createdMovies.length} movies`);

    // Create seats for each movie
    for (const movie of createdMovies) {
      const seats = [];
      const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, movie.rows);

      for (const row of rows) {
        for (let seatNum = 1; seatNum <= movie.seatsPerRow; seatNum++) {
          seats.push({
            movieId: movie._id,
            seatNumber: `${row}${seatNum}`,
            row: row,
            status: 'available',
            price: movie.pricePerSeat,
          });
        }
      }

      await Seat.insertMany(seats);
      console.log(`Created ${seats.length} seats for ${movie.title}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
