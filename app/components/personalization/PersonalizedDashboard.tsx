'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Target,
  Calendar,
  TrendingUp,
  Mountain,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Compass,
  Heart,
} from 'lucide-react';

interface UserProfile {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryGoals: string[];
  preferredActivities: string[];
  currentPhase: 'base-building' | 'strength' | 'peak' | 'recovery';
  nextExpedition?: {
    name: string;
    date: string;
    difficulty: string;
  };
}

interface PersonalizedContent {
  welcomeMessage: string;
  priorityActions: Array<{
    type: 'training' | 'planning' | 'safety' | 'gear';
    title: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
    link?: string;
  }>;
  recommendedContent: Array<{
    type: 'article' | 'training' | 'video' | 'route';
    title: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
    relevanceScore: number;
  }>;
  weeklyFocus: {
    title: string;
    description: string;
    goals: string[];
  };
  progressMetrics: {
    currentWeek: {
      activitiesCompleted: number;
      totalHours: number;
      elevationGained: number;
    };
    trends: {
      endurance: 'improving' | 'stable' | 'declining';
      strength: 'improving' | 'stable' | 'declining';
      consistency: 'improving' | 'stable' | 'declining';
    };
  };
}

interface PersonalizedDashboardProps {
  userProfile?: UserProfile;
  activities?: any[];
  className?: string;
}

export function PersonalizedDashboard({
  userProfile,
  activities = [],
  className = '',
}: PersonalizedDashboardProps) {
  const [personalizedContent, setPersonalizedContent] =
    useState<PersonalizedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default user profile for demo
  const defaultProfile: UserProfile = {
    name: 'Sunith Kumar',
    level: 'intermediate',
    primaryGoals: [
      'Mount Everest expedition preparation',
      'High-altitude endurance',
      'Technical climbing skills',
    ],
    preferredActivities: ['hiking', 'climbing', 'cardio', 'strength'],
    currentPhase: 'base-building',
    nextExpedition: {
      name: 'Mount Everest',
      date: '2025-04-15',
      difficulty: 'Expert',
    },
  };

  const profile = userProfile || defaultProfile;

  useEffect(() => {
    generatePersonalizedContent();
  }, [profile, activities]);

  const generatePersonalizedContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch personalized content based on profile and activities
      const response = await fetch('/api/personalization/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profile,
          activities: activities.slice(0, 10), // Last 10 activities
          timeframe: 'current',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate personalized content');
      }

      const data = await response.json();
      setPersonalizedContent(data.content);
    } catch (error) {
      console.error('Error generating personalized content:', error);
      // Fallback to sample content
      setPersonalizedContent(generateSampleContent());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleContent = (): PersonalizedContent => {
    const daysToExpedition = profile.nextExpedition
      ? Math.ceil(
          (new Date(profile.nextExpedition.date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      welcomeMessage: `Welcome back, ${profile.name}! ${daysToExpedition ? `${daysToExpedition} days until ${profile.nextExpedition?.name}.` : ''} You're in the ${profile.currentPhase.replace('-', ' ')} phase.`,
      priorityActions: [
        {
          type: 'training',
          title: 'Complete Weekly Long Endurance Session',
          description:
            'Aim for 6-8 hours with 1200m+ elevation gain to build your aerobic base',
          urgency: 'high',
        },
        {
          type: 'planning',
          title: 'Update Expedition Gear List',
          description:
            'Review and finalize equipment list for your upcoming expedition',
          urgency: 'medium',
        },
        {
          type: 'safety',
          title: 'Practice Avalanche Rescue Scenarios',
          description:
            'Maintain proficiency with beacon, probe, and shovel techniques',
          urgency: 'medium',
        },
      ],
      recommendedContent: [
        {
          type: 'training',
          title: 'High-Altitude Acclimatization Protocol',
          category: 'Training',
          difficulty: 'Intermediate',
          estimatedTime: '15 min read',
          relevanceScore: 0.95,
        },
        {
          type: 'article',
          title: 'Nutrition Strategies for Expedition Climbing',
          category: 'Nutrition',
          difficulty: 'Beginner',
          estimatedTime: '10 min read',
          relevanceScore: 0.88,
        },
        {
          type: 'training',
          title: 'Technical Ice Climbing Progression',
          category: 'Technical Skills',
          difficulty: 'Advanced',
          estimatedTime: '20 min read',
          relevanceScore: 0.82,
        },
      ],
      weeklyFocus: {
        title: 'Aerobic Base Building',
        description:
          'Focus on building your cardiovascular foundation with longer, moderate-intensity sessions',
        goals: [
          'Complete 2-3 zone 2 endurance sessions',
          'One long session (6+ hours) with elevation',
          'Maintain technical skill practice',
          'Include recovery and mobility work',
        ],
      },
      progressMetrics: {
        currentWeek: {
          activitiesCompleted: activities.length,
          totalHours:
            activities.reduce((sum, act) => sum + (act.moving_time || 0), 0) /
            3600,
          elevationGained: activities.reduce(
            (sum, act) => sum + (act.total_elevation_gain || 0),
            0
          ),
        },
        trends: {
          endurance: 'improving',
          strength: 'stable',
          consistency: 'improving',
        },
      },
    };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'stable':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl border border-spa-stone/10 shadow-sm p-6 ${className}`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-spa-stone/20 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-spa-stone/20 rounded"></div>
            <div className="h-32 bg-spa-stone/20 rounded"></div>
            <div className="h-32 bg-spa-stone/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!personalizedContent) return null;

  return (
    <motion.div
      className={`bg-white rounded-xl border border-spa-stone/10 shadow-sm overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-alpine-blue to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-light">Personal Dashboard</h2>
              <p className="text-blue-100 text-sm">
                {personalizedContent.welcomeMessage}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Training Level</div>
            <div className="text-lg font-medium capitalize">
              {profile.level}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Priority Actions */}
        <div>
          <h3 className="text-lg font-medium text-spa-charcoal mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Priority Actions
          </h3>
          <div className="grid gap-3">
            {personalizedContent.priorityActions.map((action, index) => (
              <motion.div
                key={index}
                className={`border rounded-lg p-4 ${getUrgencyColor(action.urgency)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  {getUrgencyIcon(action.urgency)}
                  <div className="flex-1">
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Week Metrics */}
          <div className="bg-spa-cloud/10 rounded-lg p-4">
            <h3 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              This Week's Progress
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-light text-alpine-blue">
                  {
                    personalizedContent.progressMetrics.currentWeek
                      .activitiesCompleted
                  }
                </div>
                <div className="text-xs text-spa-charcoal/60">Activities</div>
              </div>
              <div>
                <div className="text-2xl font-light text-alpine-blue">
                  {Math.round(
                    personalizedContent.progressMetrics.currentWeek.totalHours
                  )}
                  h
                </div>
                <div className="text-xs text-spa-charcoal/60">
                  Training Time
                </div>
              </div>
              <div>
                <div className="text-2xl font-light text-alpine-blue">
                  {Math.round(
                    personalizedContent.progressMetrics.currentWeek
                      .elevationGained
                  )}
                  m
                </div>
                <div className="text-xs text-spa-charcoal/60">Elevation</div>
              </div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-spa-cloud/10 rounded-lg p-4">
            <h3 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Trends
            </h3>
            <div className="space-y-2">
              {Object.entries(personalizedContent.progressMetrics.trends).map(
                ([metric, trend]) => (
                  <div
                    key={metric}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-spa-charcoal capitalize">
                      {metric}
                    </span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(trend)}
                      <span className="text-sm capitalize">{trend}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Weekly Focus */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            {personalizedContent.weeklyFocus.title}
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            {personalizedContent.weeklyFocus.description}
          </p>
          <ul className="space-y-1">
            {personalizedContent.weeklyFocus.goals.map((goal, index) => (
              <li
                key={index}
                className="text-sm text-blue-800 flex items-start gap-2"
              >
                <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Content */}
        <div>
          <h3 className="text-lg font-medium text-spa-charcoal mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Recommended for You
          </h3>
          <div className="grid gap-3">
            {personalizedContent.recommendedContent.map((content, index) => (
              <motion.div
                key={index}
                className="border border-spa-stone/10 rounded-lg p-4 hover:border-alpine-blue/30 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-spa-charcoal/60">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {content.category}
                      </span>
                      <span>{content.difficulty}</span>
                      <span>{content.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-alpine-blue">
                    {Math.round(content.relevanceScore * 100)}% match
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
