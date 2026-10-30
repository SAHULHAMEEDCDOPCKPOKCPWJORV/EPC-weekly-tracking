import React, { useState } from 'react';
import { WeeklyReport } from '../../types';

interface SCurveChartProps {
  reports: WeeklyReport[];
  baselineCod: string;
  forecastCod: string;
}

export const SCurveChart: React.FC<SCurveChartProps> = ({
  reports,
  baselineCod,
  forecastCod,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    week: number;
    planned: number;
    actual: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);

  // Generate complete curve points based on project timeline (Week 36 to Week 52)
  const sortedReports = [...reports].sort((a, b) => a.weekNumber - b.weekNumber);

  // Create timeline weeks
  const allWeeks = [
    { week: 36, planned: 8, actual: 8, date: '2026-09-05' },
    { week: 37, planned: 16, actual: 15, date: '2026-09-12' },
    { week: 38, planned: 28, actual: 22, date: '2026-09-19' },
    { week: 39, planned: 42, actual: 27, date: '2026-09-26' },
    { week: 40, planned: 56.4, actual: 30.5, date: '2026-10-03' },
    { week: 41, planned: 61.2, actual: 33.2, date: '2026-10-10' },
    { week: 42, planned: 66.1, actual: 36.0, date: '2026-10-17' }, // Current report
    { week: 43, planned: 74, actual: null, date: '2026-10-24' },
    { week: 44, planned: 82, actual: null, date: '2026-10-31' },
    { week: 45, planned: 89, actual: null, date: '2026-11-07' },
    { week: 46, planned: 94, actual: null, date: '2026-11-14' },
    { week: 47, planned: 98, actual: null, date: '2026-11-21' },
    { week: 48, planned: 100, actual: null, date: '2026-11-28' }, // Baseline COD
    { week: 49, planned: 100, actual: null, date: '2026-12-05' },
    { week: 50, planned: 100, actual: null, date: '2026-12-12' },
    { week: 51, planned: 100, actual: null, date: '2026-12-18' }, // Forecast COD
  ];

  // Map known reports onto this timeline
  sortedReports.forEach(r => {
    const item = allWeeks.find(w => w.week === r.weekNumber);
    if (item) {
      item.planned = r.overallPlannedProgress;
      item.actual = r.overallActualProgress;
      item.date = r.reportingDate;
    }
  });

  const width = 720;
  const height = 300;
  const padL = 45;
  const padR = 25;
  const padT = 20;
  const padB = 40;

  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const getX = (index: number) => padL + (index / (allWeeks.length - 1)) * chartW;
  const getY = (val: number) => padT + chartH - (val / 100) * chartH;

  // Build SVG path for Planned
  const plannedPath = allWeeks
    .map((w, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(w.planned).toFixed(1)}`)
    .join(' ');

  // Build SVG path for Actual
  const actualWeeks = allWeeks.filter(w => w.actual !== null);
  const actualPath = actualWeeks
    .map((w, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(w.actual as number).toFixed(1)}`)
    .join(' ');

  // Forecast path from last actual to 100% at forecast week (week 51)
  const lastActual = actualWeeks[actualWeeks.length - 1];
  const lastActualIdx = actualWeeks.length - 1;
  const forecastPath = `M ${getX(lastActualIdx)} ${getY(lastActual.actual as number)} ` +
    `L ${getX(allWeeks.length - 1)} ${getY(100)}`;

  return (
    <div className="relative w-full overflow-hidden bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Planned vs Actual S-Curve Progression
            <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
              EPC Benchmark
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Cumulative progress variance and forecast COD trajectory
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400 rounded-full inline-block" />
            <span className="text-slate-300">Baseline Plan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />
            <span className="text-slate-300">Actual Achieved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-amber-400 rounded-full inline-block" />
            <span className="text-slate-300">Forecast Trend</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[550px] overflow-visible">
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={val}>
              <line
                x1={padL}
                y1={getY(val)}
                x2={width - padR}
                y2={getY(val)}
                stroke="#1E293B"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={padL - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-500 font-mono"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Baseline COD vertical marker */}
          <line
            x1={getX(12)}
            y1={padT}
            x2={getX(12)}
            y2={height - padB}
            stroke="#38BDF8"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text
            x={getX(12)}
            y={padT - 6}
            textAnchor="middle"
            className="text-[9px] fill-sky-400 font-bold"
          >
            Baseline COD
          </text>

          {/* Forecast COD vertical marker */}
          <line
            x1={getX(15)}
            y1={padT}
            x2={getX(15)}
            y2={height - padB}
            stroke="#EF4444"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text
            x={getX(15)}
            y={padT - 6}
            textAnchor="middle"
            className="text-[9px] fill-red-400 font-bold"
          >
            Forecast COD
          </text>

          {/* Forecast projection line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
          />

          {/* Planned Curve */}
          <path
            d={plannedPath}
            fill="none"
            stroke="#38BDF8"
            strokeWidth={2.5}
          />

          {/* Actual Curve */}
          <path
            d={actualPath}
            fill="none"
            stroke="#10B981"
            strokeWidth={3}
          />

          {/* Actual Area fill */}
          {actualWeeks.length > 0 && (
            <path
              d={`${actualPath} L ${getX(actualWeeks.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`}
              fill="url(#actualGradient)"
            />
          )}

          {/* Points & Interactive Nodes */}
          {allWeeks.map((w, idx) => {
            const isActual = w.actual !== null;
            const cx = getX(idx);
            const cyActual = isActual ? getY(w.actual as number) : 0;
            const cyPlanned = getY(w.planned);

            return (
              <g key={w.week} className="cursor-pointer">
                {/* Planned point */}
                <circle
                  cx={cx}
                  cy={cyPlanned}
                  r={3.5}
                  fill="#0B1528"
                  stroke="#38BDF8"
                  strokeWidth={2}
                />

                {/* Actual point */}
                {isActual && (
                  <circle
                    cx={cx}
                    cy={cyActual}
                    r={5}
                    fill="#10B981"
                    stroke="#0B1528"
                    strokeWidth={2}
                    className="hover:r-7 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        week: w.week,
                        planned: w.planned,
                        actual: w.actual as number,
                        date: w.date,
                        x: cx,
                        y: cyActual,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )}

                {/* Week label on bottom axis */}
                {(idx % 2 === 0 || idx === allWeeks.length - 1) && (
                  <text
                    x={cx}
                    y={height - padB + 16}
                    textAnchor="middle"
                    className="text-[9.5px] fill-slate-400 font-medium"
                  >
                    W{w.week}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-950/95 border border-slate-700 px-3 py-2 rounded-lg shadow-2xl text-xs backdrop-blur-md transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 10}%`,
            }}
          >
            <div className="font-bold text-white mb-1 border-b border-slate-800 pb-1 flex justify-between gap-3">
              <span>Week {hoveredPoint.week}</span>
              <span className="text-slate-400 font-normal">{hoveredPoint.date}</span>
            </div>
            <div className="text-emerald-400 font-semibold flex justify-between gap-3">
              <span>Actual:</span>
              <span>{hoveredPoint.actual}%</span>
            </div>
            <div className="text-sky-400 font-semibold flex justify-between gap-3">
              <span>Planned:</span>
              <span>{hoveredPoint.planned}%</span>
            </div>
            <div className="text-red-400 font-semibold flex justify-between gap-3 pt-1 border-t border-slate-800 mt-1">
              <span>Variance:</span>
              <span>{(hoveredPoint.actual - hoveredPoint.planned).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 px-1">
        <span>Baseline COD: <strong className="text-slate-200">{baselineCod}</strong></span>
        <span>Forecast COD: <strong className="text-amber-400">{forecastCod}</strong></span>
        <span>Current Variance: <strong className="text-rose-400">-30.1%</strong></span>
      </div>
    </div>
  );
};
