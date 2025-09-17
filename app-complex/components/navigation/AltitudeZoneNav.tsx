'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  MapIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface ZoneConfig {
  id: string;
  name: string;
  altitude: string;
  color: string;
  description: string;
  routes: string[];
  icon: React.ReactNode;
  elevation: number; // for visual stacking
}

const zones: ZoneConfig[] = [
  {
    id: 'base',
    name: 'Base Camp',
    altitude: '0-2000m',
    color: 'var(--altitude-base)',
    description: 'Essential information and getting started',
    routes: ['/', '/about', '/getting-started'],
    icon: <HomeIcon className="w-5 h-5" />,
    elevation: 0,
  },
  {
    id: 'low',
    name: 'Training Zone',
    altitude: '2000-4000m',
    color: 'var(--altitude-low)',
    description: 'Training data, activities, and fitness tracking',
    routes: ['/training', '/training-analytics', '/strava'],
    icon: <ChartBarIcon className="w-5 h-5" />,
    elevation: 1,
  },
  {
    id: 'mid',
    name: 'Expedition Logs',
    altitude: '4000-6000m',
    color: 'var(--altitude-mid)',
    description: 'Blog posts, expedition stories, and documentation',
    routes: ['/blog', '/expeditions', '/gear'],
    icon: <BookOpenIcon className="w-5 h-5" />,
    elevation: 2,
  },
  {
    id: 'high',
    name: 'Route Planning',
    altitude: '6000-8000m',
    color: 'var(--altitude-high)',
    description: 'Advanced route planning and navigation tools',
    routes: ['/routes', '/maps', '/weather'],
    icon: <MapIcon className="w-5 h-5" />,
    elevation: 3,
  },
  {
    id: 'summit',
    name: 'Summit Command',
    altitude: '8000m+',
    color: 'var(--altitude-summit)',
    description: 'AI-powered insights, search, and community features',
    routes: ['/ask', '/community', '/admin'],
    icon: <MagnifyingGlassIcon className="w-5 h-5" />,
    elevation: 4,
  },
];

interface AltitudeZoneNavProps {
  className?: string;
  variant?: 'sidebar' | 'horizontal' | 'mini';
  showLabels?: boolean;
}

export default function AltitudeZoneNav({
  className = '',
  variant = 'sidebar',
  showLabels = true,
}: AltitudeZoneNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeZone, setActiveZone] = useState<string>('base');
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine active zone based on current route
  useEffect(() => {
    if (!pathname) return;
    const currentZone = zones.find((zone) =>
      zone.routes.some((route) => pathname.startsWith(route))
    );
    if (currentZone) {
      setActiveZone(currentZone.id);
    }
  }, [pathname]);

  const handleZoneClick = (zone: ZoneConfig) => {
    // Navigate to the primary route for this zone
    const primaryRoute = zone.routes[0];
    router.push(primaryRoute);
  };

  const getZoneVariant = (zoneId: string) => {
    if (zoneId === activeZone) return 'active';
    if (zoneId === hoveredZone) return 'hovered';
    return 'default';
  };

  if (variant === 'mini') {
    return (
      <div className={clsx('flex flex-col space-y-2', className)}>
        {zones.map((zone) => (
          <motion.button
            key={zone.id}
            onClick={() => handleZoneClick(zone)}
            onHoverStart={() => setHoveredZone(zone.id)}
            onHoverEnd={() => setHoveredZone(null)}
            className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
              'relative overflow-hidden group'
            )}
            style={{
              backgroundColor:
                zone.id === activeZone
                  ? zone.color
                  : 'rgba(255, 255, 255, 0.1)',
              borderLeft:
                zone.id === activeZone
                  ? `3px solid ${zone.color}`
                  : '3px solid transparent',
            }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={clsx(
                'text-white transition-colors',
                zone.id === activeZone ? 'text-white' : 'text-gray-300'
              )}
            >
              {zone.icon}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredZone === zone.id && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-full ml-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50"
                >
                  {zone.name}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <nav
        className={clsx('flex space-x-1 p-2 rounded-xl glass-card', className)}
      >
        {zones.map((zone) => (
          <motion.button
            key={zone.id}
            onClick={() => handleZoneClick(zone)}
            onHoverStart={() => setHoveredZone(zone.id)}
            onHoverEnd={() => setHoveredZone(null)}
            className={clsx(
              'px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300',
              'text-sm font-medium relative overflow-hidden'
            )}
            style={{
              backgroundColor:
                zone.id === activeZone ? zone.color : 'transparent',
              color:
                zone.id === activeZone ? 'white' : 'rgba(255, 255, 255, 0.7)',
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {zone.icon}
            {showLabels && <span>{zone.name}</span>}

            {/* Active indicator */}
            {zone.id === activeZone && (
              <motion.div
                layoutId="activeZone"
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: zone.color, opacity: 0.2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>
    );
  }

  // Default sidebar variant
  return (
    <motion.nav
      className={clsx(
        'altitude-zone-nav flex flex-col space-y-1 p-4',
        className
      )}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? 280 : 240 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Altitude Zones</h3>
        <div className="h-px bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      {/* Zone Navigation Items */}
      <div className="space-y-2 relative">
        {/* Elevation indicator line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-altitude-base via-altitude-mid to-altitude-summit opacity-30" />

        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.button
              onClick={() => handleZoneClick(zone)}
              onHoverStart={() => setHoveredZone(zone.id)}
              onHoverEnd={() => setHoveredZone(null)}
              className={clsx(
                'w-full p-4 rounded-xl flex items-center space-x-4 transition-all duration-300',
                'text-left relative overflow-hidden group',
                zone.id === activeZone && 'transform scale-105'
              )}
              style={{
                backgroundColor:
                  zone.id === activeZone
                    ? `${zone.color}20`
                    : hoveredZone === zone.id
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent',
                borderLeft:
                  zone.id === activeZone
                    ? `4px solid ${zone.color}`
                    : '4px solid transparent',
              }}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Zone icon with elevation indicator */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative"
                style={{
                  backgroundColor: zone.color,
                  boxShadow:
                    zone.id === activeZone
                      ? `0 0 20px ${zone.color}40`
                      : 'none',
                }}
              >
                <div className="text-white relative z-10">{zone.icon}</div>

                {/* Pulse effect for active zone */}
                {zone.id === activeZone && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: zone.color }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Zone info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-semibold truncate">
                    {zone.name}
                  </h4>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${zone.color}30`,
                      color: zone.color,
                    }}
                  >
                    {zone.altitude}
                  </span>
                </div>

                {showLabels && (
                  <motion.p
                    className="text-gray-300 text-sm truncate"
                    animate={{
                      opacity: isExpanded ? 1 : 0.7,
                      fontSize: isExpanded ? '0.875rem' : '0.75rem',
                    }}
                  >
                    {zone.description}
                  </motion.p>
                )}
              </div>

              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ backgroundColor: zone.color }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.05 }}
                transition={{ duration: 0.2 }}
              />

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
                }}
                animate={{
                  x: hoveredZone === zone.id ? ['-100%', '100%'] : '-100%',
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                }}
              />
            </motion.button>

            {/* Route indicators */}
            <AnimatePresence>
              {zone.id === activeZone && zone.routes.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-14 mt-2 space-y-1"
                >
                  {zone.routes.slice(1).map((route) => (
                    <button
                      key={route}
                      onClick={() => router.push(route)}
                      className="block w-full text-left px-3 py-1 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {route.replace('/', '') || 'Home'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Current altitude display */}
      <div className="mt-8 p-3 rounded-lg bg-white/5">
        <div className="text-xs text-gray-400 mb-1">Current Altitude</div>
        <div className="text-lg font-bold text-white">
          {zones.find((z) => z.id === activeZone)?.altitude}
        </div>
      </div>
    </motion.nav>
  );
}
