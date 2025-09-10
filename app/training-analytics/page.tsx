"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  BoltIcon,
  MapIcon,
  HeartIcon,
  TrophyIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import TrainingInsights from "@/app/components/ai-insights/TrainingInsights";
import PredictiveAnalysis from "@/app/components/ai-insights/PredictiveAnalysis";
import SmartScheduler from "@/app/components/ai-insights/SmartScheduler";
import BiometricTracker from "@/app/components/ai-insights/BiometricTracker";
import GoalSetting from "@/app/components/ai-insights/GoalSetting";
import GoalSettingSimple from "@/app/components/ai-insights/GoalSettingSimple";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from '@/app/components/charts/DynamicCharts';

// Mock training data - replace with real Strava API data
const runningData = [
  { month: 'Jan', distance: 120, hours: 18, sessions: 12, avgPace: '5:20' },
  { month: 'Feb', distance: 145, hours: 22, sessions: 15, avgPace: '5:15' },
  { month: 'Mar', distance: 180, hours: 28, sessions: 18, avgPace: '5:10' },
  { month: 'Apr', distance: 210, hours: 32, sessions: 21, avgPace: '5:05' },
  { month: 'May', distance: 195, hours: 30, sessions: 20, avgPace: '5:08' },
  { month: 'Jun', distance: 225, hours: 35, sessions: 23, avgPace: '5:00' },
  { month: 'Jul', distance: 250, hours: 38, sessions: 25, avgPace: '4:58' },
  { month: 'Aug', distance: 280, hours: 42, sessions: 28, avgPace: '4:55' }
];

const hikingData = [
  { month: 'Jan', distance: 45, elevation: 3200, hours: 12, sessions: 4 },
  { month: 'Feb', distance: 60, elevation: 4100, hours: 16, sessions: 5 },
  { month: 'Mar', distance: 85, elevation: 6800, hours: 24, sessions: 7 },
  { month: 'Apr', distance: 120, elevation: 9200, hours: 32, sessions: 10 },
  { month: 'May', distance: 140, elevation: 11500, hours: 38, sessions: 12 },
  { month: 'Jun', distance: 165, elevation: 14200, hours: 45, sessions: 15 },
  { month: 'Jul', distance: 190, elevation: 16800, hours: 52, sessions: 18 },
  { month: 'Aug', distance: 210, elevation: 19500, hours: 58, sessions: 20 }
];

const strengthData = [
  { month: 'Jan', totalWeight: 12500, sessions: 16, avgDuration: 75 },
  { month: 'Feb', totalWeight: 15200, sessions: 20, avgDuration: 78 },
  { month: 'Mar', totalWeight: 18900, sessions: 24, avgDuration: 82 },
  { month: 'Apr', totalWeight: 22100, sessions: 28, avgDuration: 85 },
  { month: 'May', totalWeight: 25800, sessions: 32, avgDuration: 88 },
  { month: 'Jun', totalWeight: 29200, sessions: 36, avgDuration: 90 },
  { month: 'Jul', totalWeight: 32900, sessions: 40, avgDuration: 92 },
  { month: 'Aug', totalWeight: 36500, sessions: 44, avgDuration: 95 }
];

// Future projections
const futureProjections = [
  { month: 'Sep', running: 320, hiking: 230, strength: 40000 },
  { month: 'Oct', running: 350, hiking: 250, strength: 44000 },
  { month: 'Nov', running: 380, hiking: 270, strength: 48000 },
  { month: 'Dec', running: 400, hiking: 290, strength: 52000 },
  { month: 'Jan 2024', running: 420, hiking: 310, strength: 56000 },
  { month: 'Feb 2024', running: 450, hiking: 330, strength: 60000 }
];

const trainingDistribution = [
  { name: 'Running', value: 45, color: '#FF6B35' },
  { name: 'Hiking', value: 30, color: '#4ECDC4' },
  { name: 'Strength', value: 20, color: '#45B7D1' },
  { name: 'Recovery', value: 5, color: '#96CEB4' }
];

interface StravaData {
  monthlyData: {
    running: typeof runningData;
    hiking: typeof hikingData;
    strength: typeof strengthData;
  };
  totalStats: {
    running: { totalDistance: number; totalHours: number; totalSessions: number };
    hiking: { totalDistance: number; totalHours: number; totalSessions: number; totalElevation: number };
    strength: { totalSessions: number; totalWeight: number; totalHours: number };
  };
  fallbackData?: boolean;
  lastUpdated?: string;
}

export default function TrainingAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('running');
  const [stravaData, setStravaData] = useState<StravaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real Strava data
  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/strava/analytics');
        if (!response.ok) throw new Error('Failed to fetch Strava data');
        const data = await response.json();
        setStravaData(data);
        setError(null);
      } catch (err: any) {
        console.error('Strava data fetch error:', err);
        setError(err.message);
        // Use fallback data
        setStravaData({
          monthlyData: { running: runningData, hiking: hikingData, strength: strengthData },
          totalStats: {
            running: { totalDistance: 1605, totalHours: 245, totalSessions: 162 },
            hiking: { totalDistance: 1015, totalHours: 277, totalSessions: 91, totalElevation: 85200 },
            strength: { totalSessions: 240, totalWeight: 263100, totalHours: 348 }
          },
          fallbackData: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStravaData();
  }, []);

  // Use real Strava data or fallback to mock data
  const currentRunningData = stravaData?.monthlyData.running || runningData;
  const currentHikingData = stravaData?.monthlyData.hiking || hikingData;
  const currentStrengthData = stravaData?.monthlyData.strength || strengthData;
  const totalStats = stravaData?.totalStats;

  // Calculate overall average pace from monthly data
  const calculateOverallAvgPace = () => {
    if (!currentRunningData || currentRunningData.length === 0) return "5:05";
    
    const validPaces = currentRunningData
      .map(month => month.avgPace)
      .filter(pace => pace && pace !== "0:00");
    
    if (validPaces.length === 0) return "5:05";
    
    // Convert pace strings to total seconds, then average them
    const totalSeconds = validPaces.reduce((sum, pace) => {
      const [minutes, seconds] = pace.split(':').map(Number);
      return sum + (minutes * 60 + seconds);
    }, 0);
    
    const avgSeconds = Math.round(totalSeconds / validPaces.length);
    const avgMinutes = Math.floor(avgSeconds / 60);
    const remainingSeconds = avgSeconds % 60;
    
    return `${avgMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'running', label: 'Running', icon: FireIcon },
    { id: 'hiking', label: 'Hiking', icon: MapIcon },
    { id: 'strength', label: 'Strength', icon: BoltIcon },
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'ai-insights', label: 'AI Insights', icon: BoltIcon },
    { id: 'predictions', label: 'Predictions', icon: TrophyIcon },
    { id: 'scheduler', label: 'Scheduler', icon: CalendarIcon },
    { id: 'biometrics', label: 'Recovery', icon: HeartIcon },
    { id: 'goals', label: 'Goals', icon: TrophyIcon }
  ];

  const MetricCard = ({ title, value, unit, change, icon: Icon, color = "alpineBlue" }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">
            {value}<span className="text-lg text-white/70">{unit}</span>
          </p>
          {change && (
            <p className="text-successGreen text-sm font-medium mt-2">
              +{change}% vs last month
            </p>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br from-${color}/20 to-glacierBlue/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </motion.div>
  );

  const RunningTab = () => (
    <div className="space-y-8">
      {/* Running Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Distance"
          value={totalStats?.running.totalDistance ? Math.round(totalStats.running.totalDistance).toLocaleString() : "1,605"}
          unit="km"
          change="12"
          icon={MapIcon}
          color="summitGold"
        />
        <MetricCard
          title="Total Hours"
          value={Math.round(totalStats?.running.totalHours || 245).toString()}
          unit="hrs"
          change="8"
          icon={ClockIcon}
          color="alpineBlue"
        />
        <MetricCard
          title="Sessions"
          value={totalStats?.running.totalSessions.toString() || "162"}
          unit=""
          change="15"
          icon={CalendarIcon}
          color="successGreen"
        />
        <MetricCard
          title="Avg Pace"
          value={calculateOverallAvgPace()}
          unit="/km"
          change="3"
          icon={FireIcon}
          color="warningOrange"
        />
      </div>

      {/* Running Volume Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Monthly Running Volume</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentRunningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="distance"
                stroke="#FF6B35"
                fill="#FF6B35"
                fillOpacity={0.3}
                name="Distance (km)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Distance vs Hours Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Distance vs Time Correlation</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentRunningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis yAxisId="distance" orientation="left" stroke="rgba(255,255,255,0.7)" />
              <YAxis yAxisId="hours" orientation="right" stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line
                yAxisId="distance"
                type="monotone"
                dataKey="distance"
                stroke="#FF6B35"
                strokeWidth={3}
                name="Distance (km)"
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 6 }}
              />
              <Line
                yAxisId="hours"
                type="monotone"
                dataKey="hours"
                stroke="#4ECDC4"
                strokeWidth={3}
                name="Hours"
                dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  const HikingTab = () => (
    <div className="space-y-8">
      {/* Hiking Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Distance"
          value={totalStats?.hiking.totalDistance ? Math.round(totalStats.hiking.totalDistance).toLocaleString() : "1,015"}
          unit="km"
          change="18"
          icon={MapIcon}
          color="successGreen"
        />
        <MetricCard
          title="Elevation Gain"
          value={totalStats?.hiking.totalElevation ? Math.round(totalStats.hiking.totalElevation).toLocaleString() : "85,200"}
          unit="m"
          change="22"
          icon={TrophyIcon}
          color="summitGold"
        />
        <MetricCard
          title="Total Hours"
          value="277"
          unit="hrs"
          change="16"
          icon={ClockIcon}
          color="alpineBlue"
        />
        <MetricCard
          title="Sessions"
          value="91"
          unit=""
          change="25"
          icon={CalendarIcon}
          color="glacierBlue"
        />
      </div>

      {/* Hiking Volume & Elevation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Monthly Hiking Progress</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentHikingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis yAxisId="distance" orientation="left" stroke="rgba(255,255,255,0.7)" />
              <YAxis yAxisId="elevation" orientation="right" stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Bar
                yAxisId="distance"
                dataKey="distance"
                fill="#4ECDC4"
                name="Distance (km)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="elevation"
                dataKey="elevation"
                fill="#96CEB4"
                name="Elevation (m)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  const StrengthTab = () => (
    <div className="space-y-8">
      {/* Strength Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Weight"
          value="263,100"
          unit="kg"
          change="14"
          icon={BoltIcon}
          color="alpineBlue"
        />
        <MetricCard
          title="Sessions"
          value="240"
          unit=""
          change="20"
          icon={CalendarIcon}
          color="successGreen"
        />
        <MetricCard
          title="Avg Duration"
          value="87"
          unit="min"
          change="8"
          icon={ClockIcon}
          color="summitGold"
        />
        <MetricCard
          title="Total Hours"
          value="348"
          unit="hrs"
          change="18"
          icon={HeartIcon}
          color="warningOrange"
        />
      </div>

      {/* Strength Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Strength Training Progression</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentStrengthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalWeight"
                stroke="#45B7D1"
                fill="#45B7D1"
                fillOpacity={0.3}
                name="Total Weight (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Sessions vs Weight Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Sessions vs Total Weight</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentStrengthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis yAxisId="weight" orientation="left" stroke="rgba(255,255,255,0.7)" />
              <YAxis yAxisId="sessions" orientation="right" stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="totalWeight"
                stroke="#45B7D1"
                strokeWidth={3}
                name="Total Weight (kg)"
                dot={{ fill: '#45B7D1', strokeWidth: 2, r: 6 }}
              />
              <Line
                yAxisId="sessions"
                type="monotone"
                dataKey="sessions"
                stroke="#96CEB4"
                strokeWidth={3}
                name="Sessions"
                dot={{ fill: '#96CEB4', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Training Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Training Time Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trainingDistribution}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : '0')}%`}
              >
                {trainingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Future Projections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Future Training Projections</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={futureProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="running"
                stroke="#FF6B35"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Running (km)"
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="hiking"
                stroke="#4ECDC4"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Hiking (km)"
                dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Training Analytics</h1>
              <p className="text-white/60 text-lg">Comprehensive analysis of your mountain training progress</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-4 h-4 border-2 border-summitGold border-t-transparent rounded-full animate-spin"></div>
                  Loading Strava data...
                </div>
              ) : stravaData?.fallbackData ? (
                <div className="text-white/60 text-sm">
                  📊 Demo data shown<br/>
                  <span className="text-xs">Connect Strava for real metrics</span>
                </div>
              ) : (
                <div className="text-successGreen text-sm">
                  ✅ Live Strava data<br/>
                  <span className="text-xs text-white/60">
                    Updated: {stravaData?.lastUpdated ? new Date(stravaData.lastUpdated).toLocaleTimeString() : 'Now'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-alpineBlue to-glacierBlue text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'running' && <RunningTab />}
        {activeTab === 'hiking' && <HikingTab />}
        {activeTab === 'strength' && <StrengthTab />}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'ai-insights' && (
          <div className="space-y-8">
            <TrainingInsights 
              activities={[]} 
              biometrics={[]}
              goals={[]}
            />
          </div>
        )}
        {activeTab === 'predictions' && (
          <div className="space-y-8">
            <PredictiveAnalysis 
              activities={[]}
              goals={[]}
            />
          </div>
        )}
        {activeTab === 'scheduler' && (
          <div className="space-y-8">
            <SmartScheduler 
              activities={[]}
            />
          </div>
        )}
        {activeTab === 'biometrics' && (
          <div className="space-y-8">
            <BiometricTracker 
              data={[]}
            />
          </div>
        )}
        {activeTab === 'goals' && (
          <div className="space-y-8">
            <GoalSettingSimple />
          </div>
        )}
      </div>
    </main>
  );
}