import { useState, useEffect } from 'react';

interface TrainingMetrics {
  currentStats: {
    [key: string]: {
      value: string;
      description: string;
      trend: 'up' | 'down' | 'stable';
    };
  };
  trainingPhases: {
    phase: string;
    duration: string;
    focus: string;
    status: 'completed' | 'current' | 'upcoming';
    metrics: {
      label: string;
      value: string;
      trend: 'up' | 'down' | 'stable';
    }[];
  }[];
  recentTrends: {
    [key: string]: {
      value: string;
      description: string;
      trend: 'up' | 'down' | 'stable';
    };
  };
  expeditionProgress: {
    completed: string[];
    upcoming: string[];
    progressPercentage: number;
  };
}

interface UseTrainingMetricsResult {
  metrics: TrainingMetrics | null;
  loading: boolean;
  error: string | null;
  isRealData: boolean;
  lastUpdated: string | null;
  refresh: () => void;
}

export function useTrainingMetrics(): UseTrainingMetricsResult {
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/training/metrics', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch training metrics: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        setIsRealData(data.source === 'strava' || data.source === 'garmin');
        setLastUpdated(data.lastUpdated);

        // Debug logging to verify data source
        console.log('Training metrics loaded:', {
          source: data.source,
          isRealData: data.source === 'strava' || data.source === 'garmin',
          totalActivities: data.totalActivities
        });
      } else {
        setError(data.error || 'Failed to load training metrics');
        setMetrics(data.metrics); // Fallback metrics
        setIsRealData(false);
      }
    } catch (err) {
      console.error('Error fetching training metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Set fallback metrics
      setMetrics(getFallbackMetrics());
      setIsRealData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const refresh = () => {
    fetchMetrics();
  };

  return {
    metrics,
    loading,
    error,
    isRealData,
    lastUpdated,
    refresh,
  };
}

function getFallbackMetrics(): TrainingMetrics {
  return {
    currentStats: {
      sevenSummitsCompleted: {
        value: '4/7',
        description: 'Kilimanjaro, Aconcagua, Elbrus, Denali completed',
        trend: 'up'
      },
      trainingYears: {
        value: '11',
        description: 'Since Sar Pass 2014',
        trend: 'up'
      },
      totalElevationThisYear: {
        value: '356K m',
        description: 'Estimated total vertical gain',
        trend: 'up'
      },
      currentRestingHR: {
        value: '42 bpm',
        description: 'Estimated resting heart rate',
        trend: 'down'
      }
    },
    trainingPhases: [
      {
        phase: 'Base Building',
        duration: 'Jan - Mar 2022',
        focus: 'Recovery Foundation',
        status: 'completed',
        metrics: [
          { label: 'Weekly Volume', value: '8 hrs', trend: 'up' },
          { label: 'Walking Distance', value: '5 km', trend: 'up' },
          { label: 'Recovery Rate', value: '90%', trend: 'up' }
        ]
      },
      {
        phase: 'Kilimanjaro Prep',
        duration: 'Apr - Oct 2022',
        focus: 'First Seven Summit',
        status: 'completed',
        metrics: [
          { label: 'Weekly Volume', value: '15 hrs', trend: 'up' },
          { label: 'Max Altitude', value: '19,341 ft', trend: 'up' },
          { label: 'Pack Weight', value: '45 lbs', trend: 'up' }
        ]
      },
      {
        phase: 'Technical Mountains',
        duration: 'Nov 2022 - Jul 2024',
        focus: 'Aconcagua, Elbrus, Denali',
        status: 'completed',
        metrics: [
          { label: 'Summit Success', value: '3/3', trend: 'up' },
          { label: 'Max Altitude', value: '22,837 ft', trend: 'up' },
          { label: 'Cold Exposure', value: '-40°C', trend: 'down' }
        ]
      },
      {
        phase: 'Base Training',
        duration: 'Aug 2025 - Mar 2027',
        focus: 'Foundation Building',
        status: 'current',
        metrics: 'dynamic' // Will be replaced with real Garmin data
      }
    ],
    recentTrends: {
      weeklyVolume: {
        value: '15 hrs',
        description: 'Estimated weekly training',
        trend: 'up'
      },
      monthlyActivities: {
        value: '12',
        description: 'Estimated monthly activities',
        trend: 'up'
      },
      elevationThisWeek: {
        value: '2.5K m',
        description: 'Estimated vertical gain this week',
        trend: 'up'
      },
      currentFitness: {
        value: '85/100',
        description: 'Estimated fitness level',
        trend: 'up'
      }
    },
    expeditionProgress: {
      completed: ['Kilimanjaro (2022)', 'Aconcagua (2023)', 'Elbrus (2023)', 'Denali (2024)'],
      upcoming: ['Everest (2027)', 'Vinson (TBD)', 'Carstensz Pyramid (TBD)'],
      progressPercentage: 57
    }
  };
}