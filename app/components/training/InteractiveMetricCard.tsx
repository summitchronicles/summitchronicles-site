'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Maximize2,
  BarChart3
} from 'lucide-react';

interface MetricData {
  id: string;
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trendData?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  detailData?: {
    history: Array<{ date: string; value: number }>;
    insights: string[];
    recommendations: string[];
    comparison?: {
      label: string;
      value: number;
      benchmark: 'above' | 'below' | 'on-target';
    };
  };
  color?: string;
}

interface InteractiveMetricCardProps {
  metric: MetricData;
  onExplore?: (metricId: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function InteractiveMetricCard({
  metric,
  onExplore,
  className = '',
  size = 'medium'
}: InteractiveMetricCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Spring animation for card scaling and interactions
  const [{ scale, rotateX, rotateY, opacity }, springApi] = useSpring(() => ({
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    opacity: 1,
    config: { mass: 1, tension: 170, friction: 26 }
  }));

  // Gesture handling for enhanced interactions
  const bind = useGesture({
    onHover: ({ hovering }) => {
      setIsHovered(hovering || false);
      springApi.start({
        scale: hovering ? 1.02 : 1,
        rotateX: hovering ? -2 : 0,
        rotateY: hovering ? 2 : 0
      });
      // Reset rotation when not hovering
      if (!hovering) {
        springApi.start({ rotateX: 0, rotateY: 0, scale: 1 });
      }
    },
    onMove: ({ xy: [x, y], currentTarget }) => {
      if (!isHovered) return;
      const rect = (currentTarget as HTMLElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      springApi.start({ rotateX, rotateY });
    }
  });

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (onExplore && !isExpanded) {
      onExplore(metric.id);
    }
  }, [isExpanded, onExplore, metric.id]);

  const getTrendIcon = () => {
    if (!metric.trendData) return null;

    switch (metric.trendData.direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-yellow-400" />;
    }
  };

  const getTrendColor = () => {
    if (!metric.trendData) return 'text-gray-400';

    switch (metric.trendData.direction) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const cardSizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const iconSizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  return (
    <animated.div
      {...bind()}
      style={{
        transform: scale.to(s => `scale(${s}) perspective(1000px) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)`),
        opacity
      }}
      className={`
        group relative bg-gray-800 rounded-lg border border-gray-700 overflow-hidden
        cursor-pointer transition-all duration-300 select-none
        hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10
        ${isExpanded ? 'border-blue-500 shadow-lg shadow-blue-500/20' : ''}
        ${className}
      `}
      onClick={toggleExpanded}
      role="button"
      tabIndex={0}
      aria-label={`${metric.label}: ${metric.value}${metric.suffix || ''}. ${metric.description}. Click to expand details.`}
      aria-expanded={isExpanded}
      data-testid="metric-card"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExpanded();
        }
      }}
    >
      {/* Glow effect on hover */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
        bg-gradient-to-br ${metric.color || 'from-blue-500 to-purple-500'}
      `} />

      {/* Main card content */}
      <div className={cardSizeClasses[size]}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {/* Icon with color indicator */}
          <div className={`
            ${iconSizeClasses[size]}
            ${metric.color ? `text-${metric.color}-400` : 'text-blue-400'}
            flex-shrink-0
          `}>
            <metric.icon className="w-full h-full" />
          </div>

          {/* Expansion indicator */}
          <div className="flex items-center space-x-2">
            {metric.trendData && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {metric.trendData.percentage > 0 ? '+' : ''}{metric.trendData.percentage}%
                </span>
              </div>
            )}
            <motion.div
              animate={{
                rotate: isExpanded ? 180 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
              className="opacity-60 group-hover:opacity-100"
              data-testid="expand-icon"
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Value display */}
        <div className="mb-2">
          <div className="text-2xl font-bold text-white flex items-baseline">
            <motion.span
              key={metric.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {metric.value}
            </motion.span>
            {metric.suffix && (
              <span className="text-sm text-gray-400 ml-1">{metric.suffix}</span>
            )}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">
            {metric.label}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs text-gray-500">
          {metric.description}
        </div>

        {/* Trend information */}
        {metric.trendData && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">
                {metric.trendData.period}
              </span>
              <span className={getTrendColor()}>
                {metric.trendData.direction === 'up' ? 'Trending up' :
                 metric.trendData.direction === 'down' ? 'Trending down' : 'Stable'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expanded detail view */}
      <AnimatePresence>
        {isExpanded && metric.detailData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm"
            data-testid="expanded-content"
          >
            <div className="p-6 space-y-4">
              {/* Historical trend mini-chart */}
              {metric.detailData.history && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Recent Trend
                  </h4>
                  <div className="h-16 flex items-end space-x-1" data-testid="trend-chart">
                    {metric.detailData.history.slice(-10).map((point, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-blue-500/60 rounded-t-sm"
                        data-testid="chart-bar"
                        style={{
                          height: `${(point.value / Math.max(...metric.detailData!.history.map(p => p.value))) * 100}%`
                        }}
                        title={`${point.date}: ${point.value}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {metric.detailData.insights && metric.detailData.insights.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Insights
                  </h4>
                  <ul className="space-y-1" data-testid="insights-list">
                    {metric.detailData.insights.map((insight, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-start" data-testid="insight-item">
                        <span className="w-1 h-1 rounded-full bg-blue-400 mt-2 mr-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {metric.detailData.recommendations && metric.detailData.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-1" data-testid="recommendations-list">
                    {metric.detailData.recommendations.map((rec, index) => (
                      <li key={index} className="text-xs text-green-300 flex items-start" data-testid="recommendation-item">
                        <span className="w-1 h-1 rounded-full bg-green-400 mt-2 mr-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comparison benchmark */}
              {metric.detailData.comparison && (
                <div className="pt-3 border-t border-gray-700/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{metric.detailData.comparison.label}</span>
                    <span className={`
                      ${metric.detailData.comparison.benchmark === 'above' ? 'text-green-400' :
                        metric.detailData.comparison.benchmark === 'below' ? 'text-red-400' : 'text-yellow-400'}
                    `}>
                      {metric.detailData.comparison.value} ({metric.detailData.comparison.benchmark})
                    </span>
                  </div>
                </div>
              )}

              {/* Action to view full analytics */}
              <div className="pt-3 border-t border-gray-700/30">
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center">
                  <Maximize2 className="w-3 h-3 mr-1" />
                  View detailed analytics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state overlay */}
      <AnimatePresence>
        {!metric.value && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </animated.div>
  );
}