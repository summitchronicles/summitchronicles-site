"use client";

import { lazy, Suspense } from 'react';
import { GPSPoint, ParticipantData } from '@/lib/expedition-tracker';

// Lazy load the heavy 3D component
const Route3DVisualization = lazy(() => import('./Route3DVisualization'));

interface Route3DVisualizationLazyProps {
  routeData: GPSPoint[];
  participants: ParticipantData[];
  className?: string;
}

// Loading fallback component
function Route3DFallback() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-charcoal/50 to-black/50 border border-white/10 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-summitGold mx-auto mb-4"></div>
        <p className="text-white/70 font-medium">Loading 3D Visualization...</p>
        <p className="text-white/50 text-sm mt-2">Preparing expedition route data</p>
      </div>
    </div>
  );
}

export default function Route3DVisualizationLazy(props: Route3DVisualizationLazyProps) {
  return (
    <Suspense fallback={<Route3DFallback />}>
      <Route3DVisualization {...props} />
    </Suspense>
  );
}