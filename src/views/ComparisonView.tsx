import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GitCompare, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const {
    activeProject,
    reports,
    activeReport,
    setActiveReportId,
  } = useApp();

  const sortedReports = [...reports].sort((a, b) => a.weekNumber - b.weekNumber);

  // Compare two weeks
  const [baseWeekId, setBaseWeekId] = useState<string>(() => {
    return sortedReports.length > 1 ? sortedReports[sortedReports.length - 2].id : sortedReports[0]?.id || '';
  });

  const [compareWeekId, setCompareWeekId] = useState<string>(() => {
    return activeReport?.id || sortedReports[sortedReports.length - 1]?.id || '';
  });

  const baseReport = reports.find(r => r.id === baseWeekId) || sortedReports[0];
  const compareReport = reports.find(r => r.id === compareWeekId) || activeReport || sortedReports[sortedReports.length - 1];

  if (!activeProject || !baseReport || !compareReport) return null;

  const actualDelta = compareReport.overallActualProgress - baseReport.overallActualProgress;
  const plannedDelta = compareReport.overallPlannedProgress - baseReport.overallPlannedProgress;
  const daysDelta = compareReport.daysToCod - baseReport.daysToCod;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-500" />
            Weekly Progress Comparison & Trend Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare milestones, cumulative variances, and forecast changes across any two reporting weeks.
          </p>
        </div>

        {/* Week Selectors */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold pl-2">Base:</span>
            <select
              value={baseWeekId}
              onChange={e => setBaseWeekId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-1 px-2.5 font-bold focus:outline-none"
            >
              {sortedReports.map(r => (
                <option key={r.id} value={r.id}>
                  Week {r.weekNumber} ({r.reportingDate})
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-500" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Compare:</span>
            <select
              value={compareWeekId}
              onChange={e => setCompareWeekId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-blue-400 rounded-lg py-1 px-2.5 font-bold focus:outline-none"
            >
              {sortedReports.map(r => (
                <option key={r.id} value={r.id}>
                  Week {r.weekNumber} ({r.reportingDate})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Variance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Actual Progress Delta */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Actual Progress Growth
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              +{actualDelta.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">
              ({baseReport.overallActualProgress}% → {compareReport.overallActualProgress}%)
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Weekly Achieved Rate:</span>
            <strong className="text-white">+{compareReport.weeklyActualProgress}%</strong>
          </div>
        </div>

        {/* Planned Delta */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Planned Progress Target
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-400">
              +{plannedDelta.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">
              ({baseReport.overallPlannedProgress}% → {compareReport.overallPlannedProgress}%)
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Overall Variance:</span>
            <strong className="text-rose-400">
              {(compareReport.overallActualProgress - compareReport.overallPlannedProgress).toFixed(1)}%
            </strong>
          </div>
        </div>

        {/* COD Days Delta */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Days to Commissioning (COD)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">
              {compareReport.daysToCod} d
            </span>
            <span className="text-xs text-slate-400">
              ({daysDelta < 0 ? `${daysDelta} d elapsed` : '0 d'})
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Forecast COD:</span>
            <strong className="text-slate-200">{compareReport.forecastCod || activeProject.forecastCod}</strong>
          </div>
        </div>
      </div>

      {/* Side by Side Week Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Activity Progress Variance (Week {baseReport.weekNumber} vs Week {compareReport.weekNumber})
          </h3>
          <span className="text-xs text-slate-400">
            Comparing {compareReport.activities.length} activities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">WBS</th>
                <th className="py-3 px-3">Activity Name</th>
                <th className="py-3 px-3 text-right">Week {baseReport.weekNumber} %</th>
                <th className="py-3 px-3 text-right">Week {compareReport.weekNumber} %</th>
                <th className="py-3 px-3 text-right">Delta %</th>
                <th className="py-3 px-3">Base Status</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-center">Delay Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {compareReport.activities.map(act => {
                const baseAct = baseReport.activities.find(b => b.activityId === act.activityId) || {
                  currentWeekProgress: 0,
                  status: 'Not Started',
                  delayDays: 0,
                };
                const delta = act.currentWeekProgress - baseAct.currentWeekProgress;
                const delayDelta = (act.delayDays || 0) - (baseAct.delayDays || 0);

                return (
                  <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400">{act.wbsCode}</td>
                    <td className="py-3 px-3 font-medium text-white max-w-xs truncate">
                      {act.name}
                      {act.isCriticalPath && (
                        <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          CP
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {baseAct.currentWeekProgress}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {act.currentWeekProgress}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {delta > 0 ? (
                        <span className="text-emerald-400">+{delta}%</span>
                      ) : delta < 0 ? (
                        <span className="text-rose-400">{delta}%</span>
                      ) : (
                        <span className="text-slate-500">0%</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{baseAct.status}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          act.status === 'Completed'
                            ? 'text-emerald-400'
                            : act.status === 'Delayed'
                            ? 'text-rose-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      {delayDelta > 0 ? (
                        <span className="text-rose-400">+{delayDelta}d</span>
                      ) : delayDelta < 0 ? (
                        <span className="text-emerald-400">{delayDelta}d</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
