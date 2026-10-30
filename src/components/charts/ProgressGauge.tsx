import React from 'react';

interface ProgressGaugeProps {
  actual: number;
  planned: number;
  size?: number;
  label?: string;
  subLabel?: string;
}

export const ProgressGauge: React.FC<ProgressGaugeProps> = ({
  actual,
  planned,
  size = 200,
  label = 'Actual Progress',
  subLabel,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc calculation for actual
  const actualPercent = Math.min(100, Math.max(0, actual));
  const strokeDashoffset = circumference - (actualPercent / 100) * circumference;

  // Planned target angle
  const plannedPercent = Math.min(100, Math.max(0, planned));
  const plannedAngle = (plannedPercent / 100) * 360 - 90;
  const plannedRad = (plannedAngle * Math.PI) / 180;
  const px = size / 2 + radius * Math.cos(plannedRad);
  const py = size / 2 + radius * Math.sin(plannedRad);

  const getStatusColor = () => {
    if (actual >= planned) return '#10B981'; // Green (Ahead/on track)
    if (planned - actual <= 10) return '#F59E0B'; // Amber
    return '#EF4444'; // Red (Delayed)
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        {/* Planned indicator dashed track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#38BDF8"
          strokeWidth={strokeWidth}
          strokeDasharray={`${(circumference * plannedPercent) / 100} ${circumference}`}
          strokeOpacity={0.2}
        />
        {/* Actual progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getStatusColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        {/* Planned marker dot */}
        <circle
          cx={px}
          cy={py}
          r={6}
          fill="#38BDF8"
          stroke="#0B1528"
          strokeWidth={2}
          className="transform rotate-90 origin-center"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {actual.toFixed(1)}%
        </span>
        <span className="text-xs font-semibold text-slate-400 mt-0.5">
          Plan: <span className="text-sky-400 font-bold">{planned.toFixed(1)}%</span>
        </span>
        <span className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
          {label}
        </span>
      </div>

      {subLabel && (
        <div className="mt-2 text-xs text-slate-400 font-medium text-center">
          {subLabel}
        </div>
      )}
    </div>
  );
};
