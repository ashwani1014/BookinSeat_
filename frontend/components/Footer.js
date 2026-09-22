'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">theaters</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SeatFlow</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Movie ticket booking platform with real-time seat reservation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/movies" className="hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/bookings" className="hover:text-white transition-colors">
              My Bookings
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SeatFlow. All rights reserved.</p>
          <p>Simple & Secure Online Cinema Ticketing</p>
        </div>
      </div>
    </footer>
  );
}
