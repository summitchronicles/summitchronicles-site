"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  FireIcon,
  ChartBarIcon,
  TrophyIcon,
  CalendarDaysIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BoltIcon,
  PlayIcon,
  ArrowRightIcon
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

export default function TrainingPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'extended'>('recent');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/strava/recent", { cache: "no-store" });
      const data = await response.json();
      
      if (data.ok && data.activities) {
        setActivities(data.activities);
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

  const recentActivities = activities.slice(0, activeTab === 'recent' ? 10 : 30);

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
    <main ref={ref} className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
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
              <TrophyIcon className="w-4 h-4" />
              Training Dashboard
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Peak <span className="text-summitGold">Performance</span> Tracking
            </h1>
            
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Real-time Strava integration powering your mountaineering preparation. 
              Monitor progress, analyze patterns, and optimize training for summit success.
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
              { icon: CalendarDaysIcon, label: "Active Days", value: "287", change: "+12%", color: "from-alpineBlue/20 to-glacierBlue/20" },
              { icon: MapIcon, label: "Total Distance", value: "2,847km", change: "+18%", color: "from-green-500/20 to-emerald-500/20" },
              { icon: ArrowTrendingUpIcon, label: "Elevation Gain", value: "84,230m", change: "+25%", color: "from-orange-500/20 to-red-500/20" },
              { icon: ClockIcon, label: "Training Hours", value: "312h", change: "+8%", color: "from-purple-500/20 to-violet-500/20" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
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
        </div>
      </section>

      {/* Training Activities Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-3xl font-bold text-white">Training Activities</h2>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'recent' 
                      ? 'bg-summitGold text-black' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Recent (10)
                </button>
                <button
                  onClick={() => setActiveTab('extended')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'extended' 
                      ? 'bg-summitGold text-black' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Extended (30)
                </button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchActivities}
                disabled={loading}
                className="px-4 py-2 bg-alpineBlue/20 border border-alpineBlue/30 text-alpineBlue rounded-xl hover:bg-alpineBlue/30 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                <BoltIcon className="w-4 h-4" />
                {loading ? 'Syncing...' : 'Sync Latest'}
              </motion.button>
            </div>
          </motion.div>

          {/* Activities Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
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
              {recentActivities.map((activity, index) => {
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

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white text-black font-semibold rounded-2xl overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                <PlayIcon className="w-5 h-5" />
                View Training Plan
                <motion.div
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.div>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-summitGold to-yellow-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/5 transition-all duration-300 group"
            >
              <span className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                Analyze Progress
                <motion.div
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}