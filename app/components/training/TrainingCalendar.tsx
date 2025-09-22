'use client';

import { useState, useRef } from 'react';
import {
  Calendar,
  Upload,
  Plus,
  Edit3,
  Trash2,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export interface TrainingActivity {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'expedition';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  location?: string;
  notes?: string;
  completed: boolean;
  date: string;
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
    // Sample data
    {
      weekStartDate: '2025-09-22',
      weekNumber: 1,
      phase: 'Base Building',
      goals: ['Build aerobic base', 'Improve hiking endurance', 'Core strength'],
      activities: [
        {
          id: '1',
          title: 'Morning Hike - Local Trail',
          type: 'cardio',
          duration: 120,
          intensity: 'medium',
          location: 'Mount Tamalpais',
          notes: 'Focus on steady pace, breathing technique',
          completed: true,
          date: '2025-09-22',
        },
        {
          id: '2',
          title: 'Strength Training - Lower Body',
          type: 'strength',
          duration: 60,
          intensity: 'high',
          location: 'Home Gym',
          notes: 'Squats, lunges, calf raises with pack weight',
          completed: true,
          date: '2025-09-23',
        },
        {
          id: '3',
          title: 'Technical Skills - Knots & Anchors',
          type: 'technical',
          duration: 90,
          intensity: 'low',
          location: 'Climbing Gym',
          notes: 'Practice alpine butterfly, clove hitch, anchor building',
          completed: false,
          date: '2025-09-24',
        },
        {
          id: '4',
          title: 'Rest Day - Active Recovery',
          type: 'rest',
          duration: 30,
          intensity: 'low',
          location: 'Home',
          notes: 'Yoga, stretching, foam rolling',
          completed: false,
          date: '2025-09-25',
        },
        {
          id: '5',
          title: 'Long Hike - Pack Training',
          type: 'cardio',
          duration: 240,
          intensity: 'medium',
          location: 'Point Reyes',
          notes: '15kg pack, practice expedition pace',
          completed: false,
          date: '2025-09-26',
        },
        {
          id: '6',
          title: 'Upper Body Strength',
          type: 'strength',
          duration: 45,
          intensity: 'high',
          location: 'Home Gym',
          notes: 'Pull-ups, push-ups, core work',
          completed: false,
          date: '2025-09-27',
        },
        {
          id: '7',
          title: 'Easy Recovery Hike',
          type: 'cardio',
          duration: 60,
          intensity: 'low',
          location: 'Local Hills',
          notes: 'Light pace, enjoy nature',
          completed: false,
          date: '2025-09-28',
        },
      ],
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/training/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.plans) {
        setWeeklyPlans(data.plans);
        onPlanUpload?.(data.plans);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to parse training plan. Please check your Excel format.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            {/* Excel Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Upload Excel'}</span>
            </button>

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
                Week {currentPlan.weekNumber}
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

        {uploadError && (
          <div className="mt-4 bg-red-900/20 border border-red-600/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">{uploadError}</p>
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
                  <h4 className="text-sm font-medium leading-tight line-clamp-2">
                    {activity.title}
                  </h4>
                  {activity.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 ml-1" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 ml-1" />
                  )}
                </div>

                {/* Activity Details */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{Math.floor(activity.duration / 60)}h {activity.duration % 60}m</span>
                    {getIntensityIcon(activity.intensity)}
                  </div>

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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Instructions */}
        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="flex items-start space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-white mb-1">Excel Upload Format</h4>
              <p className="text-sm text-gray-300 mb-2">
                Upload your weekly training plans in Excel format with the following columns:
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Week Number, Phase, Day, Activity Title, Type, Duration (min), Intensity, Location, Notes</li>
                <li>• Supported types: cardio, strength, technical, rest, expedition</li>
                <li>• Intensity levels: low, medium, high</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}