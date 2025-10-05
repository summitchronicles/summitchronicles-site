'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Calendar,
  Target,
  ChevronRight,
  Home,
  ArrowLeft,
  Zap
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  isNew?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Training Overview',
    href: '/training',
    icon: Target,
    description: 'Training phases and expedition timeline'
  },
  {
    id: 'realtime',
    label: 'Live Data',
    href: '/training/realtime',
    icon: Activity,
    description: 'Real-time metrics and wellness data',
    badge: 'Enhanced',
    isNew: true
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/training/analytics',
    icon: BarChart3,
    description: 'Performance trends and insights',
    badge: 'Coming Soon'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    href: '/training/schedule',
    icon: Calendar,
    description: 'Training calendar and planning',
    badge: 'Coming Soon'
  }
];

interface TrainingNavigationProps {
  variant?: 'full' | 'breadcrumb' | 'tabs';
  showBackButton?: boolean;
  className?: string;
}

export function TrainingNavigation({
  variant = 'full',
  showBackButton = false,
  className = ''
}: TrainingNavigationProps) {
  const pathname = usePathname();
  const currentItem = navigationItems.find(item => item.href === pathname);

  if (variant === 'breadcrumb') {
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`}>
        {showBackButton && (
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
        )}
        <ChevronRight className="w-4 h-4 text-gray-600" />
        <Link
          href="/training"
          className={`flex items-center transition-colors ${
            pathname === '/training'
              ? 'text-blue-400 font-medium'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 mr-1" />
          <span>Training</span>
        </Link>
        {currentItem && currentItem.href !== '/training' && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white font-medium flex items-center">
              <currentItem.icon className="w-4 h-4 mr-1" />
              {currentItem.label}
            </span>
          </>
        )}
      </nav>
    );
  }

  if (variant === 'tabs') {
    return (
      <nav className={`border-b border-gray-800 ${className}`}>
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const isComingSoon = item.badge === 'Coming Soon';

            return (
              <div key={item.id} className="relative">
                {isComingSoon ? (
                  <div className="flex items-center px-1 py-4 text-sm font-medium text-gray-500 cursor-not-allowed">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-1 py-4 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        item.isNew
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    );
  }

  // Full navigation variant
  return (
    <nav className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Target className="w-5 h-5 text-blue-400 mr-2" />
          Training Hub
        </h3>
        {showBackButton && (
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href;
          const isComingSoon = item.badge === 'Coming Soon';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {isComingSoon ? (
                <div className="relative p-4 bg-gray-800/50 border border-gray-700 rounded-lg opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <item.icon className="w-6 h-6 text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-400">{item.label}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <Link href={item.href}>
                  <div className={`relative p-4 border rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                    isActive
                      ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <item.icon className={`w-6 h-6 mr-3 ${
                          isActive ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                        <div>
                          <h4 className={`font-medium ${
                            isActive ? 'text-blue-300' : 'text-white'
                          }`}>
                            {item.label}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                            item.isNew
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.isNew && (
                          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                        )}
                        <ChevronRight className={`w-4 h-4 ml-2 ${
                          isActive ? 'text-blue-400' : 'text-gray-500'
                        }`} />
                      </div>
                    </div>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                          style={{ originX: 0 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">4/7</div>
            <div className="text-xs text-gray-400">Seven Summits</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">834</div>
            <div className="text-xs text-gray-400">Days to Everest</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">85%</div>
            <div className="text-xs text-gray-400">Training Progress</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Quick action buttons component
export function TrainingQuickActions({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link
        href="/training/realtime"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Activity className="w-4 h-4 mr-2" />
        View Live Data
      </Link>
      <button className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
        <Calendar className="w-4 h-4 mr-2" />
        Log Training
      </button>
      <button className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
        <BarChart3 className="w-4 h-4 mr-2" />
        View Analytics
      </button>
    </div>
  );
}