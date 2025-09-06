"use client";

import { GPSPoint, ParticipantData } from '@/lib/expedition-tracker';

interface SimpleMapComponentProps {
  currentPosition: GPSPoint;
  route: GPSPoint[];
  participants: ParticipantData[];
}

export default function SimpleMapComponent({ 
  currentPosition, 
  route, 
  participants 
}: SimpleMapComponentProps) {
  return (
    <div className="h-80 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-sm">Map Component</div>
        <div className="text-xs mt-1">
          Position: {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
        </div>
        <div className="text-xs">Participants: {participants.length}</div>
      </div>
    </div>
  );
}