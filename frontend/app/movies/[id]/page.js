'use client';
import { Suspense } from 'react';
import SeatSelectionPage from '../../../components/SeatSelectionPage';

export default function MovieDetails({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mx-auto"></div>
        </div>
      }
    >
      <SeatSelectionPage movieId={params?.id} />
    </Suspense>
  );
}
