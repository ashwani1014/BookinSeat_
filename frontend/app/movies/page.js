'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { movieAPI } from '../../lib/api';
import { authAPI } from '../../lib/auth';

export default function Movies() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Releases');

  const genres = ['All Releases', 'Sci-Fi', 'Action', 'Drama', 'Romance', 'Hindi', 'English'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.getAllMovies(1, 20);
      if (response.success && response.data) {
        setMovies(response.data);
      } else {
        setError(response.message || 'Failed to fetch movies');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (movie) => {
    const targetMovieId = movie._id || movie.id;
    if (authAPI.isAuthenticated()) {
      router.push(`/movies/${targetMovieId}`);
    } else {
      router.push(`/login?redirect=/movies/${targetMovieId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMovies =
    selectedGenre === 'All Releases'
      ? movies
      : movies.filter((m) => {
          if (m.genre && m.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return true;
          if (Array.isArray(m.genres) && m.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))) return true;
          return false;
        });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-950 text-white py-8">
      <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Live Box Office
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Now Showing in Theatres</h1>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => {
            const movieId = movie._id || movie.id;
            return (
              <div
                key={movieId}
                onClick={() => handleBookClick(movie)}
                className="group relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:border-slate-700 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-950">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 bg-slate-800"
                    style={{ backgroundImage: movie.image || movie.poster ? `url('${movie.image || movie.poster}')` : undefined }}
                  >
                    {!(movie.image || movie.poster) && (
                      <div className="text-6xl flex items-center justify-center h-full">🎬</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md flex items-center gap-1 text-amber-400 border border-slate-800 text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">star</span>
                    <span>{movie.rating ? Number(movie.rating).toFixed(1) : '9.0'}</span>
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-xs font-bold shadow-md">
                    {movie.format || movie.genre || 'IMAX'}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <span>{movie.duration} min</span>
                      <span>•</span>
                      <span>{movie.genre}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {movie.description}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-800/80">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase">From</span>
                      <span className="text-base text-cyan-400 font-mono font-bold">
                        ${movie.pricePerSeat || 14}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookClick(movie);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                    >
                      Book Tickets
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800/50 text-[11px] text-slate-400 space-y-0.5">
                    <p className="truncate">🎭 {formatDate(movie.showtime)}</p>
                    <p className="truncate">📍 {movie.theater || 'Cinema Hall 1'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
