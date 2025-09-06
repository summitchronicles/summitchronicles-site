"use client";

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, OrbitControls, Stars, Text, Billboard } from '@react-three/drei';
import { Vector3, BufferGeometry, Float32BufferAttribute } from 'three';
import { motion } from 'framer-motion';
import { GlassCard } from '@/app/components/ui';
import { GPSPoint, ParticipantData } from '@/lib/expedition-tracker';

interface Route3DVisualizationProps {
  routeData: GPSPoint[];
  participants: ParticipantData[];
  className?: string;
}

// Convert GPS coordinates to 3D scene coordinates
function gpsTo3D(gpsPoints: GPSPoint[]): Vector3[] {
  if (gpsPoints.length === 0) return [];
  
  // Find bounds
  const lats = gpsPoints.map(p => p.lat);
  const lngs = gpsPoints.map(p => p.lng);
  const alts = gpsPoints.map(p => p.altitude);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minAlt = Math.min(...alts);
  const maxAlt = Math.max(...alts);
  
  // Scale factor for positioning
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;
  const altRange = maxAlt - minAlt || 100;
  
  return gpsPoints.map(point => new Vector3(
    ((point.lng - minLng) / lngRange - 0.5) * 20, // X: longitude
    (point.altitude - minAlt) / altRange * 10,     // Y: altitude (scaled)
    -((point.lat - minLat) / latRange - 0.5) * 20  // Z: latitude (negated for proper orientation)
  ));
}

// 3D Route Line Component
function RouteTrail({ points }: { points: Vector3[] }) {
  const lineRef = useRef<any>();
  
  useFrame(({ clock }) => {
    if (lineRef.current) {
      // Animate the line material
      const time = clock.getElapsedTime();
      if (lineRef.current.material) {
        lineRef.current.material.opacity = 0.7 + Math.sin(time * 2) * 0.2;
      }
    }
  });
  
  if (points.length < 2) return null;
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color="#3B82F6"
      lineWidth={3}
      transparent
      opacity={0.8}
    />
  );
}

// Animated Mountain Peaks
function MountainPeaks({ routeData }: { routeData: GPSPoint[] }) {
  const peaks = routeData.filter((_, index) => 
    index === 0 || // Start point
    index === routeData.length - 1 || // End point
    (index > 0 && index < routeData.length - 1 && 
     routeData[index].altitude > routeData[index - 1].altitude &&
     routeData[index].altitude > routeData[index + 1].altitude) // Local maxima
  );
  
  const points3D = gpsTo3D(peaks);
  
  return (
    <>
      {points3D.map((point, index) => {
        const peak = peaks[index];
        const isStart = index === 0;
        const isEnd = index === peaks.length - 1 || peaks[index] === routeData[routeData.length - 1];
        
        return (
          <group key={index} position={point}>
            {/* Peak marker */}
            <mesh>
              <coneGeometry args={[0.3, 1, 8]} />
              <meshStandardMaterial
                color={isStart ? "#10B981" : isEnd ? "#EF4444" : "#F59E0B"}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Peak label */}
            <Billboard follow={true}>
              <Text
                position={[0, 1.5, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {isStart ? "START" : isEnd ? "SUMMIT" : `${Math.round(peak.altitude)}m`}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}

// Participant Avatars
function ParticipantAvatars({ participants, routeData }: { participants: ParticipantData[]; routeData: GPSPoint[] }) {
  const participantPositions = participants.map(participant => {
    if (participant.position) {
      return gpsTo3D([participant.position])[0];
    } else {
      // Place at start of route if no position
      return routeData.length > 0 ? gpsTo3D([routeData[0]])[0] : new Vector3(0, 0, 0);
    }
  });
  
  return (
    <>
      {participantPositions.map((position, index) => {
        const participant = participants[index];
        const color = participant.role === 'leader' ? '#3B82F6' : 
                     participant.role === 'guide' ? '#10B981' : '#F59E0B';
        
        return (
          <group key={participant.id} position={position}>
            {/* Avatar sphere */}
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} transparent opacity={0.9} />
            </mesh>
            
            {/* Pulsing ring for active participants */}
            {participant.status === 'active' && (
              <AnimatedRing color={color} />
            )}
            
            {/* Name label */}
            <Billboard follow={true}>
              <Text
                position={[0, 0.8, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {participant.name}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}

// Animated ring component
function AnimatedRing({ color }: { color: string }) {
  const ringRef = useRef<any>();
  
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const time = clock.getElapsedTime();
      ringRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.3);
      ringRef.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.2;
    }
  });
  
  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[0.3, 0.4, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

// Camera controller
function CameraController({ routeData }: { routeData: GPSPoint[] }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (routeData.length > 0) {
      // Position camera to view the entire route
      const points = gpsTo3D(routeData);
      const center = points.reduce((acc, point) => acc.add(point), new Vector3()).divideScalar(points.length);
      
      camera.position.set(center.x + 15, center.y + 10, center.z + 15);
      camera.lookAt(center);
    }
  }, [routeData, camera]);
  
  return null;
}

// Main 3D Scene Component  
function Route3DScene({ routeData, participants }: { routeData: GPSPoint[]; participants: ParticipantData[] }) {
  const points3D = gpsTo3D(routeData);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* Camera control */}
      <CameraController routeData={routeData} />
      <OrbitControls enableZoom enablePan enableRotate />
      
      {/* Route visualization */}
      {points3D.length > 1 && <RouteTrail points={points3D} />}
      
      {/* Mountain peaks */}
      <MountainPeaks routeData={routeData} />
      
      {/* Participant avatars */}
      <ParticipantAvatars participants={participants} routeData={routeData} />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1F2937" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

// Loading fallback
function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-8 h-8 border-2 border-alpineBlue border-t-transparent rounded-full"
      />
      <span className="ml-3 text-white">Loading 3D visualization...</span>
    </div>
  );
}

// Main component
export default function Route3DVisualization({ 
  routeData = [], 
  participants = [], 
  className = "" 
}: Route3DVisualizationProps) {
  const [is3DSupported, setIs3DSupported] = useState(true);
  
  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIs3DSupported(!!gl);
    } catch (e) {
      setIs3DSupported(false);
    }
  }, []);
  
  if (!is3DSupported) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">3D Route Visualization</h3>
        <div className="text-center py-8">
          <p className="text-gray-300 mb-2">3D visualization not supported</p>
          <p className="text-sm text-gray-400">
            Your browser doesn&apos;t support WebGL. Please use a modern browser for the full 3D experience.
          </p>
        </div>
      </GlassCard>
    );
  }
  
  if (routeData.length === 0) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">3D Route Visualization</h3>
        <div className="text-center py-8">
          <p className="text-gray-300">No route data available</p>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">3D Route Visualization</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>🟢 Start</span>
          <span>🔴 Summit</span>
          <span>🟡 Waypoint</span>
        </div>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden bg-black/20">
        <Canvas>
          <Suspense fallback={<SceneLoader />}>
            <Route3DScene routeData={routeData} participants={participants} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        🖱️ Click and drag to rotate • Scroll to zoom • Right-click and drag to pan
      </div>
    </GlassCard>
  );
}