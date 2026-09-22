'use client';
import { useState } from 'react';

export default function SeatMap({ seats, onSeatSelect, selectedSeats }) {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(groupedSeats).sort();

  const getSeatClass = (seat) => {
    const isSelected = selectedSeats.some(s => s._id === seat._id);
    const isHeld = seat.status === 'held';
    const isBooked = seat.status === 'booked';

    if (isBooked) return 'seat-booked';
    if (isHeld) return 'seat-held';
    if (isSelected) return 'seat-selected';
    return 'seat-available';
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'available' && onSeatSelect) {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="bg-cinema-darker rounded-xl p-6 border border-gray-800">
      <div className="mb-8">
        <div className="screen"></div>
        <p className="text-center text-gray-500 text-sm">SCREEN</p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <div className="w-8 text-center font-bold text-cinema-gold">
              {row}
            </div>
            <div className="flex gap-2 flex-wrap">
              {groupedSeats[row].map((seat) => (
                <button
                  key={seat._id}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  disabled={seat.status !== 'available'}
                  className={`seat ${getSeatClass(seat)}`}
                  title={`${seat.row}${seat.seatNumber} - $${seat.price}`}
                >
                  {seat.seatNumber.replace(/[A-Z]/g, '')}
                </button>
              ))}
            </div>
            <div className="w-8 text-center font-bold text-cinema-gold">
              {row}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-available"></div>
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-selected"></div>
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-held"></div>
          <span className="text-gray-400">Held</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-booked"></div>
          <span className="text-gray-400">Booked</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredSeat && (
        <div className="fixed bottom-4 right-4 bg-cinema-darker border border-cinema-accent rounded-lg p-4 shadow-xl z-50">
          <p className="font-bold text-white">{hoveredSeat.row}{hoveredSeat.seatNumber}</p>
          <p className="text-sm text-gray-400">Price: ${hoveredSeat.price}</p>
          <p className="text-sm text-gray-400">Status: {hoveredSeat.status}</p>
        </div>
      )}
    </div>
  );
}
