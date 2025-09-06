"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GlassCard } from "@/app/components/ui";
import { GPSPoint, HealthMetrics, WeatherData } from "@/lib/expedition-tracker";

interface ExpeditionChartsProps {
  routeData?: GPSPoint[];
  healthData?: HealthMetrics[];
  weatherData?: WeatherData[];
  className?: string;
}

export default function ExpeditionCharts({ 
  routeData = [], 
  healthData = [], 
  weatherData = [], 
  className = "" 
}: ExpeditionChartsProps) {
  
  // Transform route data for altitude chart
  const altitudeData = routeData.map((point, index) => ({
    distance: index * 0.5, // Approximate distance in km
    altitude: point.altitude,
    time: new Date(point.timestamp).toLocaleTimeString(),
  }));

  // Transform health data for heart rate chart
  const heartRateData = healthData.map((health, index) => ({
    time: new Date().getTime() - (healthData.length - index) * 30000, // 30 second intervals
    heartRate: health.heartRate || 0,
    oxygenSat: health.oxygenSaturation || 0,
    temperature: health.temperature || 0,
  })).map(item => ({
    ...item,
    time: new Date(item.time).toLocaleTimeString(),
  }));

  // Transform weather data for conditions chart
  const weatherChartData = weatherData.map((weather, index) => ({
    time: new Date().getTime() - (weatherData.length - index) * 300000, // 5 minute intervals
    temperature: weather.temperature,
    windSpeed: weather.windSpeed,
    humidity: weather.humidity,
    pressure: weather.pressure,
  })).map(item => ({
    ...item,
    time: new Date(item.time).toLocaleTimeString(),
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-charcoal/90 backdrop-blur-sm border border-alpineBlue/30 rounded-lg p-3 text-sm">
          <p className="text-white font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Altitude Profile */}
      {altitudeData.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Elevation Profile</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={altitudeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="distance" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Altitude (m)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="altitude" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Health Metrics */}
      {heartRateData.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Health Monitoring</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Heart Rate"
                  unit=" bpm"
                />
                <Line 
                  type="monotone" 
                  dataKey="oxygenSat" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="O2 Saturation"
                  unit="%"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Weather Conditions */}
      {weatherChartData.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weather Conditions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Temperature"
                  unit="°C"
                />
                <Line 
                  type="monotone" 
                  dataKey="windSpeed" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  name="Wind Speed"
                  unit=" km/h"
                />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Pressure"
                  unit=" hPa"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Mock Data Notice */}
      <GlassCard className="p-4 border-l-4 border-summitGold">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-summitGold rounded-full animate-pulse" />
          <h4 className="text-sm font-medium text-summitGold">Live Demo Mode</h4>
        </div>
        <p className="text-xs text-gray-300 mt-1">
          This dashboard is displaying simulated expedition data for demonstration purposes. 
          Real expeditions would connect to actual GPS devices, health monitors, and weather stations.
        </p>
      </GlassCard>
    </div>
  );
}