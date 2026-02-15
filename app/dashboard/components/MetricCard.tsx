'use client';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: string;
}

export default function MetricCard({ label, value, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
          {label}
        </span>
        {icon && <span className="text-lg opacity-40">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {trend && <div className="text-xs text-gray-500 mt-1">{trend}</div>}
    </div>
  );
}
