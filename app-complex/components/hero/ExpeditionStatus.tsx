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
          className="space-y-3 group cursor-pointer p-3 -m-3 rounded-xl hover:bg-alpineBlue/5 transition-all duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="p-1.5 rounded-lg bg-alpineBlue/10 group-hover:bg-alpineBlue/20 transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <MapPinIcon className="w-4 h-4 text-alpineBlue" />
            </motion.div>
            <h3 className="font-semibold text-charcoal group-hover:text-alpineBlue transition-colors duration-300">Current Position</h3>
          </div>
          <div className="relative overflow-hidden">
            <motion.div className="text-2xl font-bold text-charcoal mb-1 group-hover:text-alpineBlue transition-colors duration-300">
              📍 {current.altitude}
            </motion.div>
            <div className="text-sm text-stoneGray mb-2 leading-relaxed">
              {current.location}
            </div>
            <motion.div 
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-glacierBlue/10 text-glacierBlue text-xs font-medium group-hover:bg-glacierBlue/20 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-glacierBlue rounded-full mr-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {current.phase}
            </motion.div>
          </div>
        </motion.div>

        {/* Next Target */}
        <motion.div 
          className="space-y-3 group cursor-pointer p-3 -m-3 rounded-xl hover:bg-summitGold/5 transition-all duration-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="p-1.5 rounded-lg bg-summitGold/10 group-hover:bg-summitGold/20 transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <FireIcon className="w-4 h-4 text-summitGold" />
            </motion.div>
            <h3 className="font-semibold text-charcoal group-hover:text-summitGold transition-colors duration-300">Next Summit</h3>
          </div>
          <div className="relative overflow-hidden">
            <motion.div className="text-2xl font-bold text-charcoal mb-1 group-hover:text-summitGold transition-colors duration-300">
              🎯 {next.altitude}
            </motion.div>
            <div className="text-sm text-stoneGray mb-2 leading-relaxed">
              {next.target}
            </div>
            <motion.div 
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-summitGold/10 text-summitGold text-xs font-medium group-hover:bg-summitGold/20 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-summitGold rounded-full mr-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              ETA {next.eta}
            </motion.div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-summitGold/20 rounded-full animate-ping opacity-75"></div>
          </div>
        </motion.div>

        {/* Training Status */}
        <motion.div 
          className="space-y-3 group cursor-pointer p-3 -m-3 rounded-xl hover:bg-successGreen/5 transition-all duration-300"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="p-1.5 rounded-lg bg-successGreen/10 group-hover:bg-successGreen/20 transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <ClockIcon className="w-4 h-4 text-successGreen" />
            </motion.div>
            <h3 className="font-semibold text-charcoal group-hover:text-successGreen transition-colors duration-300">Training Progress</h3>
          </div>
          <div className="relative">
            {statsLoading ? (
              <motion.div 
                className="animate-pulse"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="h-8 bg-gray-200 rounded mb-2 w-16"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="text-2xl font-bold text-charcoal mb-1 group-hover:text-successGreen transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  📊 {training.daysActive}
                </motion.div>
                <div className="text-sm text-stoneGray mb-2 leading-relaxed">
                  days active • {training.distanceCompleted}
                </div>
                <motion.div 
                  className={clsx(
                    "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300",
                    training.status === 'on-track' && "bg-successGreen/10 text-successGreen group-hover:bg-successGreen/20",
                    training.status === 'ahead' && "bg-glacierBlue/10 text-glacierBlue group-hover:bg-glacierBlue/20",
                    training.status === 'behind' && "bg-warningOrange/10 text-warningOrange group-hover:bg-warningOrange/20"
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="mr-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {getStatusIcon(training.status)}
                  </motion.div>
                  {training.status.replace('-', ' ')}
                </motion.div>
                
                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div 
                    className={clsx(
                      "h-1.5 rounded-full",
                      training.status === 'on-track' && "bg-successGreen",
                      training.status === 'ahead' && "bg-glacierBlue", 
                      training.status === 'behind' && "bg-warningOrange"
                    )}
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: training.status === 'ahead' ? "90%" : 
                             training.status === 'on-track' ? "70%" : "45%" 
                    }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Weather Conditions */}
        <motion.div 
          className="space-y-3 group cursor-pointer p-3 -m-3 rounded-xl hover:bg-glacierBlue/5 transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="p-1.5 rounded-lg bg-glacierBlue/10 group-hover:bg-glacierBlue/20 transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: -10 }}
            >
              <CloudIcon className="w-4 h-4 text-glacierBlue" />
            </motion.div>
            <h3 className="font-semibold text-charcoal group-hover:text-glacierBlue transition-colors duration-300">Weather Conditions</h3>
          </div>
          <div className="relative overflow-hidden">
            <motion.div 
              className="text-2xl font-bold text-charcoal mb-1 group-hover:text-glacierBlue transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              🌡️ {conditions.temperature}
            </motion.div>
            <div className="text-sm text-stoneGray mb-2 leading-relaxed">
              💨 {conditions.wind} • {conditions.visibility}
            </div>
            <motion.div 
              className={clsx(
                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300",
                conditions.status === 'excellent' && "bg-successGreen/10 text-successGreen group-hover:bg-successGreen/20",
                conditions.status === 'good' && "bg-glacierBlue/10 text-glacierBlue group-hover:bg-glacierBlue/20", 
                conditions.status === 'poor' && "bg-warningOrange/10 text-warningOrange group-hover:bg-warningOrange/20",
                conditions.status === 'dangerous' && "bg-dangerRed/10 text-dangerRed group-hover:bg-dangerRed/20"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="mr-2"
                animate={{ 
                  scale: conditions.status === 'dangerous' ? [1, 1.2, 1] : [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: conditions.status === 'dangerous' ? 1 : 2, 
                  repeat: Infinity,
                  repeatDelay: conditions.status === 'dangerous' ? 0.5 : 1
                }}
              >
                {getStatusIcon(conditions.status)}
              </motion.div>
              {conditions.status}
            </motion.div>
            
            {/* Weather Animation Effect */}
            <motion.div
              className="absolute -top-2 -right-2 text-xs opacity-30"
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {conditions.status === 'excellent' && '☀️'}
              {conditions.status === 'good' && '⛅'}
              {conditions.status === 'poor' && '🌧️'}
              {conditions.status === 'dangerous' && '⛈️'}
            </motion.div>
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
        <motion.button 
          className="group relative overflow-hidden flex items-center space-x-2 px-5 py-3 bg-alpineBlue text-white rounded-xl font-medium transition-all duration-300 focus:ring-2 focus:ring-alpineBlue/20 focus:outline-none"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-alpineBlue via-blue-600 to-glacierBlue opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="relative z-10"
          >
            <MapPinIcon className="w-4 h-4" />
          </motion.div>
          <span className="relative z-10">View Route Map</span>
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-white/30 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.button>

        <motion.button 
          className="group relative overflow-hidden flex items-center space-x-2 px-5 py-3 bg-summitGold text-charcoal rounded-xl font-medium transition-all duration-300 focus:ring-2 focus:ring-summitGold/20 focus:outline-none"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-summitGold via-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10"
          >
            <SignalIcon className="w-4 h-4" />
          </motion.div>
          <span className="relative z-10">Live Updates</span>
          <motion.div
            className="absolute top-0 right-1 w-2 h-2 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.button>

        <motion.button 
          className="group relative overflow-hidden flex items-center space-x-2 px-5 py-3 bg-white/90 backdrop-blur-sm text-charcoal rounded-xl font-medium border border-gray-200 hover:border-glacierBlue/30 transition-all duration-300 focus:ring-2 focus:ring-glacierBlue/20 focus:outline-none"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white to-glacierBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <motion.div
            animate={{ 
              y: [0, -2, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="relative z-10"
          >
            <CloudIcon className="w-4 h-4 text-glacierBlue" />
          </motion.div>
          <span className="relative z-10 group-hover:text-glacierBlue transition-colors duration-300">Weather Forecast</span>
        </motion.button>

        {/* Real-time Status Indicator */}
        <div className="flex items-center space-x-2 px-4 py-3 bg-successGreen/5 border border-successGreen/20 rounded-xl">
          <motion.div 
            className="w-2 h-2 bg-successGreen rounded-full"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-successGreen">Live Data</span>
        </div>
      </motion.div>
    </motion.div>
  );
}