
'use client';
import { useRouter } from 'next/navigation';
import { authAPI } from '../lib/auth';

export default function HeroSection({ onTrailerClick }) {
  const router = useRouter();

  const handleBookTickets = () => {
    const targetMovieId = 'movie_1';
    if (authAPI.isAuthenticated()) {
      router.push(`/movies/${targetMovieId}`);
    } else {
      router.push(`/login?redirect=/movies/${targetMovieId}`);
    }
  };

  return (
    <section className="relative w-full -mt-20 overflow-hidden bg-slate-900">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCnlR0XXVMrRwU7A9td6m3ExxAKN6oTKCcmavcPPJpmEyLlThzZFeTrqCXoBCUOl04WLumnCIETyxefnW6cycJ4p2NjB5KW0INjmVaxT1sr1eXWh4U617MFHy7uae_6COASKbTb0fJqZKdfN0nIdAmtitZihVVgiLS6_tCsPIbrlMgWrgYRdGlL-dQFtYmPqJOpAK585X1JF75smHa4QMEDmnrSpFjQ0i3UcEy3w1vJbWan9xSXnLWdA')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full px-6 pt-40 pb-20 max-w-7xl mx-auto flex flex-col justify-end min-h-[85vh]">
        {/* Movie Title & Info */}
        <div className="max-w-3xl flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-semibold">
              <span className="material-symbols-outlined text-sm">star</span>
              <span>9.4</span>
            </div>
            <span className="text-slate-300 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-cyan-400">schedule</span> 2h 46m
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-300">Sci-Fi / Adventure</span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold">IMAX Laser</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight uppercase drop-shadow-2xl">
            Dune: Part Two
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl line-clamp-3 leading-relaxed">
            Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his family in a battle across the sands of Arrakis.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleBookTickets}
            className="group px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-xl shadow-blue-500/30 hover:scale-105 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">event_seat</span>
            <span>Book Tickets</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>

          <button
            onClick={onTrailerClick}
            className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold flex items-center gap-2 backdrop-blur-lg border border-slate-700/80 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-xl text-cyan-400">play_circle</span>
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>
    </section>
  );
}
