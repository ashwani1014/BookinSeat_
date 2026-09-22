'use client';
import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import QuickSearchBar from '../components/QuickSearchBar';
import NowShowingSection from '../components/NowShowingSection';
import PremierAuditoriums from '../components/PremierAuditoriums';
import TrailerModal from '../components/TrailerModal';

export default function Home() {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="w-full bg-slate-900">
      <HeroSection onTrailerClick={() => setShowTrailer(true)} />
      <QuickSearchBar />
      <NowShowingSection />
      <PremierAuditoriums />

      <div className="w-full bg-slate-800 py-10">
        <div className="w-full px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-lg shadow-cyan-500/25">
              <span className="material-symbols-outlined text-4xl">spatial_audio_off</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white">The SeatFlow Zero-Lag Promise</h3>
              <p className="text-gray-400 max-w-xl">
                Live sub-millisecond seat hold protocol. When you tap a seat, it locks instantly with zero cart timeouts or duplicate bookings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-4xl text-cyan-400 font-bold leading-none">0.04s</span>
              <span className="text-sm text-gray-400 uppercase">Seat Locking Latency</span>
            </div>
            <div className="h-10 w-px bg-slate-600"></div>
            <div className="flex flex-col text-right">
              <span className="text-4xl text-blue-400 font-bold leading-none">100%</span>
              <span className="text-sm text-gray-400 uppercase">Dolby Atmos Certified</span>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && <TrailerModal onClose={() => setShowTrailer(false)} />}
    </div>
  );
}
