"use client";

import { motion } from "framer-motion";
import {
  MapPinIcon,
  FireIcon,
  ClockIcon,
  CloudIcon,
  SignalIcon
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

interface ExpeditionStatusProps {
  className?: string;
}

interface StravaStats {
  runs: {
    count: number;
    distance_km: number;
    moving_sec: number;
  };
  hikes: {
    count: number;
    distance_km: number;
    elevation_m: number;
    moving_sec: number;
  };
  rides: {
    count: number;
    distance_km: number;
    moving_sec: number;
  };
  overall: {
    elevation_m: number;
  };
}

interface ExpeditionData {
  current: {
    location: string;
    altitude: string;
    phase: string;
  };
  next: {
    target: string;
    altitude: string;
    eta: string;
  };
  training: {
    daysActive: number;
    distanceCompleted: string;
    status: 'on-track' | 'ahead' | 'behind';
  };
  conditions: {
    temperature: string;
    wind: string;
    visibility: string;
    status: 'excellent' | 'good' | 'poor' | 'dangerous';
  };
}

// Mock expedition data - in real app this would come from API
const mockExpeditionData: ExpeditionData = {
  current: {
    location: "Base Camp - Everest North Col Route",
    altitude: "5,150m",
    phase: "Acclimatization"
  },
  next: {
    target: "Advanced Base Camp",
    altitude: "6,400m",
    eta: "5 days"
  },
  training: {
    daysActive: 287,
    distanceCompleted: "2,847km",
    status: 'on-track'
  },
  conditions: {
    temperature: "-15°C",
    wind: "45km/h NE", 
    visibility: "Clear skies",
    status: 'good'
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-successGreen';
    case 'good': return 'text-glacierBlue';
    case 'poor': return 'text-warningOrange';
    case 'dangerous': return 'text-dangerRed';
    case 'on-track': return 'text-successGreen';
    case 'ahead': return 'text-glacierBlue';
    case 'behind': return 'text-warningOrange';
    default: return 'text-stoneGray';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': case 'good': case 'on-track': case 'ahead':
      return '✅';
    case 'poor': case 'behind':
      return '⚠️';
    case 'dangerous':
      return '🚨';
    default:
      return '📍';
  }
};

export default function ExpeditionStatus({ className = "" }: ExpeditionStatusProps) {
  const [stravaStats, setStravaStats] = useState<StravaStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStravaStats = async () => {
      try {
        const response = await fetch('/api/strava/stats');
        const data = await response.json();
        setStravaStats(data);
      } catch (error) {
        console.error('Failed to fetch Strava stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchStravaStats();
  }, []);

  // Calculate real training data from Strava
  const getRealTrainingData = () => {
    if (!stravaStats) {
      return mockExpeditionData.training;
    }
    
    const totalActivities = stravaStats.runs.count + stravaStats.hikes.count + stravaStats.rides.count;
    const totalDistance = Math.round(stravaStats.runs.distance_km + stravaStats.hikes.distance_km + stravaStats.rides.distance_km);
    
    // Calculate days active (estimate: assume 1 activity every 1.5 days on average for active days)
    const daysActive = Math.min(Math.round(totalActivities * 1.5), 365); // More realistic estimate
    
    // Determine status based on activity level
    let status: 'on-track' | 'ahead' | 'behind' = 'on-track';
    if (totalActivities > 200) status = 'ahead';
    else if (totalActivities < 100) status = 'behind';
    
    return {
      daysActive,
      distanceCompleted: `${totalDistance.toLocaleString()}km`,
      status
    };
  };

  // Generate dynamic expedition data based on training progress
  const getDynamicExpeditionData = () => {
    if (!stravaStats) {
      return mockExpeditionData;
    }

    const totalActivities = stravaStats.runs.count + stravaStats.hikes.count + stravaStats.rides.count;
    const totalElevation = stravaStats.overall.elevation_m;
    
    // Determine current phase based on training progress
    let currentPhase = "Base Training";
    let currentLocation = "Home Base - Training Phase";
    let currentAltitude = "1,200m";
    let nextTarget = "First Training Camp";
    let nextAltitude = "2,500m";
    let eta = "2 months";

    if (totalActivities > 500 && totalElevation > 50000) {
      currentPhase = "Advanced Training";
      currentLocation = "High Altitude Training - Banff";
      currentAltitude = "1,400m";
      nextTarget = "Everest Base Camp";
      nextAltitude = "5,364m";
      eta = "6 months";
    } else if (totalActivities > 300 && totalElevation > 30000) {
      currentPhase = "Altitude Acclimatization";
      currentLocation = "Mountain Training - Local Peaks";
      currentAltitude = "1,300m";
      nextTarget = "High Altitude Camp";
      nextAltitude = "3,500m";
      eta = "4 months";
    } else if (totalActivities > 100) {
      currentPhase = "Endurance Building";
      currentLocation = "Training Progression - Local Trails";
      currentAltitude = "1,200m";
      nextTarget = "Mountain Training";
      nextAltitude = "2,000m";
      eta = "3 months";
    }

    return {
      current: {
        location: currentLocation,
        altitude: currentAltitude,
        phase: currentPhase
      },
      next: {
        target: nextTarget,
        altitude: nextAltitude,
        eta: eta
      },
      conditions: {
        temperature: "-5°C",
        wind: "15km/h SW",
        visibility: "Partly cloudy",
        status: 'good' as const
      }
    };
  };

  const dynamicExpeditionData = getDynamicExpeditionData();
  const { current, next, conditions } = dynamicExpeditionData;
  const training = getRealTrainingData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={clsx(
        "bg-snowWhite/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl",
        "p-6 max-w-4xl w-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-successGreen rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold text-charcoal">
            Live Expedition Status
          </h2>
        </div>
        <div className="text-sm text-stoneGray">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Location */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-5 h-5 text-alpineBlue" />
            <h3 className="font-semibold text-charcoal">Current</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal mb-1">
              📍 {current.altitude}
            </div>
            <div className="text-sm text-stoneGray mb-1">
              {current.location}
            </div>
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-glacierBlue/10 text-glacierBlue text-xs font-medium">
              {current.phase}
            </div>
          </div>
        </motion.div>

        {/* Next Target */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <FireIcon className="w-5 h-5 text-summitGold" />
            <h3 className="font-semibold text-charcoal">Next Target</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal mb-1">
              🎯 {next.altitude}
            </div>
            <div className="text-sm text-stoneGray mb-1">
              {next.target}
            </div>
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-summitGold/10 text-summitGold text-xs font-medium">
              ETA {next.eta}
            </div>
          </div>
        </motion.div>

        {/* Training Status */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-successGreen" />
            <h3 className="font-semibold text-charcoal">Training</h3>
          </div>
          <div>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2 w-16"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-charcoal mb-1">
                  📊 {training.daysActive}
                </div>
                <div className="text-sm text-stoneGray mb-1">
                  days active • {training.distanceCompleted}
                </div>
                <div className={clsx(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  training.status === 'on-track' && "bg-successGreen/10 text-successGreen",
                  training.status === 'ahead' && "bg-glacierBlue/10 text-glacierBlue",
                  training.status === 'behind' && "bg-warningOrange/10 text-warningOrange"
                )}>
                  {getStatusIcon(training.status)} {training.status.replace('-', ' ')}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Weather Conditions */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center space-x-2">
            <CloudIcon className="w-5 h-5 text-glacierBlue" />
            <h3 className="font-semibold text-charcoal">Conditions</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal mb-1">
              🌡️ {conditions.temperature}
            </div>
            <div className="text-sm text-stoneGray mb-1">
              💨 {conditions.wind} • {conditions.visibility}
            </div>
            <div className={clsx(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              conditions.status === 'excellent' && "bg-successGreen/10 text-successGreen",
              conditions.status === 'good' && "bg-glacierBlue/10 text-glacierBlue", 
              conditions.status === 'poor' && "bg-warningOrange/10 text-warningOrange",
              conditions.status === 'dangerous' && "bg-dangerRed/10 text-dangerRed"
            )}>
              {getStatusIcon(conditions.status)} {conditions.status}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <button className="flex items-center space-x-2 px-4 py-2 bg-alpineBlue text-white rounded-lg hover:bg-blue-700 transition-all duration-normal hover:scale-105 focus:ring-2 focus:ring-alpineBlue/20">
          <MapPinIcon className="w-4 h-4" />
          <span>View Route Map</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-summitGold text-charcoal rounded-lg hover:bg-yellow-400 transition-all duration-normal hover:scale-105 focus:ring-2 focus:ring-summitGold/20">
          <SignalIcon className="w-4 h-4" />
          <span>Live Updates</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-all duration-normal hover:scale-105 focus:ring-2 focus:ring-gray-300">
          <CloudIcon className="w-4 h-4" />
          <span>Weather Forecast</span>
        </button>
      </motion.div>
    </motion.div>
  );
}