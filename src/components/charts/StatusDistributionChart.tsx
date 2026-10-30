import React from 'react';
import { Activity } from '../../types';

interface StatusDistributionChartProps {
  activities: Activity[];
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ activities }) => {
  const counts = {
    Completed: activities.filter(a => a.status === 'Completed').length,
    'In Progress': activities.filter(a => a.status === 'In Progress').length,
    Delayed: activities.filter(a => a.status === 'Delayed').length,
    'Not Started': activities.filter(a => a.status === 'Not Started').length,
  };

  const total = activities.length || 1;

  const data = [
    { label: 'Completed', count: counts.Completed, color: '#10B981', bg: 'bg-emerald-500' },
    { label: 'In Progress', count: counts['In Progress'], color: '#0066FF', bg: 'bg-blue-600' },
    { label: 'Delayed', count: counts.Delayed, color: '#EF4444', bg: 'bg-rose-500' },
    { label: 'Not Started', count: counts['Not Started'], color: '#64748B', bg: 'bg-slate-500' },
  ];

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const slices = data.map(item => {
    const percent = (item.count / total) * 100;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulated / 100) * circumference);
    accumulated += percent;
    return {
      ...item,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
          />
          {slices.map((slice, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-white">{activities.length}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Activities</span>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 w-full">
        {data.map(item => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.bg}`} />
              <span className="text-slate-300 font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{item.count}</span>
              <span className="text-slate-500 text-[11px]">
                ({((item.count / total) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
