'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  date: string;
  distance?: number;
  duration: number;
  elevation_gain?: number;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  kudos_count?: number;
  comment_count?: number;
}

interface StravaContextType {
  activities: StravaActivity[];
  loading: boolean;
  error: string | null;
  athleteName: string;
  refreshData: () => void;
}

const StravaContext = createContext<StravaContextType | undefined>(undefined);

export function StravaDataProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [athleteName, setAthleteName] = useState('Sunith Kumar');

  const fetchStravaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/strava/activities');
      const data = await response.json();

      if (!response.ok) {
        if (data.redirect) {
          // Token expired or missing, could redirect user
          setError(data.error);
        } else {
          throw new Error(data.error || 'Failed to fetch Strava data');
        }
        return;
      }

      setActivities(data.activities || []);
      setAthleteName(data.athlete_name || 'Sunith Kumar');
    } catch (err: any) {
      console.error('Strava data fetch error:', err);
      setError(err.message || 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStravaData();
  }, []);

  const refreshData = () => {
    fetchStravaData();
  };

  return (
    <StravaContext.Provider
      value={{
        activities,
        loading,
        error,
        athleteName,
        refreshData,
      }}
    >
      {children}
    </StravaContext.Provider>
  );
}

export function useStravaData() {
  const context = useContext(StravaContext);
  if (context === undefined) {
    throw new Error('useStravaData must be used within a StravaDataProvider');
  }
  return context;
}

// Helper functions to transform Strava data for charts
export function getMonthlyRunningData(activities: StravaActivity[]) {
  const monthlyData: {
    [key: string]: {
      distance: number;
      hours: number;
      sessions: number;
      totalTime: number;
    };
  } = {};

  activities
    .filter((activity) =>
      ['Run', 'Trail Run', 'Virtual Run'].includes(activity.type)
    )
    .forEach((activity) => {
      const month = new Date(activity.date).toLocaleDateString('en-US', {
        month: 'short',
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          distance: 0,
          hours: 0,
          sessions: 0,
          totalTime: 0,
        };
      }

      monthlyData[month].distance += activity.distance || 0;
      monthlyData[month].totalTime += activity.duration || 0;
      monthlyData[month].sessions += 1;
    });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    distance: Math.round(data.distance),
    hours: Math.round(data.totalTime / 3600), // Convert seconds to hours
    sessions: data.sessions,
    avgPace: formatPace(data.totalTime / data.distance), // Calculate average pace
  }));
}

export function getMonthlyHikingData(activities: StravaActivity[]) {
  const monthlyData: {
    [key: string]: {
      distance: number;
      elevation: number;
      hours: number;
      sessions: number;
    };
  } = {};

  activities
    .filter((activity) =>
      ['Hike', 'Walk', 'Alpine Ski', 'Backcountry Ski'].includes(activity.type)
    )
    .forEach((activity) => {
      const month = new Date(activity.date).toLocaleDateString('en-US', {
        month: 'short',
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          distance: 0,
          elevation: 0,
          hours: 0,
          sessions: 0,
        };
      }

      monthlyData[month].distance += activity.distance || 0;
      monthlyData[month].elevation += activity.elevation_gain || 0;
      monthlyData[month].hours += (activity.duration || 0) / 3600; // Convert to hours
      monthlyData[month].sessions += 1;
    });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    distance: Math.round(data.distance),
    elevation: Math.round(data.elevation),
    hours: Math.round(data.hours),
    sessions: data.sessions,
  }));
}

function formatPace(secondsPerKm: number): string {
  if (!secondsPerKm || secondsPerKm === Infinity) return 'N/A';

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
