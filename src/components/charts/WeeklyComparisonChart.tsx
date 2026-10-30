import React from 'react';
import { WeeklyReport } from '../../types';

interface WeeklyComparisonChartProps {
  reports: WeeklyReport[];
}

export const WeeklyComparisonChart: React.FC<WeeklyComparisonChartProps> = ({ reports }) => {
  const sorted = [...reports].sort((a, b) => a.weekNumber - b.weekNumber);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white">Weekly Performance Comparison</h4>
          <p className="text-xs text-slate-400">Planned vs Actual cumulative progress across reporting cycles</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm" />
            <span className="text-slate-300">Planned %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
            <span className="text-slate-300">Actual %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
            <span className="text-slate-300">Weekly Delta %</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map(rep => {
          const delta = rep.weeklyActualProgress;
          return (
            <div key={rep.id} className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30">
                    Week {rep.weekNumber}
                  </span>
                  <span className="text-slate-400">{rep.reportingDate}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">
                    Plan: <strong className="text-sky-400">{rep.overallPlannedProgress}%</strong>
                  </span>
                  <span className="text-slate-300">
                    Actual: <strong className="text-emerald-400">{rep.overallActualProgress}%</strong>
                  </span>
                  <span className="text-slate-300">
                    Achieved: <strong className="text-amber-400">+{delta}%</strong>
                  </span>
                  <span className="text-rose-400 font-medium">
                    Variance: {(rep.overallActualProgress - rep.overallPlannedProgress).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bars comparison */}
              <div className="space-y-1.5">
                {/* Planned bar */}
                <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, rep.overallPlannedProgress)}%` }}
                  />
                </div>
                {/* Actual bar */}
                <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, rep.overallActualProgress)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
