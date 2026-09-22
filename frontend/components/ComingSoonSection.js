'use client';

export default function ComingSoonSection() {
  const comingSoon = [
    {
      id: 1,
      title: 'Gladiator II',
      date: '15 NOV 2025',
      genre: 'Action / Historical Drama',
      director: 'Ridley Scott',
      description: 'Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by tyrannical emperors.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0w15JJ-dXuSbHtT2-hKbBMxET56wCLHVpUFD6G9yzfojsRP2HrXI2AVEinTOqAAt1wjtXWDapY5AieIJb-WYl5D58C3ircU3QfAaLzSMuOnYgRjR0Sp6qjfitFMUXqVxlW5L2aGm5Leq8bKaDMjKeevUaRa0RwyKzYtx4zXVaEFsZKosGkyRG1mk2ocFeWxzd7K_cnKjHQaFThnrZjusFQMZCLbcV_9u9-YwYYbDgh8EZLz99BBrNsw'
    },
    {
      id: 2,
      title: 'Megalopolis',
      date: '27 DEC 2025',
      genre: 'Sci-Fi / Political',
      director: 'F.F. Coppola',
      description: 'An idealistic visionary architect battles a corrupt conservative mayor for control over the future rebuilding of a decaying metropolis.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Fu4pPQ3ZYacwqwqvqz8GBs9P6MQNxxpJ233wjyIY_k85_wdSPO3UCaG1F4_MFoxz7EHyRo42Yef9-VItMhvexplsBoK2Dt0uoiTThLcoQOVWQu-Gdta5yg8L-JdCSamZ28tGWzbVdKtpf7MMhmpM8jS5e1qIIzk0aVhBOxqjCAcEFvek4pwVhbDGkO4zxoZNk9WeN3wAXUAA89vSBfNnb52G8njgdrQVJhrH11-bB2PqQ3dG8Tmiig'
    },
    {
      id: 3,
      title: 'Alien: Romulus',
      date: '16 AUG 2025',
      genre: 'Sci-Fi / Horror',
      director: 'Fede Álvarez',
      description: 'A group of young space scavengers in a derelict research station confront the terrifying life-form known as the Xenomorph.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjC27r-vcjazO41973LhKLUPDH1aiGQ5sVDKKb2eM_8Cc2iJTafgfZoLH-Zf7bYGB0nrML-TgH01z-87dszuYlGCsUjHuv1j60et6Wx3xu8KKIZjthTw2oYohs6Z-Td03NMWpYtt9NmisrmrVk90o7siUyOGWTx9IGsfOK-nTnP36Ghs-mb4SnFibLLfVR9jWxfDR2ODDXFxNnQfpma6Djp_u1mB8Gq7-_PTd52woVhfsAsJjx7WZPyg'
    }
  ];

  return (
    <section className="w-full bg-slate-800 py-10 overflow-hidden">
      <div className="w-full px-6 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amber-400 text-sm uppercase tracking-wider">Anticipated Premieres</span>
            <h2 className="text-3xl font-bold text-white">Coming Soon to Theatres</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors shadow-sm">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors shadow-sm">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comingSoon.map((movie) => (
            <div key={movie.id} className="rounded-2xl bg-slate-700 p-4 flex flex-col justify-between gap-4 shadow-md group hover:bg-slate-600 transition-colors">
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${movie.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-700 via-transparent to-black/30"></div>
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded bg-slate-900/80 backdrop-blur-md text-amber-400 text-sm font-bold">
                  {movie.date}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-gray-400 text-sm mb-1">
                  <span>{movie.genre}</span>
                  <span>{movie.director}</span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{movie.title}</h4>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{movie.description}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="flex-1 py-2 rounded-xl bg-slate-600 group-hover:bg-slate-500 text-white text-sm flex items-center justify-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-cyan-400">notifications_active</span> Remind Me
                </button>
                <button className="p-2 rounded-xl bg-slate-600 group-hover:bg-slate-500 text-gray-400 hover:text-white transition-colors" title="Watch Teaser">
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
