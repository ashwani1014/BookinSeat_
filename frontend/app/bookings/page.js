'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '../../lib/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings(1, 50);

      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await bookingAPI.cancelBooking(bookingId);

      if (response.success) {
        // Refresh bookings
        fetchBookings();
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      cancelled: 'bg-red-500',
      failed: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          My Bookings
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="card text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">🎫</div>
            <h2 className="text-2xl font-bold mb-4">No Bookings Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven&apos;t made any bookings yet. Start by browsing movies!
            </p>
            <button
              onClick={() => router.push('/movies')}
              className="btn-primary"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded text-sm font-bold text-white ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {booking.movieId?.title || 'Movie'}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>🪑</span>
                        <span>Seats: {booking.seats || booking.seatId?.seatNumber || 'Standard'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>🎭</span>
                        <span>
                          {booking.movieId?.showtime
                            ? formatDate(booking.movieId.showtime)
                            : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>📍</span>
                        <span>{booking.movieId?.theater || 'Loading...'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        ${booking.amount}
                      </p>
                    </div>

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
