'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Target,
  Activity,
  BarChart3,
  Heart,
  Mountain,
  Clock,
  Zap,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  title: string;
  color: string;
  unit: string;
  height?: number;
}

function LineChart({ data, title, color, unit, height = 200 }: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((point.value - minValue) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const gradientId = `gradient-${title.replace(/\s/g, '-')}`;

  const getChartIcon = (title: string) => {
    if (title.toLowerCase().includes('elevation')) return Mountain;
    if (title.toLowerCase().includes('heart')) return Heart;
    if (title.toLowerCase().includes('distance')) return Activity;
    return BarChart3;
  };

  const ChartIcon = getChartIcon(title);

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-spa-stone/10 shadow-sm hover:shadow-xl transition-all duration-500 group"
      variants={chartVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
            whileHover={{ rotate: 10, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <ChartIcon className={`w-5 h-5 text-${color}`} />
          </motion.div>
          <div>
            <h3 className="font-medium text-spa-charcoal group-hover:text-alpine-blue transition-colors">
              {title}
            </h3>
            <p className="text-sm text-spa-charcoal/60">
              Latest: {data[data.length - 1]?.value.toFixed(1)} {unit}
            </p>
          </div>
        </div>

        <motion.div
          className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}/10 text-${color} group-hover:scale-105 transition-transform`}
          whileHover={{ scale: 1.05 }}
        >
          +
          {(
            ((data[data.length - 1]?.value - data[0]?.value) / data[0]?.value) *
            100
          ).toFixed(1)}
          %
        </motion.div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-hidden">
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={`var(--color-${color})`}
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor={`var(--color-${color})`}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <motion.path
            d={`M0,${height} L${points
              .split(' ')
              .map((p, i) => {
                const [x, y] = p.split(',');
                return `${(parseFloat(x) / 100) * 100}% ${(parseFloat(y) / 100) * height}px`;
              })
              .join(' L')} L100%,${height}px Z`}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />

          {/* Main line */}
          <motion.polyline
            fill="none"
            stroke={`var(--color-${color})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points
              .split(' ')
              .map((p, i) => {
                const [x, y] = p.split(',');
                return `${(parseFloat(x) / 100) * 100}%,${(parseFloat(y) / 100) * height}px`;
              })
              .join(' ')}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              opacity: { duration: 0.3, delay: 0.3 },
            }}
          />

          {/* Data points */}
          {points.split(' ').map((point, i) => {
            const [x, y] = point.split(',');
            const xPos = (parseFloat(x) / 100) * 100;
            const yPos = (parseFloat(y) / 100) * height;

            return (
              <motion.circle
                key={i}
                cx={`${xPos}%`}
                cy={`${yPos}px`}
                r="4"
                fill={`var(--color-${color})`}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.2 + i * 0.1,
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                }}
                whileHover={{ scale: 1.5, r: 6 }}
              />
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  date: string;
  distance: string;
  duration: number;
  elevation: number;
  heartRate?: number;
  location?: string;
}

export function TrainingCharts() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStravaData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/strava/activities');

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to load Strava data:', error);
      setError('Unable to load training data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStravaData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStravaData();
  };

  // Generate chart data from activities
  const distanceData = activities.map((activity, index) => ({
    date: activity.date,
    value: parseFloat(activity.distance),
  }));

  const elevationData = activities.map((activity, index) => ({
    date: activity.date,
    value: activity.elevation,
  }));

  const heartRateData = activities
    .filter((activity) => activity.heartRate)
    .map((activity, index) => ({
      date: activity.date,
      value: activity.heartRate || 0,
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm">
        <div className="flex items-center justify-center space-y-4">
          <div className="flex items-center gap-3 text-spa-charcoal/70">
            <Loader2 className="w-6 h-6 animate-spin text-alpine-blue" />
            <span className="text-lg font-medium">
              Loading training data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2 inline" />
                Try Again
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-spa-charcoal mb-2">
            Training Analytics
          </h2>
          <p className="text-spa-charcoal/70">
            Real-time performance insights from recent activities
          </p>
        </div>

        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-spa-stone/10 rounded-lg transition-colors disabled:opacity-50 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform text-alpine-blue`}
          />
          <span className="text-sm font-medium text-spa-charcoal">
            Sync Data
          </span>
        </motion.button>
      </div>

      {/* Charts Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {distanceData.length > 0 && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <LineChart
              data={distanceData}
              title="Distance Covered"
              color="alpine-blue"
              unit="km"
              height={200}
            />
          </motion.div>
        )}

        {elevationData.length > 0 && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <LineChart
              data={elevationData}
              title="Elevation Gain"
              color="summit-gold"
              unit="m"
              height={200}
            />
          </motion.div>
        )}

        {heartRateData.length > 0 && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <LineChart
              data={heartRateData}
              title="Heart Rate"
              color="red-500"
              unit="bpm"
              height={200}
            />
          </motion.div>
        )}
      </motion.div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-spa-charcoal/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-spa-charcoal/70 mb-2">
            No training data available
          </h3>
          <p className="text-spa-charcoal/50 mb-6">
            Connect your Strava account to see your training analytics
          </p>
          <button className="px-6 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors">
            Connect Strava
          </button>
        </div>
      )}
    </motion.div>
  );
}
