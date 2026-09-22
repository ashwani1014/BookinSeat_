'use client';

export default function QuickSearchBar() {
  return (
    <section className="relative z-20 w-full px-6 -mt-8 max-w-7xl mx-auto">
      <div className="p-4 rounded-2xl bg-slate-800/95 backdrop-blur-xl shadow-lg flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-1/3 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700">
          <span className="material-symbols-outlined text-cyan-400 text-lg">movie_filter</span>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-400 uppercase">Quick Search</label>
            <input
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-500"
              placeholder="Movies, Cinema halls, Actors..."
              type="text"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/4 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700">
          <span className="material-symbols-outlined text-blue-400 text-lg">calendar_month</span>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-400 uppercase">Show Date</label>
            <select className="w-full bg-transparent text-white text-sm focus:outline-none cursor-pointer">
              <option className="bg-slate-800">Today, 24 May</option>
              <option className="bg-slate-800">Tomorrow, 25 May</option>
              <option className="bg-slate-800">Sunday, 26 May</option>
              <option className="bg-slate-800">Monday, 27 May</option>
            </select>
          </div>
        </div>

        <div className="w-full lg:w-1/4 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700">
          <span className="material-symbols-outlined text-amber-400 text-lg">meeting_room</span>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-400 uppercase">Format & Experience</label>
            <select className="w-full bg-transparent text-white text-sm focus:outline-none cursor-pointer">
              <option className="bg-slate-800">All Projection Formats</option>
              <option className="bg-slate-800">IMAX with Laser</option>
              <option className="bg-slate-800">Dolby Atmos Recliner</option>
              <option className="bg-slate-800">4DX Extreme</option>
              <option className="bg-slate-800">VIP Luxury Lounge</option>
            </select>
          </div>
        </div>

        <button className="w-full lg:w-auto px-6 py-3 rounded-xl bg-cyan-400 text-slate-900 font-medium flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/35 flex-shrink-0">
          <span className="material-symbols-outlined text-lg">search</span>
          <span>Find Theatres</span>
        </button>
      </div>
    </section>
  );
}
