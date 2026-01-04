import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'glass';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  children,
  variant = 'default',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 transition-all duration-300',
        {
          'bg-glass-panel border border-white/5 hover:border-summit-gold/20':
            variant === 'default',
          'bg-summit-gold-500/10 border border-summit-gold/30':
            variant === 'highlight',
          'backdrop-blur-md bg-white/5 border border-white/10':
            variant === 'glass',
        },
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500">
          {title}
        </h3>
        {Icon && <Icon className="w-4 h-4 text-summit-gold-400" />}
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-oswald font-light text-white tracking-wide">
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-400 font-light">{subtitle}</div>
        )}
      </div>

      {trend && (
        <div
          className={cn('mt-4 flex items-center text-xs font-mono', {
            'text-green-400': trend === 'up',
            'text-red-400': trend === 'down',
            'text-gray-400': trend === 'stable',
          })}
        >
          <span>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
          </span>
        </div>
      )}

      {children}
    </motion.div>
  );
};
