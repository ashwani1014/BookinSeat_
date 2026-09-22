'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { movieAPI, bookingAPI, paymentAPI } from '../../../lib/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';

function CreateBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const movieId = searchParams.get('movieId');
  const rawSeatIds = searchParams.get('seatIds') || searchParams.get('seatId');
  const hasSnack = searchParams.get('snack') === '1';

  useEffect(() => {
    if (movieId && rawSeatIds) {
      createBookings();
    } else {
      router.push('/movies');
    }
  }, [movieId, rawSeatIds]);

  const createBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const movieResponse = await movieAPI.getMovieById(movieId);
      if (movieResponse.success) {
        setMovie(movieResponse.data);
      }

      // Create multi-seat booking
      const bookingResponse = await bookingAPI.createBooking(movieId, rawSeatIds, hasSnack);

      if (bookingResponse.success && bookingResponse.data) {
        setBooking(bookingResponse.data);
        setShowPayment(true);
      } else {
        setError(bookingResponse.message || 'Failed to create booking');
        setTimeout(() => router.push(`/movies/${movieId}`), 3000);
      }
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      setTimeout(() => router.push(`/movies/${movieId}`), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (success) => {
    if (!booking) return;

    setProcessing(true);
    setError('');

    try {
      const paymentResponse = await paymentAPI.processPayment(booking._id, success);

      if (paymentResponse.success) {
        router.push('/bookings');
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('Payment processing error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const seatList = (booking?.seatId?.seatNumber || rawSeatIds || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const pricePerSeat = movie?.pricePerSeat || 14;
  const seatsTotal = seatList.length * pricePerSeat;
  const convenienceFee = 2;
  const snackTotal = hasSnack ? 10 : 0;
  const grandTotal = booking?.amount || seatsTotal + convenienceFee + snackTotal;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-slate-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-slate-400 mt-4 text-sm">Locking your seats & preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (!showPayment) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-slate-950 flex items-center justify-center pt-20">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-950 text-white py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              Step 2: Checkout & Payment
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-2">
              Complete Your Booking
            </h1>
          </div>

          {movie && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 flex items-center gap-4">
              <div
                className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 bg-cover bg-center border border-slate-700"
                style={{ backgroundImage: movie.image ? `url('${movie.image}')` : undefined }}
              >
                {!movie.image && <div className="text-3xl flex items-center justify-center h-full">🎬</div>}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-white leading-tight">{movie.title}</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="text-cyan-400 font-semibold">{movie.format || 'IMAX 3D'}</span>
                  <span>•</span>
                  <span>{movie.duration}m</span>
                  <span>•</span>
                  <span>{movie.theater || 'Cinema Hall 1'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  📅 {new Date(movie.showtime || Date.now()).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Seat Breakdown List */}
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Seats</h3>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              {seatList.map((seatNum, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-base">chair</span>
                    <span className="text-white font-semibold">Seat {seatNum}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Standard</span>
                  </div>
                  <span className="text-white font-mono">${pricePerSeat}</span>
                </div>
              ))}

              <div className="w-full h-px bg-slate-800 my-2" />

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Seats Subtotal ({seatList.length} seats)</span>
                <span className="text-white font-mono">${seatsTotal}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Convenience Fee & Taxes</span>
                <span className="text-white font-mono">${convenienceFee}</span>
              </div>

              {hasSnack && (
                <div className="flex justify-between items-center text-xs text-amber-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">fastfood</span>
                    Combo Popcorn & Soda Bundle
                  </span>
                  <span className="font-mono">$10</span>
                </div>
              )}
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-4 mb-6 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Total Payable</span>
              <span className="text-xs text-slate-400">Includes all applicable fees</span>
            </div>
            <span className="text-2xl sm:text-3xl text-cyan-400 font-mono font-extrabold">
              ${grandTotal}
            </span>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {!processing && (
            <div className="space-y-3">
              <p className="text-center text-xs text-slate-400 mb-2">
                Simulate payment gateway to complete ticket booking:
              </p>
              <button
                onClick={() => handlePayment(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                disabled={processing}
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Pay & Confirm (${grandTotal})</span>
              </button>
              <button
                onClick={() => handlePayment(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                disabled={processing}
              >
                Simulate Payment Failure
              </button>
            </div>
          )}

          {processing && (
            <div className="text-center py-6">
              <LoadingSpinner />
              <p className="text-slate-400 text-sm mt-3">Authorizing payment & generating tickets...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateBooking() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-20">
          <LoadingSpinner />
        </div>
      }
    >
      <CreateBookingContent />
    </Suspense>
  );
}
