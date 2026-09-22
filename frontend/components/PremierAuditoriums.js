'use client';

export default function PremierAuditoriums() {
  const auditoriums = [
    {
      id: 1,
      name: 'PVR INOX IMAX Phoenix',
      location: 'Palladium Mall, Lower Parel • 2.4 km away',
      certification: 'Certified IMAX Laser',
      color: 'secondary',
      icon: 'theaters',
      specs: [
        { icon: 'speaker', label: '12-Ch Laser Sound' },
        { icon: 'airline_seat_recline_extra', label: 'Plush Recliners' },
        { icon: 'aspect_ratio', label: '1.43:1 Giant Screen' },
        { icon: 'local_parking', label: 'Valet Available' }
      ],
      showtimes: ['16:30', '19:45 (Filling)', '22:30']
    },
    {
      id: 2,
      name: 'Cinépolis VIP Grand Plaza',
      location: 'Bandra Kurla Complex (BKC) • 5.1 km away',
      certification: 'Ultra Luxury VIP',
      color: 'tertiary',
      icon: 'room_service',
      specs: [
        { icon: 'dinner_dining', label: 'At-Seat Gourmet' },
        { icon: 'airline_seat_flat', label: '180° Bed Loungers' },
        { icon: 'surround_sound', label: 'Dolby Atmos® 64' },
        { icon: 'wine_bar', label: 'Exclusive Lounge' }
      ],
      showtimes: ['17:15', '20:00', '23:15']
    },
    {
      id: 3,
      name: 'INOX Megaplex Laser',
      location: 'Inorbit Mall, Malad West • 8.3 km away',
      certification: 'RGB Laser Dolby',
      color: 'primary',
      icon: 'speaker_group',
      specs: [
        { icon: 'lightbulb', label: 'Barco 4K Laser' },
        { icon: 'surround_sound', label: 'Dolby Atmos Pro' },
        { icon: 'sensors', label: '4DX Vibrations' },
        { icon: 'accessible', label: 'Wheelchair Access' }
      ],
      showtimes: ['15:50', '18:40', '21:30']
    }
  ];

  return (
    <section className="w-full px-6 py-10 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">verified</span> Certified Acoustic Topography
          </div>
          <h2 className="text-3xl font-bold text-white">Premier Auditoriums Near You</h2>
          <p className="text-gray-400">Calibrated laser projection suites and acoustic architecture verified by SeatFlow.</p>
        </div>
        <a className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1" href="/movies">
          Explore 38 Theatres in Mumbai <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {auditoriums.map((auditorium) => (
          <div key={auditorium.id} className="rounded-2xl bg-slate-800 p-4 flex flex-col justify-between gap-4 shadow-lg relative overflow-hidden group">
            <div className={`absolute -right-12 -top-12 w-32 h-32 bg-${auditorium.color}-500/10 rounded-full blur-2xl group-hover:bg-${auditorium.color}-500/20 transition-all`}></div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className={`px-2 py-1 rounded bg-slate-700 text-cyan-400 text-xs uppercase font-bold`}>
                    {auditorium.certification}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{auditorium.name}</h3>
                  <p className="text-gray-400 text-sm">{auditorium.location}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <span className="material-symbols-outlined">{auditorium.icon}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-700 my-4">
                {auditorium.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-cyan-400">{spec.icon}</span>
                    <span>{spec.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Next screenings today:</span>
                <div className="flex flex-wrap gap-2">
                  {auditorium.showtimes.map((time, index) => (
                    <span
                      key={time}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        time.includes('(Filling)')
                          ? 'bg-blue-500 text-white font-bold shadow-sm'
                          : 'bg-slate-700 text-gray-300 hover:bg-blue-500 hover:text-white cursor-pointer'
                      }`}
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm flex items-center justify-center gap-1 transition-colors">
              View Floor Plan & Shows <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
