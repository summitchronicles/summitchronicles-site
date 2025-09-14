"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
  EyeIcon,
  PaperAirplaneIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  TrainerDashboardStats,
  ClientProgressSummary,
  TrainerClientRelationship,
  TrainingProgram
} from '@/lib/multi-user/types';

interface TrainerDashboardProps {
  trainerId: string;
}

export default function TrainerDashboard({ trainerId }: TrainerDashboardProps) {
  const [stats, setStats] = useState<TrainerDashboardStats | null>(null);
  const [clients, setClients] = useState<ClientProgressSummary[]>([]);
  const [recentPrograms, setRecentPrograms] = useState<TrainingProgram[]>([]);
  const [activeRelationships, setActiveRelationships] = useState<TrainerClientRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'clients' | 'programs' | 'analytics'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [trainerId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchClients(),
        fetchPrograms(),
        fetchRelationships()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const response = await fetch(`/api/training/trainer/dashboard?trainerId=${trainerId}&action=stats`);
    if (response.ok) {
      const data = await response.json();
      setStats(data.stats);
    }
  };

  const fetchClients = async () => {
    const response = await fetch(`/api/training/trainer/dashboard?trainerId=${trainerId}&action=clients`);
    if (response.ok) {
      const data = await response.json();
      setClients(data.clients);
    }
  };

  const fetchPrograms = async () => {
    const response = await fetch(`/api/training/trainer/dashboard?trainerId=${trainerId}&action=programs`);
    if (response.ok) {
      const data = await response.json();
      setRecentPrograms(data.programs);
    }
  };

  const fetchRelationships = async () => {
    const response = await fetch(`/api/training/trainer/dashboard?trainerId=${trainerId}&action=relationships`);
    if (response.ok) {
      const data = await response.json();
      setActiveRelationships(data.relationships);
    }
  };

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAdherenceBarColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 75) return 'from-yellow-500 to-orange-500';
    if (score >= 60) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-summitGold border-r-transparent"></div>
          <p className="mt-4 text-white/60">Loading trainer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trainer <span className="text-summitGold">Dashboard</span>
          </h1>
          <p className="text-xl text-white/70">
            Manage your clients and programs for Seven Summits preparation
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
            {[
              { key: 'overview', label: 'Overview', icon: ChartBarIcon },
              { key: 'clients', label: 'Clients', icon: UsersIcon },
              { key: 'programs', label: 'Programs', icon: AcademicCapIcon },
              { key: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedView(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedView === tab.key
                    ? 'bg-summitGold text-black shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats && [
                {
                  icon: UsersIcon,
                  label: 'Active Clients',
                  value: stats.active_clients,
                  subtext: `${stats.total_clients} total`,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: AcademicCapIcon,
                  label: 'Active Programs',
                  value: stats.active_programs,
                  subtext: `${stats.total_programs} total`,
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: TrophyIcon,
                  label: 'Avg Adherence',
                  value: `${stats.client_adherence_avg}%`,
                  subtext: 'Client performance',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: ChatBubbleLeftRightIcon,
                  label: 'Unread Messages',
                  value: stats.unread_messages,
                  subtext: 'Requires attention',
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                  <div className="text-xs text-white/40 mt-1">{stat.subtext}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Client Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UsersIcon className="w-6 h-6 text-summitGold" />
                  Client Progress Overview
                </h2>
                <button className="px-4 py-2 bg-summitGold/20 border border-summitGold/30 text-summitGold rounded-xl hover:bg-summitGold/30 transition-colors text-sm">
                  View All Clients
                </button>
              </div>

              <div className="space-y-4">
                {clients.slice(0, 5).map((client, index) => (
                  <motion.div
                    key={client.client_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-summitGold/20 rounded-full flex items-center justify-center">
                          <span className="text-summitGold font-bold text-sm">
                            {client.client_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{client.client_name}</div>
                          <div className="text-white/60 text-sm">
                            {client.current_program || 'No active program'} • Week {client.weeks_completed}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-bold ${getAdherenceColor(client.adherence_score)}`}>
                          {client.adherence_score}%
                        </div>
                        <div className="text-white/40 text-xs">Adherence</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>Progress</span>
                        <span>{client.adherence_score}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${getAdherenceBarColor(client.adherence_score)} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${client.adherence_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Programs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-green-400" />
                  Recent Programs
                </h3>
                
                <div className="space-y-3">
                  {recentPrograms.slice(0, 4).map((program, index) => (
                    <div key={program.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <div className="text-white font-medium text-sm">{program.name}</div>
                        <div className="text-white/60 text-xs">
                          {program.duration_weeks} weeks • {program.difficulty_level}
                        </div>
                      </div>
                      <div className="text-green-400 text-xs">
                        {program.target_summit && `${program.target_summit} focus`}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 px-4 py-2 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/10 transition-colors text-sm">
                  Create New Program
                </button>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-purple-400" />
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  {[
                    {
                      action: 'Add New Client',
                      description: 'Invite a new athlete to your coaching program',
                      icon: PlusIcon,
                      color: 'text-blue-400'
                    },
                    {
                      action: 'Review Client Progress',
                      description: 'Check weekly progress reports and adjustments',
                      icon: EyeIcon,
                      color: 'text-green-400'
                    },
                    {
                      action: 'Send Message',
                      description: 'Communicate with clients about their training',
                      icon: PaperAirplaneIcon,
                      color: 'text-purple-400'
                    },
                    {
                      action: 'Schedule Check-in',
                      description: 'Book progress review sessions',
                      icon: CalendarDaysIcon,
                      color: 'text-yellow-400'
                    }
                  ].map((action, index) => (
                    <button
                      key={action.action}
                      className="w-full flex items-start gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors text-left"
                    >
                      <action.icon className={`w-5 h-5 ${action.color} mt-0.5`} />
                      <div>
                        <div className="text-white font-medium text-sm">{action.action}</div>
                        <div className="text-white/60 text-xs">{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {selectedView === 'clients' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Client Management</h2>
              <button className="px-6 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors">
                Add New Client
              </button>
            </div>

            <div className="grid gap-6">
              {clients.map((client, index) => (
                <motion.div
                  key={client.client_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-summitGold/20 rounded-full flex items-center justify-center">
                        <span className="text-summitGold font-bold text-lg">
                          {client.client_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{client.client_name}</h3>
                        <div className="text-white/60">
                          {client.current_program ? `Program: ${client.current_program}` : 'No active program'}
                        </div>
                        <div className="text-white/40 text-sm">
                          Week {client.weeks_completed} • {client.adherence_score}% adherence
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors text-sm">
                        Send Message
                      </button>
                    </div>
                  </div>

                  {/* Recent Benchmarks */}
                  {client.recent_benchmarks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {client.recent_benchmarks.slice(0, 3).map((benchmark, bIndex) => (
                        <div key={bIndex} className="bg-white/5 rounded-lg p-3">
                          <div className="text-white/60 text-xs mb-1">{benchmark.test_name}</div>
                          <div className="text-white font-bold">
                            {benchmark.primary_value} {benchmark.units}
                          </div>
                          <div className="text-white/40 text-xs">
                            {new Date(benchmark.test_date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                      <span>Overall Progress</span>
                      <span>{client.adherence_score}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${getAdherenceBarColor(client.adherence_score)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${client.adherence_score}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Programs & Analytics tabs would be implemented similarly */}
      </div>
    </div>
  );
}