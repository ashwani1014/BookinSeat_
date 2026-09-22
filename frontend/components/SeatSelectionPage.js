'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { movieAPI, bookingAPI } from '../lib/api';
import { authAPI } from '../lib/auth';

export default function SeatSelectionPage({ movieId: propMovieId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMovieId = searchParams.get('movieId');

  const [movieId, setMovieId] = useState(propMovieId || queryMovieId || 'movie_1');
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300);
  const [hasSnack, setHasSnack] = useState(false);

  useEffect(() => {
    let resolvedId = propMovieId || queryMovieId;
    if (!resolvedId && typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart !== 'movies') {
        resolvedId = lastPart;
      }
    }
    const finalId = resolvedId || 'movie_1';
    setMovieId(finalId);
    fetchMovieDetails(finalId);
  }, [propMovieId, queryMovieId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMovieDetails = async (idToFetch) => {
    try {
      setLoading(true);
      setError('');
      const targetId = idToFetch || movieId || 'movie_1';
      const response = await movieAPI.getMovieSeats(targetId);
      if (response.success && response.data) {
        setMovie(response.data.movie);
        setSeats(response.data.seats || []);
      } else {
        // Fallback fetch movie
        const mRes = await movieAPI.getMovieById(targetId);
        if (mRes.success && mRes.data) {
          setMovie(mRes.data);
        }
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    if (seat.status !== 'available') return;
    const isSelected = selectedSeats.some((s) => s._id === seat._id || s.seatNumber === seat.seatNumber);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id && s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        setError('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
    setError('');
  };

  const handleBooking = async () => {
    if (!authAPI.isAuthenticated()) {
      router.push(`/login?redirect=/movies/${movieId}`);
      return;
    }
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }

    const seatIdList = selectedSeats.map((s) => s.seatNumber || s._id).join(',');
    router.push(`/bookings/create?movieId=${movieId}&seatIds=${encodeURIComponent(seatIdList)}&snack=${hasSnack ? 1 : 0}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const calculateTotal = () => {
    const pricePerSeat = movie?.pricePerSeat || 14;
    const seatTotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || pricePerSeat), 0);
    const convenienceFee = selectedSeats.length > 0 ? 2 : 0;
    const snackCost = hasSnack ? 10 : 0;
    return seatTotal + convenienceFee + snackCost;
  };

  const getSeatClass = (seat) => {
    const isSelected = selectedSeats.some((s) => s._id === seat._id || s.seatNumber === seat.seatNumber);
    if (seat.status === 'booked') return 'bg-slate-700/50 opacity-40 cursor-not-allowed text-slate-500';
    if (seat.status === 'held') return 'bg-amber-500/30 text-amber-400 animate-pulse cursor-not-allowed';
    if (isSelected) return 'bg-cyan-400 text-slate-950 font-bold scale-110 shadow-lg shadow-cyan-400/50 ring-2 ring-white';
    return 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700';
  };

  const seatsByRow = seats.reduce((acc, seat) => {
    const r = seat.row || (seat.seatNumber ? seat.seatNumber.charAt(0) : 'A');
    if (!acc[r]) acc[r] = [];
    acc[r].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(seatsByRow).sort();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading auditorium seat map...</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-950 text-white pb-16">
      <div className="relative w-full overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-6 flex flex-col gap-6">
          {/* Top Bar: Breadcrumb & Timer */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
              <a href="/movies" className="hover:text-white transition-colors">Movies</a>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-200 font-medium">{movie?.title || 'Selected Movie'}</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-cyan-400 font-semibold">Seat Booking</span>
            </nav>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-medium">
              <span className="material-symbols-outlined text-sm animate-pulse">timer</span>
              <span>Seats locked for <strong className="font-mono text-white">{formatTime(timer)}</strong></span>
            </div>
          </div>

          {/* Movie Header Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md bg-cover bg-center border border-slate-700 bg-slate-800"
                style={{ backgroundImage: movie?.image ? `url('${movie.image}')` : undefined }}
              >
                {!movie?.image && <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-display">{movie?.title}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                    {movie?.format || movie?.genre || 'IMAX'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                    {movie?.duration} min
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs sm:text-sm">
                  <span className="flex items-center gap-1 text-slate-200">
                    <span className="material-symbols-outlined text-cyan-400 text-base">location_on</span>
                    {movie?.theater || 'IMAX Hall 1, PVR'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-blue-400 text-base">schedule</span>
                    {new Date(movie?.showtime || Date.now()).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Pricing info */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-xs text-slate-400 block">Ticket Price</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">${movie?.pricePerSeat || 14}</span>
              </div>
            </div>
          </div>

          {/* Seat Layout Grid + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Stage & Seats (8 cols) */}
            <div className="lg:col-span-8 flex flex-col items-center bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
              {/* Cinema Screen Curve */}
              <div className="w-full max-w-xl flex flex-col items-center pt-2 pb-10">
                <div className="w-full h-12 relative flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 700 80">
                    <defs>
                      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 20 20 Q 350 0 680 20" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                    <polygon fill="url(#screenGradient)" points="20,20 680,20 620,80 80,80" />
                  </svg>
                  <span className="absolute top-0 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-400 drop-shadow">
                    SCREEN • DOLBY ATMOS
                  </span>
                </div>
              </div>

              {/* Seats Matrix */}
              <div className="w-full overflow-x-auto flex flex-col items-center py-2">
                <div className="min-w-[560px] flex flex-col items-center gap-3">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center justify-between w-full px-4 gap-2">
                      <span className="w-6 font-bold text-xs text-slate-500 text-center">{row}</span>
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        {seatsByRow[row].map((seat) => {
                          const isSelected = selectedSeats.some(
                            (s) => s._id === seat._id || s.seatNumber === seat.seatNumber
                          );
                          return (
                            <button
                              key={seat._id || seat.seatNumber}
                              onClick={() => handleSeatSelect(seat)}
                              disabled={seat.status !== 'available'}
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-semibold transition-all flex items-center justify-center relative ${getSeatClass(
                                seat
                              )}`}
                              title={`Seat ${seat.seatNumber} - ${seat.status} ($${seat.price || 14})`}
                            >
                              {isSelected ? (
                                <span className="material-symbols-outlined text-sm font-bold">check</span>
                              ) : (
                                <span>{seat.number || seat.seatNumber.replace(/[A-Z]/g, '')}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6 font-bold text-xs text-slate-500 text-center">{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="w-full mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-400 flex items-center justify-center text-slate-950 font-bold text-[9px]">
                    ✓
                  </div>
                  <span className="text-white font-semibold">Selected ({selectedSeats.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500/30 text-amber-400 flex items-center justify-center text-[9px]">
                    ⏱
                  </div>
                  <span>Held</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800 opacity-40" />
                  <span>Booked</span>
                </div>
              </div>
            </div>

            {/* Checkout & Summary Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Booking Summary</h3>
                  <span className="text-xs text-cyan-400 font-semibold">Real-Time Lock</span>
                </div>

                {/* Selected seats list */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Seats Selected</span>
                    <span className="font-semibold text-white">{selectedSeats.length} seat(s)</span>
                  </div>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat._id || seat.seatNumber}
                          className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30"
                        >
                          Seat {seat.seatNumber}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Please click on seats in the map to select.</p>
                  )}
                </div>

                {/* Snack bundle addon */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-amber-400 text-2xl">fastfood</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Combo Popcorn & Soda</span>
                      <span className="text-[10px] text-slate-400">Jumbo tub + 2 drinks</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasSnack(!hasSnack)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      hasSnack
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {hasSnack ? 'Added (+$10)' : '+ $10'}
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Seat Price ({selectedSeats.length} x ${movie?.pricePerSeat || 14})</span>
                    <span className="font-mono text-white">
                      ${selectedSeats.reduce((sum, s) => sum + (s.price || movie?.pricePerSeat || 14), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span className="font-mono text-white">${selectedSeats.length > 0 ? 2 : 0}</span>
                  </div>
                  {hasSnack && (
                    <div className="flex justify-between text-amber-400">
                      <span>Snack Bundle</span>
                      <span className="font-mono">$10</span>
                    </div>
                  )}
                  <div className="w-full h-px bg-slate-800 my-2" />
                  <div className="flex items-center justify-between text-base font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-xl text-cyan-400 font-mono">${totalPrice}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                {/* Submit / Proceed Button */}
                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  <span>Proceed to Book (${totalPrice})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
