import React from 'react';
import { useApp } from '../context/AppContext';
import { ProgressGauge } from '../components/charts/ProgressGauge';
import { SCurveChart } from '../components/charts/SCurveChart';
import { StatusDistributionChart } from '../components/charts/StatusDistributionChart';
import { WeeklyComparisonChart } from '../components/charts/WeeklyComparisonChart';
import { WorkstreamTimelineChart } from '../components/charts/WorkstreamTimelineChart';
import { 
  FolderKanban, 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  AlertOctagon,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeProject,
    activeReport,
    projects,
    reports,
    activities,
    setCurrentView,
  } = useApp();

  if (!activeProject || !activeReport) return null;

  // Compute metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'Delayed').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const delayedProjects = projects.filter(p => p.status === 'Delayed').length;

  const criticalActivities = activities.filter(a => a.isCriticalPath);
  const delayedActivities = activities.filter(a => a.status === 'Delayed');
  const completedActivities = activities.filter(a => a.status === 'Completed');

  const variance = activeReport.overallActualProgress - activeReport.overallPlannedProgress;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Progress */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Overall Actual</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {activeReport.overallActualProgress}%
            </span>
            <span className="text-xs text-slate-400">
              of {activeReport.overallPlannedProgress}% plan
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className={`font-semibold ${variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Variance: {variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Week {activeReport.weekNumber}</span>
          </div>
        </div>

        {/* KPI 2: Days to COD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Days to COD</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">
              {activeReport.daysToCod}
            </span>
            <span className="text-xs text-slate-400">days left</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Forecast COD: <strong className="text-slate-200">{activeReport.forecastCod}</strong></span>
          </div>
        </div>

        {/* KPI 3: Critical Path Activities */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Critical Path (CP)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">
              {criticalActivities.length}
            </span>
            <span className="text-xs text-slate-400">critical items</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="text-rose-400 font-medium">
              {criticalActivities.filter(c => c.status === 'Delayed').length} delayed on CP
            </span>
            <button
              onClick={() => setCurrentView('gantt')}
              className="text-blue-400 hover:underline text-[11px] font-semibold"
            >
              View Gantt →
            </button>
          </div>
        </div>

        {/* KPI 4: Portfolio Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Portfolio Projects</span>
            <FolderKanban className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {totalProjects}
            </span>
            <span className="text-xs text-slate-400">
              ({activeProjects} active)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{delayedProjects} Delayed · {completedProjects} Done</span>
            <button
              onClick={() => setCurrentView('projects')}
              className="text-blue-400 hover:underline text-[11px] font-semibold"
            >
              Manage →
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Gauge & S-Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Circular Progress Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <h3 className="text-sm font-bold text-white">Overall Project Progress</h3>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
              Weighted %
            </span>
          </div>

          <div className="py-4">
            <ProgressGauge
              actual={activeReport.overallActualProgress}
              planned={activeReport.overallPlannedProgress}
              size={210}
              label="Cumulative Actual"
              subLabel={`Reporting Period ending ${activeReport.reportingEndDate || activeReport.reportingDate}`}
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs pt-3 border-t border-slate-800">
            <div className="p-2 bg-slate-950/60 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Weekly Achieved</span>
              <span className="font-bold text-emerald-400 text-sm">+{activeReport.weeklyActualProgress}%</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Weekly Planned</span>
              <span className="font-bold text-sky-400 text-sm">+{activeReport.weeklyPlannedProgress}%</span>
            </div>
          </div>
        </div>

        {/* Right: S-Curve Chart (2 cols) */}
        <div className="lg:col-span-2">
          <SCurveChart
            reports={reports}
            baselineCod={activeProject.baselineCod}
            forecastCod={activeReport.forecastCod || activeProject.forecastCod}
          />
        </div>
      </div>

      {/* Row 3: Status Distribution & Weekly Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Activity Status Distribution</h3>
            <button
              onClick={() => setCurrentView('activities')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              All Activities ({activities.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <StatusDistributionChart activities={activities} />
        </div>

        <div>
          <WeeklyComparisonChart reports={reports} />
        </div>
      </div>

      {/* Row 4: Monthly Project Delivery Timeline Preview */}
      <div>
        <WorkstreamTimelineChart activities={activities} />
      </div>

      {/* Row 5: Critical & Delayed Activities Table Preview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Critical Path & Delayed Activities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              High-priority activities requiring project manager intervention
            </p>
          </div>
          <button
            onClick={() => setCurrentView('weekly-input')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow"
          >
            Update Weekly Progress →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2">WBS</th>
                <th className="pb-2">Activity Name</th>
                <th className="pb-2">Workstream</th>
                <th className="pb-2">Planned Finish</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Progress</th>
                <th className="pb-2 text-center">Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {delayedActivities.slice(0, 6).map(act => (
                <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-mono text-slate-400">{act.wbsCode}</td>
                  <td className="py-2.5 font-medium text-white flex items-center gap-2">
                    {act.name}
                    {act.isCriticalPath && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        CP
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-400">{act.workstream}</td>
                  <td className="py-2.5 text-slate-300 font-mono">{act.plannedFinishDate}</td>
                  <td className="py-2.5">
                    <span className="font-bold text-rose-400">
                      Delayed {act.delayDays} d
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-slate-200">
                    {act.currentWeekProgress}%
                  </td>
                  <td className="py-2.5 text-center text-rose-400 font-bold font-mono">
                    +{act.delayDays}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
