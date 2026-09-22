const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Seat = require('../models/Seat');
const { NotFoundError, BadRequestError } = require('../utils/errors');

const FALLBACK_MOVIES = [
  {
    _id: '65f001000000000000000001',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Sci-Fi',
    duration: 166,
    rating: 9.4,
    showtime: new Date(Date.now() + 86400000),
    theater: 'IMAX Laser 3D, Grand Cinema',
    totalSeats: 80,
    pricePerSeat: 14,
    rows: 8,
    seatsPerRow: 10,
    format: 'IMAX LASER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCnlR0XXVMrRwU7A9td6m3ExxAKN6oTKCcmavcPPJpmEyLlThzZFeTrqCXoBCUOl04WLumnCIETyxefnW6cycJ4p2NjB5KW0INjmVaxT1sr1eXWh4U617MFHy7uae_6COASKbTb0fJqZKdfN0nIdAmtitZihVVgiLS6_tCsPIbrlMgWrgYRdGlL-dQFtYmPqJOpAK585X1JF75smHa4QMEDmnrSpFjQ0i3UcEy3w1vJbWan9xSXnLWdA'
  },
  {
    _id: '65f001000000000000000002',
    title: 'Oppenheimer Re-Release',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    genre: 'Drama',
    duration: 180,
    rating: 9.1,
    showtime: new Date(Date.now() + 172800000),
    theater: '70MM Auditorium 1, Cinema City',
    totalSeats: 80,
    pricePerSeat: 15,
    rows: 8,
    seatsPerRow: 10,
    format: '70MM SPECIAL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ3j6gOai1qLGNYjz2d7RPFdMfEVnf6USBIvOcGb4lLxs2YQMup5rVwktsWDrqMDE6DGJehbhIGd9_pOcx-hpk8TMhABw4LrEpFZS4fF_Iou2s0Dntdzre9BN9lcO1_sVtjBexooOMgmqbvJH7Egv6qKTznQWzG2OIEIuRKxBJydFjpk4an_o4liIGCTZoAzIb_EtuCBduhdmWg-ZKQgULdQh3BLzCXOtsDHAjx_F31IAFFb0IXKfBUg'
  },
  {
    _id: '65f001000000000000000003',
    title: 'Challengers',
    description: 'Tashi, a former tennis prodigy turned coach, enters her grand-slam champion husband into a challenger event against her former lover.',
    genre: 'Romance',
    duration: 131,
    rating: 8.7,
    showtime: new Date(Date.now() + 259200000),
    theater: 'Dolby Atmos Lounge, PVR Prime',
    totalSeats: 80,
    pricePerSeat: 12,
    rows: 8,
    seatsPerRow: 10,
    format: 'DOLBY ATMOS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOSdOkCqKr4ORfjtwA3SL0oGIKpZ11T6XXIk7i6Fxm-O5j9jYBaJKHPOSEuc-P6_i87zc6qU-1YEz9rlsXfxMj1Q3-ApRqLRsBIF42NEf2_yTdXDKIPfK17AhV7jSic_Y35TaMnogmAWYcVaXe47Elx_MdF1JmBsc2OLY2-KCRQnfMAxG6AQ8vXy71dRFK9WvGkfsbN_zDHZnyIGklSj8tTisW-bz1-d9mRegx3rTt36y7LKwnqxJYNA'
  },
  {
    _id: '65f001000000000000000004',
    title: 'Deadpool & Wolverine',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool to defeat a common enemy.',
    genre: 'Action',
    duration: 128,
    rating: 9.0,
    showtime: new Date(Date.now() + 345600000),
    theater: '4DX Motion Studio, Inox',
    totalSeats: 80,
    pricePerSeat: 16,
    rows: 8,
    seatsPerRow: 10,
    format: '4DX 3D',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxK1r7OsoGopua2S3fa23y56srp5TpGCmWcFfAiTW8QwrvnOFgNdgkXsV5jvgn-uM0A_iYdbACq4zgRZCCVGS6RRX40p-Kmov7Q65E_m_49EKpzIZh8v_Z6sQSnnTbZp5B7w1-exPAv8vmlFLQeNeEEU78RYFZR00Fugclui09IWZ9o8lux9fvX-9pRIhQh9O7TlOajtY0Y8rI1uu9E7GWMVX3XgwvzZAaYsB2SAJmnwESQxhX2kwAw'
  }
];

const generateSeatsForMovie = (movieId, moviePrice = 14) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const bookedSeatNumbers = ['A3', 'A4', 'C5', 'C6', 'E4', 'E5', 'E6', 'G7', 'G8'];

  rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= 10; seatNum++) {
      const seatNumber = `${row}${seatNum}`;
      const isBooked = bookedSeatNumbers.includes(seatNumber);
      const isVip = rowIndex >= 5;
      const price = isVip ? moviePrice + 4 : moviePrice;

      seats.push({
        _id: `seat_${movieId}_${seatNumber}`,
        movieId,
        seatNumber,
        row,
        number: seatNum,
        price,
        status: isBooked ? 'booked' : 'available'
      });
    }
  });
  return seats;
};

class MovieService {
  async getAllMovies(page = 1, limit = 10) {
    if (mongoose.connection.readyState === 1) {
      try {
        const skip = (page - 1) * limit;
        const movies = await Movie.find()
          .sort({ showtime: 1 })
          .skip(skip)
          .limit(limit);

        const total = await Movie.countDocuments();
        if (movies && movies.length > 0) {
          return {
            movies,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          };
        }
      } catch (e) {
        // fallback
      }
    }

    return {
      movies: FALLBACK_MOVIES,
      pagination: {
        page: 1,
        limit: 10,
        total: FALLBACK_MOVIES.length,
        pages: 1,
      },
    };
  }

  async getMovieById(movieId) {
    if (mongoose.connection.readyState === 1) {
      try {
        const movie = await Movie.findById(movieId);
        if (movie) return movie;
      } catch (e) {
        // fallback
      }
    }

    const found = FALLBACK_MOVIES.find(
      (m) => m._id === movieId || m._id === String(movieId) || movieId.includes(m.genre)
    );
    return found || FALLBACK_MOVIES[0];
  }

  async getMovieSeats(movieId) {
    if (mongoose.connection.readyState === 1) {
      try {
        const movie = await this.getMovieById(movieId);
        const seats = await Seat.find({ movieId }).sort({ row: 1, seatNumber: 1 });
        if (seats && seats.length > 0) {
          return { movie, seats };
        }
      } catch (e) {
        // fallback
      }
    }

    const movie = await this.getMovieById(movieId);
    const seats = generateSeatsForMovie(movieId, movie.pricePerSeat || 14);
    return { movie, seats };
  }

  async getAvailableSeats(movieId) {
    const { seats } = await this.getMovieSeats(movieId);
    return seats.filter((s) => s.status === 'available');
  }
}

module.exports = new MovieService();
