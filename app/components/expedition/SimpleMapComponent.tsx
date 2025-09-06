"use client";

import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
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
    <div className="h-80 rounded-lg overflow-hidden">
      <MapContainer
        center={[currentPosition.lat, currentPosition.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
        />
        
        {/* Current position */}
        <Marker position={[currentPosition.lat, currentPosition.lng]} />
        
        {/* Route */}
        {route.length > 0 && (
          <Polyline
            positions={route.map(point => [point.lat, point.lng])}
            color="#3b82f6"
            weight={3}
            opacity={0.8}
          />
        )}
        
        {/* Participant positions */}
        {participants.map(participant => (
          participant.position && (
            <Marker
              key={participant.id}
              position={[participant.position.lat, participant.position.lng]}
            />
          )
        ))}
      </MapContainer>
    </div>
  );
}