'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  ChevronRight,
  Mountain,
  Activity,
  Clock,
  Award,
  MessageSquare,
  PlusCircle,
} from 'lucide-react';
import TrainerDashboard from '@/components/training/TrainerDashboard';
import ProgramTemplates from '@/components/training/ProgramTemplates';
import PeriodizationDashboard from '@/components/training/PeriodizationDashboard';
import { UserProfile } from '@/lib/multi-user/types';

interface TrainingHubProps {}

export default function TrainingHub({}: TrainingHubProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // In a real app, this would come from auth context or API
      // For now, we'll simulate a trainer profile
      const mockProfile: UserProfile = {
        id: 'user_123',
        auth_user_id: 'auth_123',
        email: 'trainer@example.com',
        full_name: 'Summit Coach',
        role: 'trainer',
        experience_level: 'expert',
        summits_completed: 7,
        primary_goals: ['Seven Summits', 'Client Success'],
        target_summit: 'Everest',
        timezone: 'UTC',
        units_preference: 'metric',
        subscription_tier: 'pro',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUserProfile(mockProfile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview and analytics',
      available: true,
    },
    {
      id: 'clients',
      label: 'Client Management',
      icon: Users,
      description: 'Manage athlete relationships',
      available:
        userProfile?.role === 'trainer' || userProfile?.role === 'admin',
    },
    {
      id: 'programs',
      label: 'Program Library',
      icon: BookOpen,
      description: 'Training templates and plans',
      available: true,
    },
    {
      id: 'periodization',
      label: 'Periodization',
      icon: Target,
      description: 'AI-optimized training cycles',
      available: true,
    },
    {
      id: 'analytics',
      label: 'Advanced Analytics',
      icon: TrendingUp,
      description: 'Performance insights',
      available: true,
    },
    {
      id: 'calendar',
      label: 'Training Calendar',
      icon: Calendar,
      description: 'Schedule and planning',
      available: true,
    },
  ];

  const quickStats = [
    {
      label: 'Active Clients',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Programs Created',
      value: '8',
      change: '+1',
      changeType: 'increase',
      icon: BookOpen,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Avg Adherence',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: Target,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Success Rate',
      value: '94%',
      change: '+2%',
      changeType: 'increase',
      icon: Award,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Training Hub Unavailable
          </h2>
          <p className="text-gray-600">
            Please log in to access your training hub.
          </p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-sm ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    action:
                      'New client Sarah joined Everest preparation program',
                    time: '2 hours ago',
                    type: 'client',
                  },
                  {
                    action:
                      'Program "Kilimanjaro Base Build" completed optimization',
                    time: '4 hours ago',
                    type: 'program',
                  },
                  {
                    action: 'Client Mike achieved new VO2 max benchmark',
                    time: '1 day ago',
                    type: 'performance',
                  },
                  {
                    action:
                      'Weekly load analysis generated for 8 active clients',
                    time: '2 days ago',
                    type: 'analytics',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full mr-4 ${
                        activity.type === 'client'
                          ? 'bg-blue-100 text-blue-600'
                          : activity.type === 'program'
                            ? 'bg-green-100 text-green-600'
                            : activity.type === 'performance'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {activity.type === 'client' && (
                        <Users className="w-4 h-4" />
                      )}
                      {activity.type === 'program' && (
                        <BookOpen className="w-4 h-4" />
                      )}
                      {activity.type === 'performance' && (
                        <TrendingUp className="w-4 h-4" />
                      )}
                      {activity.type === 'analytics' && (
                        <BarChart3 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'clients':
        return <TrainerDashboard userProfile={userProfile} />;

      case 'programs':
        return (
          <ProgramTemplates
            userProfile={userProfile}
            mode="manage"
            onCreateNew={() => {
              /* TODO: Implement program creation */
            }}
          />
        );

      case 'periodization':
        return (
          <PeriodizationDashboard
            userId={userProfile.id}
            onCreatePlan={() => {
              /* TODO: Implement plan creation */
            }}
          />
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Settings className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {navigationItems.find((item) => item.id === activeView)?.label}
            </h3>
            <p className="text-gray-600">This feature is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
                <Mountain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Training Hub
                </h2>
                <p className="text-sm text-gray-600">Professional Platform</p>
              </div>
            </div>

            {/* User Profile Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  {userProfile.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {userProfile.full_name}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {userProfile.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Summits Completed</span>
                <span className="font-semibold text-gray-900">
                  {userProfile.summits_completed}/7
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems
                .filter((item) => item.available)
                .map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  );
                })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  <PlusCircle className="w-4 h-4 mr-3 text-gray-400" />
                  Create New Program
                </button>
                <button className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 mr-3 text-gray-400" />
                  Message Clients
                </button>
                <button className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Bell className="w-4 h-4 mr-3 text-gray-400" />
                  View Notifications
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
