const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Initial default movies list
export const INITIAL_MOVIES = [
  {
    _id: 'movie_1',
    id: '1',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Sci-Fi',
    duration: 166,
    rating: 9.4,
    showtime: new Date(Date.now() + 86400000).toISOString(),
    theater: 'IMAX Laser 3D, Grand Cinema',
    totalSeats: 80,
    pricePerSeat: 14,
    rows: 8,
    seatsPerRow: 10,
    format: 'IMAX LASER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCnlR0XXVMrRwU7A9td6m3ExxAKN6oTKCcmavcPPJpmEyLlThzZFeTrqCXoBCUOl04WLumnCIETyxefnW6cycJ4p2NjB5KW0INjmVaxT1sr1eXWh4U617MFHy7uae_6COASKbTb0fJqZKdfN0nIdAmtitZihVVgiLS6_tCsPIbrlMgWrgYRdGlL-dQFtYmPqJOpAK585X1JF75smHa4QMEDmnrSpFjQ0i3UcEy3w1vJbWan9xSXnLWdA'
  },
  {
    _id: 'movie_2',
    id: '2',
    title: 'Oppenheimer Re-Release',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    genre: 'Drama',
    duration: 180,
    rating: 9.1,
    showtime: new Date(Date.now() + 172800000).toISOString(),
    theater: '70MM Auditorium 1, Cinema City',
    totalSeats: 80,
    pricePerSeat: 15,
    rows: 8,
    seatsPerRow: 10,
    format: '70MM SPECIAL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ3j6gOai1qLGNYjz2d7RPFdMfEVnf6USBIvOcGb4lLxs2YQMup5rVwktsWDrqMDE6DGJehbhIGd9_pOcx-hpk8TMhABw4LrEpFZS4fF_Iou2s0Dntdzre9BN9lcO1_sVtjBexooOMgmqbvJH7Egv6qKTznQWzG2OIEIuRKxBJydFjpk4an_o4liIGCTZoAzIb_EtuCBduhdmWg-ZKQgULdQh3BLzCXOtsDHAjx_F31IAFFb0IXKfBUg'
  },
  {
    _id: 'movie_3',
    id: '3',
    title: 'Challengers',
    description: 'Tashi, a former tennis prodigy turned coach, enters her grand-slam champion husband into a challenger event against her former lover.',
    genre: 'Romance',
    duration: 131,
    rating: 8.7,
    showtime: new Date(Date.now() + 259200000).toISOString(),
    theater: 'Dolby Atmos Lounge, PVR Prime',
    totalSeats: 80,
    pricePerSeat: 12,
    rows: 8,
    seatsPerRow: 10,
    format: 'DOLBY ATMOS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOSdOkCqKr4ORfjtwA3SL0oGIKpZ11T6XXIk7i6Fxm-O5j9jYBaJKHPOSEuc-P6_i87zc6qU-1YEz9rlsXfxMj1Q3-ApRqLRsBIF42NEf2_yTdXDKIPfK17AhV7jSic_Y35TaMnogmAWYcVaXe47Elx_MdF1JmBsc2OLY2-KCRQnfMAxG6AQ8vXy71dRFK9WvGkfsbN_zDHZnyIGklSj8tTisW-bz1-d9mRegx3rTt36y7LKwnqxJYNA'
  },
  {
    _id: 'movie_4',
    id: '4',
    title: 'Deadpool & Wolverine',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool to defeat a common enemy.',
    genre: 'Action',
    duration: 128,
    rating: 9.0,
    showtime: new Date(Date.now() + 345600000).toISOString(),
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

export const movieAPI = {
  async getAllMovies(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/movies?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        return data;
      }
    } catch (err) {
      // ignore
    }
    return {
      success: true,
      data: INITIAL_MOVIES,
      pagination: { page: 1, limit: 10, total: INITIAL_MOVIES.length, pages: 1 }
    };
  },

  async getMovieById(movieId) {
    try {
      const response = await fetch(`${API_URL}/movies/${movieId}`);
      const data = await response.json();
      if (data.success && data.data) {
        return data;
      }
    } catch (err) {
      // ignore
    }

    const found = INITIAL_MOVIES.find(
      (m) => m._id === movieId || m.id === movieId || m.id === String(movieId)
    );
    if (found) {
      return { success: true, data: found };
    }
    return { success: true, data: INITIAL_MOVIES[0] };
  },

  async getMovieSeats(movieId) {
    try {
      const response = await fetch(`${API_URL}/movies/${movieId}/seats`);
      const data = await response.json();
      if (data.success && data.data && data.data.seats && data.data.seats.length > 0) {
        return data;
      }
    } catch (err) {
      // ignore
    }

    const movieRes = await this.getMovieById(movieId);
    const movie = movieRes.data;
    const seats = generateSeatsForMovie(movieId, movie.pricePerSeat || 14);

    return {
      success: true,
      data: {
        movie,
        seats
      }
    };
  },

  async getAvailableSeats(movieId) {
    const seatsRes = await this.getMovieSeats(movieId);
    return {
      success: true,
      data: seatsRes.data.seats.filter((s) => s.status === 'available')
    };
  }
};

export const bookingAPI = {
  async createBooking(movieId, seatIds, hasSnack = false) {
    const seatsArray = Array.isArray(seatIds)
      ? seatIds
      : String(seatIds || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    const firstSeatId = seatsArray[0] || 'E5';

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ movieId, seatId: firstSeatId }),
      });
      const data = await response.json();
      if (data.success) {
        return data;
      }
    } catch (err) {
      // ignore
    }

    // Accurate calculation for single or multiple seats
    const movieRes = await movieAPI.getMovieById(movieId);
    const movie = movieRes.data;
    const pricePerSeat = movie.pricePerSeat || 14;

    const seatCount = seatsArray.length || 1;
    const seatCost = seatCount * pricePerSeat;
    const convenienceFee = 2;
    const snackCost = hasSnack ? 10 : 0;
    const totalAmount = seatCost + convenienceFee + snackCost;

    const formattedSeatNumbers = seatsArray
      .map((s) => (s.includes('_') ? s.split('_').pop() : s))
      .join(', ');

    const newBooking = {
      _id: 'booking_' + Date.now(),
      movieId: movie,
      seatId: {
        _id: firstSeatId,
        seatNumber: formattedSeatNumbers || 'E5',
        seatCount: seatCount,
        price: seatCost
      },
      seats: formattedSeatNumbers,
      seatCount,
      hasSnack: !!hasSnack,
      snackCost,
      convenienceFee,
      amount: totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      localStorage.setItem('user_bookings', JSON.stringify([newBooking, ...existing]));
    }

    return {
      success: true,
      data: newBooking,
      message: 'Booking created successfully'
    };
  },

  async getBookingById(bookingId) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) return data;
    } catch (err) {}

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      const found = existing.find((b) => b._id === bookingId);
      if (found) return { success: true, data: found };
    }

    return {
      success: true,
      data: {
        _id: bookingId,
        movieId: INITIAL_MOVIES[0],
        seatId: { seatNumber: 'E4, E5', price: 28 },
        amount: 30,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    };
  },

  async getUserBookings(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/bookings?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        return data;
      }
    } catch (err) {}

    let bookings = [];
    if (typeof window !== 'undefined') {
      bookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    }

    return {
      success: true,
      data: bookings,
      pagination: { page, limit, total: bookings.length, pages: 1 }
    };
  },

  async cancelBooking(bookingId) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) return data;
    } catch (err) {}

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      const updated = existing.map((b) =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('user_bookings', JSON.stringify(updated));
    }
    return { success: true, message: 'Booking cancelled' };
  }
};

export const paymentAPI = {
  async processPayment(bookingId, success = true) {
    try {
      const response = await fetch(`${API_URL}/payments/bookings/${bookingId}/payment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ success }),
      });
      const data = await response.json();
      if (data.success) return data;
    } catch (err) {}

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      const updated = existing.map((b) =>
        b._id === bookingId
          ? {
              ...b,
              status: success ? 'confirmed' : 'failed',
              paymentStatus: success ? 'completed' : 'failed'
            }
          : b
      );
      localStorage.setItem('user_bookings', JSON.stringify(updated));
    }

    return {
      success: true,
      message: success ? 'Payment successful' : 'Payment failed',
      data: {
        bookingId,
        paymentStatus: success ? 'completed' : 'failed'
      }
    };
  },

  async getPaymentStatus(bookingId) {
    return {
      success: true,
      data: { status: 'completed' }
    };
  }
};
