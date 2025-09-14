"use client";

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Dynamic imports for chart components to reduce bundle size
export const LineChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  { 
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading chart...</span>
    </div>
  }
);

export const Line = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Line })),
  { ssr: false }
);

export const AreaChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.AreaChart })),
  { 
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading chart...</span>
    </div>
  }
);

export const Area = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Area })),
  { ssr: false }
);

export const BarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.BarChart })),
  { 
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading chart...</span>
    </div>
  }
);

export const Bar = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Bar })),
  { ssr: false }
);

export const XAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.XAxis })),
  { ssr: false }
);

export const YAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.YAxis })),
  { ssr: false }
);

export const CartesianGrid = dynamic(
  () => import('recharts').then(mod => ({ default: mod.CartesianGrid })),
  { ssr: false }
);

export const Tooltip = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Tooltip })),
  { ssr: false }
);

export const Legend = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Legend })),
  { ssr: false }
);

export const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })),
  { ssr: false }
);

export const PieChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PieChart })),
  { 
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading chart...</span>
    </div>
  }
);

export const Pie = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Pie })),
  { ssr: false }
);

export const Cell = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Cell })),
  { ssr: false }
);