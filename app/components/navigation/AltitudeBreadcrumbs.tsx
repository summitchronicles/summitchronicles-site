"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

interface BreadcrumbItem {
  label: string;
  path: string;
  altitude?: string;
  zone?: string;
  zoneColor?: string;
}

interface AltitudeBreadcrumbsProps {
  className?: string;
  maxItems?: number;
  showAltitude?: boolean;
}

// Zone mapping for altitude display
const zoneMap = {
  '/': { zone: 'Base Camp', altitude: '1,200m', color: 'var(--altitude-base)' },
  '/training': { zone: 'Training Zone', altitude: '2,500m', color: 'var(--altitude-low)' },
  '/blog': { zone: 'Expedition Logs', altitude: '4,200m', color: 'var(--altitude-mid)' },
  '/routes': { zone: 'Route Planning', altitude: '6,800m', color: 'var(--altitude-high)' },
  '/ask': { zone: 'Summit Command', altitude: '8,848m', color: 'var(--altitude-summit)' },
  '/admin': { zone: 'Summit Command', altitude: '8,848m', color: 'var(--altitude-summit)' },
  '/about': { zone: 'Base Camp', altitude: '1,200m', color: 'var(--altitude-base)' },
  '/gear': { zone: 'Expedition Logs', altitude: '4,200m', color: 'var(--altitude-mid)' },
  '/expeditions': { zone: 'Expedition Logs', altitude: '4,200m', color: 'var(--altitude-mid)' },
  '/training-analytics': { zone: 'Training Zone', altitude: '2,500m', color: 'var(--altitude-low)' },
};

export default function AltitudeBreadcrumbs({ 
  className = "",
  maxItems = 4,
  showAltitude = true 
}: AltitudeBreadcrumbsProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return [];
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbs.push({
      label: 'Base Camp',
      path: '/',
      ...zoneMap['/']
    });

    // Build breadcrumbs from path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Get zone info for this path
      const zoneInfo = zoneMap[currentPath as keyof typeof zoneMap];
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: currentPath,
        zone: zoneInfo?.zone,
        altitude: zoneInfo?.altitude,
        zoneColor: zoneInfo?.color
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const displayBreadcrumbs = breadcrumbs.slice(-maxItems);
  const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  const handleBreadcrumbClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav className={clsx("altitude-breadcrumbs", className)}>
      {/* Zone indicator banner */}
      {showAltitude && currentBreadcrumb?.zone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg glass-card flex items-center justify-between"
          style={{ 
            borderLeft: `4px solid ${currentBreadcrumb.zoneColor}`,
            backgroundColor: `${currentBreadcrumb.zoneColor}10`
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: currentBreadcrumb.zoneColor }}
            />
            <div>
              <div className="text-sm font-medium text-white">
                Current Zone: {currentBreadcrumb.zone}
              </div>
              <div className="text-xs text-gray-400">
                Altitude: {currentBreadcrumb.altitude}
              </div>
            </div>
          </div>
          
          {/* Elevation progress indicator */}
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-400 mb-1">Elevation</div>
            <div className="flex items-center space-x-1">
              {Object.values(zoneMap).map((zone, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-2 h-6 rounded-sm transition-opacity",
                    zone.color === currentBreadcrumb.zoneColor 
                      ? "opacity-100" 
                      : "opacity-30"
                  )}
                  style={{ 
                    backgroundColor: zone.color,
                    height: `${12 + index * 4}px`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Breadcrumb navigation */}
      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2 text-sm"
      >
        {displayBreadcrumbs.map((breadcrumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <motion.li
              key={breadcrumb.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              {/* Breadcrumb item */}
              <motion.button
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                disabled={isLast}
                className={clsx(
                  "flex items-center space-x-1 px-2 py-1 rounded-lg transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-white/20",
                  isLast 
                    ? "text-white font-medium cursor-default" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                )}
                whileHover={!isLast ? { scale: 1.05, x: 2 } : undefined}
                whileTap={!isLast ? { scale: 0.95 } : undefined}
              >
                {isFirst && <HomeIcon className="w-4 h-4" />}
                <span className={clsx(
                  "transition-colors",
                  isLast && breadcrumb.zoneColor && "text-gradient-alpine"
                )}>
                  {breadcrumb.label}
                </span>
                
                {/* Zone indicator dot */}
                {breadcrumb.zoneColor && (
                  <div
                    className={clsx(
                      "w-2 h-2 rounded-full",
                      isLast ? "animate-pulse" : ""
                    )}
                    style={{ 
                      backgroundColor: breadcrumb.zoneColor,
                      opacity: isLast ? 1 : 0.6
                    }}
                  />
                )}
              </motion.button>

              {/* Separator */}
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="text-gray-500"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </motion.div>
              )}
            </motion.li>
          );
        })}
      </motion.ol>

      {/* Route progress indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ 
            backgroundColor: currentBreadcrumb?.zoneColor || 'var(--color-alpine-blue)',
            width: `${((breadcrumbs.length - 1) / Object.keys(zoneMap).length) * 100}%`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${((breadcrumbs.length - 1) / Object.keys(zoneMap).length) * 100}%` }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.div>
    </nav>
  );
}