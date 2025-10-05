'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle,
  Dumbbell,
  Target,
  Heart,
  Upload,
} from 'lucide-react';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rpe: string;
  weight?: number;
  restTime?: number;
}

export interface TrainingActivity {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'expedition';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  exercises?: Exercise[]; // For strength workouts
  location?: string;
  notes?: string;
  completed: boolean;
  date: string;
  // Planned vs Actual tracking
  actual?: {
    duration?: number;
    heartRate?: { avg: number; max: number };
    calories?: number;
    completedAt?: string;
    garminActivityId?: string;
  };
  garminWorkoutId?: string;
  status: 'planned' | 'synced' | 'completed' | 'skipped';
  compliance?: {
    durationMatch: number; // percentage
    intensityMatch: number; // percentage
    completed: boolean;
    notes?: string;
  };
}

export interface WeeklyPlan {
  weekStartDate: string;
  weekNumber: number;
  phase: string;
  goals: string[];
  activities: TrainingActivity[];
}

interface TrainingCalendarProps {
  className?: string;
  onActivityComplete?: (activityId: string) => void;
  onPlanUpload?: (planData: WeeklyPlan[]) => void;
}

export function TrainingCalendar({
  className = '',
  onActivityComplete,
  onPlanUpload,
}: TrainingCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([
    // Current week: September 30 - October 6, 2025 (Week containing October 4th)
    {
      weekStartDate: '2025-09-30',
      weekNumber: 1,
      phase: 'Base Training',
      goals: ['Foundation building', 'Endurance development', 'Technical skills'],
      activities: [
        {
          id: '1',
          title: 'Base Aerobic Training',
          type: 'cardio',
          duration: 90,
          intensity: 'low',
          location: 'Local Trails',
          notes: 'Zone 1-2 aerobic base development, nasal breathing',
          completed: true,
          date: '2025-09-30',
          status: 'completed',
          actual: {
            duration: 88,
            heartRate: { avg: 135, max: 165 },
            calories: 520,
            completedAt: '2025-09-30T07:00:00Z'
          },
          compliance: {
            durationMatch: 98,
            intensityMatch: 95,
            completed: true,
            notes: 'Good aerobic base session'
          }
        },
        {
          id: '2',
          title: 'Strength Foundation',
          type: 'strength',
          duration: 60,
          intensity: 'medium',
          location: 'Home Gym',
          notes: 'Functional strength for mountaineering',
          completed: true,
          date: '2025-10-01',
          status: 'completed',
          exercises: [
            { name: 'Squats', sets: 3, reps: 12, rpe: '6-7', restTime: 90 },
            { name: 'Push-ups', sets: 3, reps: 15, rpe: '6-7', restTime: 60 },
            { name: 'Lunges', sets: 3, reps: 10, rpe: '6-7', restTime: 60 }
          ],
          actual: {
            duration: 62,
            completedAt: '2025-10-01T06:30:00Z'
          },
          compliance: {
            durationMatch: 97,
            intensityMatch: 100,
            completed: true,
            notes: 'All exercises completed as planned'
          }
        },
        {
          id: '3',
          title: 'Active Recovery',
          type: 'rest',
          duration: 45,
          intensity: 'low',
          location: 'Home',
          notes: 'Yoga, mobility work, foam rolling',
          completed: true,
          date: '2025-10-02',
          status: 'completed',
          actual: {
            duration: 50,
            completedAt: '2025-10-02T18:00:00Z'
          },
          compliance: {
            durationMatch: 89,
            intensityMatch: 100,
            completed: true,
            notes: 'Extended mobility session'
          }
        },
        {
          id: '4',
          title: 'Technical Skills Practice',
          type: 'technical',
          duration: 90,
          intensity: 'low',
          location: 'Climbing Gym',
          notes: 'Knot practice, anchor building, rescue techniques',
          completed: true,
          date: '2025-10-03',
          status: 'completed',
          actual: {
            duration: 95,
            completedAt: '2025-10-03T19:00:00Z'
          },
          compliance: {
            durationMatch: 94,
            intensityMatch: 100,
            completed: true,
            notes: 'Good technical skills session'
          }
        },
        {
          id: '5',
          title: 'Treadmill Hike',
          type: 'cardio',
          duration: 75,
          intensity: 'medium',
          location: 'Home Gym',
          notes: 'Incline training, pack weight simulation',
          completed: false,
          date: '2025-10-04',
          status: 'planned'
        },
        {
          id: '6',
          title: 'Saturday Endurance',
          type: 'cardio',
          duration: 150,
          intensity: 'medium',
          location: 'Mount Tamalpais',
          notes: 'Long steady distance, pack training, elevation gain',
          completed: false,
          date: '2025-10-05',
          status: 'planned'
        },
        {
          id: '7',
          title: 'Recovery Walk',
          type: 'cardio',
          duration: 45,
          intensity: 'low',
          location: 'Neighborhood',
          notes: 'Easy pace, active recovery',
          completed: false,
          date: '2025-10-06',
          status: 'planned'
        },
      ],
    },
  ]);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [isGarminSyncing, setIsGarminSyncing] = useState(false);
  const [garminSyncStatus, setGarminSyncStatus] = useState<string | null>(null);
  const [syncedWorkouts, setSyncedWorkouts] = useState<TrainingActivity[]>([]);

  const currentPlan = weeklyPlans[currentWeek];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'cardio':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'strength':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rest':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'expedition':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  const toggleActivityComplete = (activityId: string) => {
    setWeeklyPlans((plans) =>
      plans.map((plan) =>
        plan.weekNumber === currentPlan.weekNumber
          ? {
              ...plan,
              activities: plan.activities.map((activity) =>
                activity.id === activityId
                  ? { ...activity, completed: !activity.completed }
                  : activity
              ),
            }
          : plan
      )
    );
    onActivityComplete?.(activityId);
  };


  // Garmin Connect Integration Functions
  const handleGarminConnect = async () => {
    try {
      const response = await fetch('/api/garmin/auth?action=login');
      const data = await response.json();

      if (data.success && data.authUrl) {
        // Redirect to Garmin OAuth
        window.location.href = data.authUrl;
      } else {
        console.error('Failed to get Garmin auth URL:', data.error);
        setGarminSyncStatus('Failed to connect to Garmin Connect');
      }
    } catch (error) {
      console.error('Garmin connect error:', error);
      setGarminSyncStatus('Error connecting to Garmin Connect');
    }
  };

  const handleGarminSync = async () => {
    if (!isGarminConnected) {
      await handleGarminConnect();
      return;
    }

    setIsGarminSyncing(true);
    setGarminSyncStatus('Syncing activities...');

    try {
      // Sync activities from Garmin
      const activitiesResponse = await fetch('/api/garmin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          plannedWorkouts: currentPlan.activities
        })
      });

      const activitiesData = await activitiesResponse.json();

      if (activitiesData.success) {
        // Update activities with Garmin sync data
        const updatedActivities = currentPlan.activities.map(activity => {
          const matchedActivity = activitiesData.syncedActivities.find(
            (synced: any) => synced.plannedWorkout?.id === activity.id
          );

          if (matchedActivity) {
            return {
              ...activity,
              actual: {
                duration: matchedActivity.garminActivity.duration ? Math.round(matchedActivity.garminActivity.duration / 60) : activity.duration,
                heartRate: matchedActivity.garminActivity.averageHR ? {
                  avg: matchedActivity.garminActivity.averageHR,
                  max: matchedActivity.garminActivity.maxHR || matchedActivity.garminActivity.averageHR + 20
                } : undefined,
                calories: matchedActivity.garminActivity.calories,
                completedAt: matchedActivity.garminActivity.startTimeGMT,
                garminActivityId: matchedActivity.garminActivity.activityId?.toString()
              },
              compliance: matchedActivity.compliance,
              status: 'completed' as const,
              completed: true
            };
          }
          return activity;
        });

        // Update the current plan with synced data
        const updatedPlans = weeklyPlans.map(plan =>
          plan.weekNumber === currentPlan.weekNumber
            ? { ...plan, activities: updatedActivities }
            : plan
        );

        setWeeklyPlans(updatedPlans);
        setGarminSyncStatus(`Successfully synced ${activitiesData.totalSynced} activities`);
      } else {
        setGarminSyncStatus('Failed to sync activities from Garmin');
      }
    } catch (error) {
      console.error('Garmin sync error:', error);
      setGarminSyncStatus('Error syncing with Garmin Connect');
    } finally {
      setIsGarminSyncing(false);
    }
  };

  const handlePushToGarmin = async () => {
    if (!isGarminConnected) {
      await handleGarminConnect();
      return;
    }

    setIsGarminSyncing(true);
    setGarminSyncStatus('Pushing workouts to Garmin...');

    try {
      const response = await fetch('/api/garmin/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          workouts: currentPlan.activities
        })
      });

      const data = await response.json();

      if (data.success) {
        setGarminSyncStatus(`Successfully pushed ${data.createdWorkouts?.length || 0} workouts to Garmin`);
      } else {
        setGarminSyncStatus('Failed to push workouts to Garmin');
      }
    } catch (error) {
      console.error('Push to Garmin error:', error);
      setGarminSyncStatus('Error pushing workouts to Garmin');
    } finally {
      setIsGarminSyncing(false);
    }
  };

  // Fetch synced workouts from the backend
  const fetchSyncedWorkouts = async () => {
    try {
      const response = await fetch('/api/training/sync');
      const data = await response.json();

      // For now, we'll check if there are any recent synced workouts
      // In a real implementation, this would fetch from a database
      console.log('Sync service available:', data.availableServices);
    } catch (error) {
      console.error('Error fetching synced workouts:', error);
    }
  };

  // Check Garmin connection status and fetch synced workouts on component mount
  React.useEffect(() => {
    const checkGarminStatus = async () => {
      try {
        const response = await fetch('/api/garmin/auth?action=status');
        const data = await response.json();
        setIsGarminConnected(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking Garmin status:', error);
        setIsGarminConnected(false);
      }
    };

    checkGarminStatus();
    fetchSyncedWorkouts();
  }, []);

  const completedActivities = currentPlan.activities.filter((a) => a.completed).length;
  const totalActivities = currentPlan.activities.length;
  const completionPercentage = Math.round((completedActivities / totalActivities) * 100);

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-white" />
            <h2 className="text-xl font-light tracking-wide text-white">
              WEEKLY TRAINING CALENDAR
            </h2>
          </div>

          <div className="flex items-center space-x-3">

            {/* Garmin Connect Integration */}
            <div className="flex items-center space-x-2">
              {isGarminConnected ? (
                <>
                  <button
                    onClick={handlePushToGarmin}
                    disabled={isGarminSyncing}
                    className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isGarminSyncing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isGarminSyncing ? 'Pushing...' : 'Push to Garmin'}</span>
                  </button>
                  <button
                    onClick={handleGarminSync}
                    disabled={isGarminSyncing}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isGarminSyncing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    <span>{isGarminSyncing ? 'Syncing...' : 'Sync from Garmin'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGarminConnect}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  data-testid="connect-garmin-button"
                >
                  <Target className="w-4 h-4" />
                  <span>Connect Garmin</span>
                </button>
              )}
            </div>

            {/* Week Navigation */}
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                disabled={currentWeek === 0}
                className="px-3 py-1 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm font-medium text-white">
                Sep 30 - Oct 6, 2025
              </span>
              <button
                onClick={() => setCurrentWeek(Math.min(weeklyPlans.length - 1, currentWeek + 1))}
                disabled={currentWeek === weeklyPlans.length - 1}
                className="px-3 py-1 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">Training Phase</h3>
            <p className="text-white font-medium">{currentPlan.phase}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">Progress</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-600 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-white">
                {completedActivities}/{totalActivities}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">Week Goals</h3>
            <div className="flex flex-wrap gap-1">
              {currentPlan.goals.slice(0, 2).map((goal, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-700"
                >
                  {goal}
                </span>
              ))}
              {currentPlan.goals.length > 2 && (
                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                  +{currentPlan.goals.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>


        {/* Sync Status */}
        <div className="mt-4 bg-gray-700/20 border border-gray-600/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2" data-testid="garmin-status">
              <Target className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">
                {isGarminConnected ? 'Connected to Garmin Connect' : 'Not Connected'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">Sync Service Active</span>
            </div>
          </div>
        </div>

        {garminSyncStatus && (
          <div className="mt-4 bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <p className="text-blue-400 text-sm">{garminSyncStatus}</p>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {/* Day Headers */}
          {days.map((day, index) => (
            <div key={day} className="text-center pb-2 border-b border-gray-600">
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">{day}</span>
            </div>
          ))}

          {/* Activities */}
          {currentPlan.activities.map((activity, index) => (
            <div key={activity.id} className="min-h-[120px]">
              <div
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer
                  ${getActivityColor(activity.type)}
                  ${activity.completed ? 'opacity-75' : ''}
                `}
                onClick={() => toggleActivityComplete(activity.id)}
              >
                {/* Activity Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 mr-2">
                    <h4 className="text-sm font-medium leading-tight line-clamp-2">
                      {activity.title}
                    </h4>
                    {/* Status Badge */}
                    <div className="flex items-center space-x-1 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        activity.status === 'synced' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        activity.status === 'skipped' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {activity.status === 'synced' && <Upload className="w-3 h-3" />}
                        <span>
                          {activity.status === 'completed' ? 'Completed' :
                           activity.status === 'synced' ? 'Synced' :
                           activity.status === 'skipped' ? 'Skipped' :
                           'Planned'}
                        </span>
                      </span>
                      {activity.compliance && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activity.compliance.completed && activity.compliance.durationMatch >= 80
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : activity.compliance.completed && activity.compliance.durationMatch >= 60
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {activity.compliance.durationMatch}% Match
                        </span>
                      )}
                    </div>
                  </div>
                  {activity.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                </div>

                {/* Activity Details */}
                <div className="space-y-2">
                  {/* Duration and Intensity */}
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(activity.duration / 60)}h {activity.duration % 60}m</span>
                    </div>
                    {getIntensityIcon(activity.intensity)}
                    {activity.actual?.duration && (
                      <span className="text-blue-400">
                        (Actual: {Math.floor(activity.actual.duration / 60)}h {activity.actual.duration % 60}m)
                      </span>
                    )}
                  </div>

                  {/* Exercises for Strength Workouts */}
                  {activity.exercises && activity.exercises.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Dumbbell className="w-3 h-3" />
                        <span className="text-xs font-medium">{activity.exercises.length} Exercises</span>
                      </div>
                      <div className="space-y-1">
                        {activity.exercises.slice(0, 2).map((exercise, idx) => (
                          <div key={idx} className="text-xs text-gray-300 pl-4">
                            {exercise.name}: {exercise.sets} × {exercise.reps} @ RPE {exercise.rpe}
                          </div>
                        ))}
                        {activity.exercises.length > 2 && (
                          <div className="text-xs text-gray-400 pl-4">
                            +{activity.exercises.length - 2} more exercises
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Heart Rate and Performance Data */}
                  {activity.actual?.heartRate && (
                    <div className="flex items-center space-x-2 text-xs text-blue-400">
                      <Heart className="w-3 h-3" />
                      <span>HR: {activity.actual.heartRate.avg}/{activity.actual.heartRate.max} bpm</span>
                      {activity.actual.calories && (
                        <span>• {activity.actual.calories} cal</span>
                      )}
                    </div>
                  )}

                  {activity.location && (
                    <div className="flex items-center space-x-2 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                  )}

                  {activity.notes && (
                    <p className="text-xs opacity-75 line-clamp-2 mt-1">
                      {activity.notes}
                    </p>
                  )}

                  {/* Compliance Notes */}
                  {activity.compliance?.notes && (
                    <p className="text-xs text-blue-400 italic mt-1">
                      {activity.compliance.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}