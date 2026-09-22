'use client';

export default function TrailerModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl bg-surface-container-high rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-space-sm flex items-center justify-between bg-surface-container">
          <span className="font-label-lg text-label-lg text-on-surface">Dune: Part Two — Official IMAX Trailer</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-headline-sm">close</span>
          </button>
        </div>
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-space-sm text-center p-space-lg">
            <span className="material-symbols-outlined text-display-hero text-secondary animate-pulse">movie</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">Theatrical Trailer Loading in 4K UHD...</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Mastered in Dolby Vision HDR and Dolby Atmos Sound</span>
          </div>
        </div>
      </div>
    </div>
  );
}
