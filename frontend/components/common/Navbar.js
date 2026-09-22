'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authAPI } from '../../lib/auth';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (authAPI.isAuthenticated()) {
      const response = await authAPI.getMe();
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data);
      }
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-cinema-darker border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-cinema-accent">
            🎬 CinemaBook
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/bookings" className="text-gray-300 hover:text-white transition-colors">
                  My Bookings
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300">Hi, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
