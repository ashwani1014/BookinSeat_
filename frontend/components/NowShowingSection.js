'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { movieAPI } from '../lib/api';
import { authAPI } from '../lib/auth';

export default function NowShowingSection() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('All Releases');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = ['All Releases', 'Sci-Fi', 'Action', 'Drama', 'Romance', 'Hindi', 'English'];

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const res = await movieAPI.getAllMovies(1, 20);
      if (res.success && res.data) {
        setMovies(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (e, movie) => {
    e.preventDefault();
    const targetMovieId = movie._id || movie.id;
    if (authAPI.isAuthenticated()) {
      router.push(`/movies/${targetMovieId}`);
    } else {
      router.push(`/login?redirect=/movies/${targetMovieId}`);
    }
  };

  const filteredMovies =
    selectedGenre === 'All Releases'
      ? movies
      : movies.filter((m) => {
          if (m.genre && m.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return true;
          if (Array.isArray(m.genres) && m.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))) return true;
          return false;
        });

  return (
    <section className="w-full px-6 py-10 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Live Box Office
          </div>
          <h2 className="text-3xl font-bold text-white">Now Showing in Theatres</h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedGenre === genre
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => {
          const movieId = movie._id || movie.id;
          return (
            <div
              key={movieId}
              onClick={(e) => handleBookClick(e, movie)}
              className="group relative rounded-2xl bg-slate-800 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-900">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${movie.image || movie.poster}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-black/40"></div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md flex items-center gap-1 text-amber-400">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: 'FILL 1' }}>star</span>
                  <span className="text-sm font-bold">{movie.rating}</span>
                </div>

                <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-cyan-400 text-slate-900 text-sm font-bold shadow-md">
                  {movie.format || movie.genre || 'IMAX'}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <span>{movie.languages || 'English, Hindi'}</span> • <span>{movie.duration}m</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-1 rounded bg-slate-700 text-gray-400 text-xs">
                      {movie.genre || 'Action'}
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-700 text-gray-400 text-xs">
                      {movie.theater || 'Cinema Hall 1'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">From</span>
                    <span className="text-lg text-cyan-400 font-bold">${movie.pricePerSeat || movie.price || 14}</span>
                  </div>
                  <button
                    onClick={(e) => handleBookClick(e, movie)}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 font-medium transition-all shadow-lg shadow-blue-500/30"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
