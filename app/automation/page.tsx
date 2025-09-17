'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import {
  Bot,
  Zap,
  Calendar,
  MessageSquare,
  TrendingUp,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  Workflow,
  Brain,
  Target,
} from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  trigger: string;
  actions: string[];
  lastRun: string;
  nextRun: string;
  successRate: number;
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with demo workflows
    setWorkflows([
      {
        id: '1',
        name: 'AI Training Insights',
        description:
          'Automatically analyze Strava activities and generate personalized training recommendations',
        status: 'active',
        trigger: 'New Strava activity detected',
        actions: [
          'Fetch activity data from Strava API',
          'Analyze performance metrics with AI',
          'Generate training insights',
          'Update training dashboard',
          'Send recommendations via email',
        ],
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        successRate: 95,
      },
      {
        id: '2',
        name: 'Weather Alert System',
        description:
          'Monitor climbing conditions and send safety alerts for planned expeditions',
        status: 'active',
        trigger: 'Severe weather conditions detected',
        actions: [
          'Check weather APIs for target locations',
          'Analyze climbing safety conditions',
          'Generate safety recommendations',
          'Send urgent alerts if dangerous',
          'Update expedition planning dashboard',
        ],
        lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        successRate: 98,
      },
      {
        id: '3',
        name: 'Content Auto-Publishing',
        description:
          'Automatically create and publish blog posts from training activities and insights',
        status: 'paused',
        trigger: 'Weekly training summary ready',
        actions: [
          'Compile weekly training statistics',
          'Generate blog post content with AI',
          'Create social media excerpts',
          'Schedule publication in CMS',
          'Update newsletter content',
        ],
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        successRate: 87,
      },
      {
        id: '4',
        name: 'Gear Maintenance Tracker',
        description:
          'Track equipment usage and automatically schedule maintenance reminders',
        status: 'active',
        trigger: 'Equipment usage threshold reached',
        actions: [
          'Monitor equipment usage from activities',
          'Calculate wear and maintenance needs',
          'Generate maintenance schedules',
          'Send gear check reminders',
          'Update equipment inventory',
        ],
        lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        successRate: 92,
      },
    ]);
    setLoading(false);
  }, []);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((workflow) =>
        workflow.id === id
          ? {
              ...workflow,
              status: workflow.status === 'active' ? 'paused' : 'active',
            }
          : workflow
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const formatNextRun = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `in ${minutes}m`;
    } else if (hours < 24) {
      return `in ${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `in ${days}d`;
    }
  };

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-alpine-blue/10 rounded-xl">
                  <Bot className="w-8 h-8 text-alpine-blue" />
                </div>
                <h1 className="text-4xl font-light text-spa-charcoal">
                  Automation Center
                </h1>
              </div>
              <p className="text-xl text-spa-charcoal/70 max-w-3xl">
                Advanced automation workflows powered by AI to streamline your
                training, content creation, and expedition planning.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Workflow className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    {workflows.filter((w) => w.status === 'active').length}
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">
                  Active Workflows
                </h3>
                <p className="text-sm text-spa-charcoal/60">
                  Currently running
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    {Math.round(
                      workflows.reduce((acc, w) => acc + w.successRate, 0) /
                        workflows.length
                    )}
                    %
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">Success Rate</h3>
                <p className="text-sm text-spa-charcoal/60">
                  Average across all workflows
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    2.4k
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">
                  Actions Executed
                </h3>
                <p className="text-sm text-spa-charcoal/60">This month</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    18h
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">Time Saved</h3>
                <p className="text-sm text-spa-charcoal/60">This month</p>
              </div>
            </div>

            {/* Workflows */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-spa-charcoal">
                  Active Workflows
                </h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors">
                  <Zap className="w-4 h-4" />
                  <span>Create Workflow</span>
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-6 shadow-spa-soft animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded mb-3 w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="bg-white rounded-xl shadow-spa-soft overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(workflow.status)}
                              <h3 className="text-lg font-medium text-spa-charcoal">
                                {workflow.name}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  workflow.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : workflow.status === 'paused'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {workflow.status}
                              </span>
                            </div>
                            <p className="text-spa-charcoal/70 mb-4">
                              {workflow.description}
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-spa-charcoal mb-1">
                                  Trigger
                                </p>
                                <p className="text-spa-charcoal/60">
                                  {workflow.trigger}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-spa-charcoal mb-1">
                                  Last Run
                                </p>
                                <p className="text-spa-charcoal/60">
                                  {formatTime(workflow.lastRun)}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-spa-charcoal mb-1">
                                  Next Run
                                </p>
                                <p className="text-spa-charcoal/60">
                                  {formatNextRun(workflow.nextRun)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 ml-6">
                            <div className="text-right">
                              <p className="text-lg font-bold text-spa-charcoal">
                                {workflow.successRate}%
                              </p>
                              <p className="text-sm text-spa-charcoal/60">
                                Success rate
                              </p>
                            </div>
                            <button
                              onClick={() => toggleWorkflow(workflow.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                workflow.status === 'active'
                                  ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {workflow.status === 'active' ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                            </button>
                            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                              <Settings className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <p className="font-medium text-spa-charcoal mb-3">
                            Workflow Actions
                          </p>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {workflow.actions.map((action, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <div className="w-1.5 h-1.5 bg-alpine-blue rounded-full"></div>
                                <span className="text-spa-charcoal/70">
                                  {action}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Automation Features */}
            <div className="mt-12 bg-gradient-to-r from-alpine-blue/5 to-summit-gold/5 rounded-xl p-8">
              <h3 className="text-xl font-medium text-spa-charcoal mb-6">
                Phase 3 Automation Capabilities
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      AI-Powered Analysis
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      Automatic training insights and recommendations using
                      local LLM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      Content Generation
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      Automated blog posts and social media content from
                      training data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      Smart Scheduling
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      Intelligent training and expedition planning based on
                      conditions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      Goal Tracking
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      Automatic progress monitoring and adaptive goal adjustment
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      Safety Monitoring
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      Real-time weather and condition alerts for planned
                      expeditions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal mb-1">
                      Performance Analytics
                    </h4>
                    <p className="text-sm text-spa-charcoal/70">
                      Continuous analysis and optimization of training
                      effectiveness
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
