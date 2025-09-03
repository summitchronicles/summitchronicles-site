"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  BoltIcon, 
  ChartBarIcon, 
  ClockIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  FireIcon
} from "@heroicons/react/24/outline";

interface Activity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date: string;
  average_speed: number;
}

const ACTIVITY_COLORS: Record<string, string> = {
  'Run': 'from-orange-500 to-red-500',
  'Ride': 'from-blue-500 to-cyan-500',
  'Hike': 'from-green-500 to-emerald-600',
  'Walk': 'from-green-400 to-green-500',
  'WeightTraining': 'from-red-600 to-pink-600',
  'Workout': 'from-purple-500 to-violet-500',
};

const ACTIVITY_ICONS: Record<string, string> = {
  'Run': '🏃‍♂️',
  'Ride': '🚴‍♂️',
  'Hike': '🥾',
  'Walk': '🚶‍♂️',
  'WeightTraining': '💪',
  'Workout': '🏋️‍♂️',
};

export default function ModernTraining() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/strava/recent", { cache: "no-store" });
      const data = await response.json();
      
      if (data.ok && data.activities) {
        setActivities(data.activities.slice(0, 6)); // Show only 6 for clean layout
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(1)}km` : `${meters}m`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-summitGold/10 border border-summitGold/20 rounded-full px-4 py-2 text-sm text-summitGold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <FireIcon className="w-4 h-4" />
            Training Progress
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Peak <span className="text-summitGold">Performance</span>
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Every step, every breath, every moment of training brings us closer to the summit.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: CalendarDaysIcon, label: "Active Days", value: "287", change: "+12%" },
            { icon: MapIcon, label: "Total Distance", value: "2,847km", change: "+18%" },
            { icon: ArrowTrendingUpIcon, label: "Elevation Gain", value: "84,230m", change: "+25%" },
            { icon: ClockIcon, label: "Training Hours", value: "312h", change: "+8%" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-alpineBlue/20 to-glacierBlue/20">
                    <stat.icon className="w-6 h-6 text-glacierBlue" />
                  </div>
                  <div className="text-xs font-medium text-successGreen">{stat.change}</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-alpineBlue/10 to-summitGold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Recent Activities</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchActivities}
              disabled={loading}
              className="px-4 py-2 bg-alpineBlue/20 border border-alpineBlue/30 text-alpineBlue rounded-xl hover:bg-alpineBlue/30 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Syncing...' : 'Sync Latest'}
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-3xl p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="text-center space-y-1">
                        <div className="h-6 bg-white/10 rounded"></div>
                        <div className="h-3 bg-white/10 rounded w-16 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activities.map((activity, index) => {
                const colorClass = ACTIVITY_COLORS[activity.type] || 'from-gray-500 to-gray-600';
                const icon = ACTIVITY_ICONS[activity.type] || '🏃‍♂️';

                return (
                  <motion.div
                    key={activity.id}
                    variants={item}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="group relative"
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/8 transition-all duration-500 overflow-hidden">
                      {/* Activity Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-lg`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold truncate">{activity.name}</h4>
                          <p className="text-white/60 text-sm capitalize">
                            {new Date(activity.start_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {activity.type}
                          </p>
                        </div>
                      </div>

                      {/* Activity Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{formatDistance(activity.distance)}</div>
                          <div className="text-xs text-white/60">Distance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{formatTime(activity.moving_time)}</div>
                          <div className="text-xs text-white/60">Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{activity.total_elevation_gain}m</div>
                          <div className="text-xs text-white/60">Elevation</div>
                        </div>
                      </div>

                      {/* Hover Effect Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                    </div>

                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/5 transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              View Complete Training Log
              <motion.div
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <ChartBarIcon className="w-5 h-5" />
              </motion.div>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}