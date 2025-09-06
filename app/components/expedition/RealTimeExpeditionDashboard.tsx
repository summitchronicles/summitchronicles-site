"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPinIcon, 
  SignalIcon,
  ClockIcon,
  UserGroupIcon,
  CloudIcon
} from "@heroicons/react/24/outline";
import { GlassCard } from "@/app/components/ui";
import { ExpeditionTracker, ExpeditionData, GPSPoint, ParticipantData, HealthMetrics, WeatherData } from "@/lib/expedition-tracker";
import ExpeditionCharts from "./ExpeditionCharts";
import Route3DVisualization from "./Route3DVisualization";
import HealthMonitoringPanel from "./HealthMonitoringPanel";

// Dynamic import for Leaflet to avoid SSR issues
const SimpleMapComponent = dynamic(() => import('./SimpleMapComponent'), { 
  ssr: false,
  loading: () => <div className="h-80 bg-gray-800/20 rounded-lg animate-pulse flex items-center justify-center">
    <span className="text-gray-400">Loading map...</span>
  </div>
});

interface RealTimeExpeditionDashboardProps {
  expeditionId: string;
  className?: string;
}

export default function RealTimeExpeditionDashboard({ 
  expeditionId, 
  className = "" 
}: RealTimeExpeditionDashboardProps) {
  const [expeditionData, setExpeditionData] = useState<ExpeditionData | null>(null);
  const [currentPosition, setCurrentPosition] = useState<GPSPoint | null>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const trackerRef = useRef<ExpeditionTracker | null>(null);

  useEffect(() => {
    // Initialize expedition tracker
    const tracker = new ExpeditionTracker(expeditionId);
    trackerRef.current = tracker;

    // Set up event listeners
    tracker.onDataUpdated((data) => {
      setExpeditionData(data);
    });

    tracker.onPositionUpdated((position) => {
      setCurrentPosition(position);
    });

    tracker.onParticipantsUpdated((participantData) => {
      setParticipants(participantData);
    });

    tracker.onWeatherUpdated((weatherData) => {
      setWeather(weatherData);
    });

    tracker.onConnectionChanged((connected) => {
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    });

    // Connect to tracking service
    const connectTracker = async () => {
      try {
        await tracker.connect();
        await tracker.startTracking({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        });
      } catch (error) {
        console.error('Failed to initialize expedition tracking:', error);
        setConnectionStatus('disconnected');
      }
    };

    connectTracker();

    // Cleanup
    return () => {
      if (trackerRef.current) {
        trackerRef.current.disconnect();
      }
    };
  }, [expeditionId]);

  const formatDuration = (startTime: number): string => {
    const duration = Date.now() - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };


  if (!expeditionData) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-charcoal to-black p-6 ${className}`}>
        <GlassCard className="p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-12 h-12 border-4 border-alpineBlue border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-white mb-2">
            Connecting to Expedition
          </h3>
          <p className="text-gray-400">
            Establishing real-time connection...
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-charcoal to-black p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {expeditionData.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>Duration: {formatDuration(expeditionData.startTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-4 h-4" />
                <span>{participants.length} participants</span>
              </div>
              <div className="flex items-center space-x-1">
                <SignalIcon className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
                <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            expeditionData.status === 'active' ? 'bg-green-500/20 text-green-400' :
            expeditionData.status === 'emergency' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {expeditionData.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-96">
            <h3 className="text-lg font-semibold text-white mb-4">Live Position</h3>
            {currentPosition && (
              <SimpleMapComponent 
                currentPosition={currentPosition}
                route={expeditionData.route}
                participants={participants}
              />
            )}
          </GlassCard>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Current Position */}
          {currentPosition && (
            <GlassCard className="p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">CURRENT POSITION</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Latitude:</span>
                  <span className="text-white font-mono">{currentPosition.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Longitude:</span>
                  <span className="text-white font-mono">{currentPosition.lng.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Altitude:</span>
                  <span className="text-white font-mono">{currentPosition.altitude}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Accuracy:</span>
                  <span className="text-white">±{currentPosition.accuracy}m</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Weather */}
          {weather && (
            <GlassCard className="p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                <CloudIcon className="w-4 h-4 mr-2" />
                WEATHER CONDITIONS
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Temperature:</span>
                  <span className="text-white">{weather.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Wind:</span>
                  <span className="text-white">{weather.windSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Humidity:</span>
                  <span className="text-white">{weather.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Pressure:</span>
                  <span className="text-white">{weather.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Visibility:</span>
                  <span className="text-white">{(weather.visibility / 1000).toFixed(1)} km</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Enhanced Health Monitoring */}
      <div className="mt-8">
        <HealthMonitoringPanel 
          participants={participants}
          onEmergencyAlert={(alert) => {
            console.log('Emergency alert:', alert);
            // In a real implementation, this would trigger emergency protocols
          }}
        />
      </div>

      {/* 3D Route Visualization */}
      <div className="mt-8">
        <Route3DVisualization 
          routeData={expeditionData.route}
          participants={participants}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Analytics & Trends</h3>
        <ExpeditionCharts 
          routeData={expeditionData.route}
          healthData={participants.map(p => p.health)}
          weatherData={weather ? [weather] : []}
        />
      </div>
    </div>
  );
}