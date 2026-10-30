import React, { useState, useMemo, useRef } from 'react';
import { Activity, DependencyType } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter,
  Search,
  Edit2
} from 'lucide-react';

interface GanttChartProps {
  activities: Activity[];
  onUpdateActivity: (id: string, updates: Partial<Activity>) => void;
  baselineCod: string;
  forecastCod: string;
}

type TimeScale = 'day' | 'week' | 'month';

export const GanttChart: React.FC<GanttChartProps> = ({
  activities,
  onUpdateActivity,
  baselineCod,
  forecastCod,
}) => {
  const [scale, setScale] = useState<TimeScale>('week');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCriticalOnly, setFilterCriticalOnly] = useState<boolean>(false);
  const [filterWorkstream, setFilterWorkstream] = useState<string>('all');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.activityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.wbsCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCP = !filterCriticalOnly || act.isCriticalPath;
      const matchWs = filterWorkstream === 'all' || act.workstream === filterWorkstream;
      return matchSearch && matchCP && matchWs;
    });
  }, [activities, searchQuery, filterCriticalOnly, filterWorkstream]);

  const workstreams = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.workstream).filter(Boolean)));
  }, [activities]);

  // Determine global time span (e.g. from 2026-08-01 to 2027-01-15)
  const startDate = new Date('2026-08-01').getTime();
  const endDate = new Date('2027-01-15').getTime();
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Column width based on zoom & scale
  const dayWidth = useMemo(() => {
    if (scale === 'day') return 24 * zoomLevel;
    if (scale === 'week') return 7 * zoomLevel;
    return 2.5 * zoomLevel; // month
  }, [scale, zoomLevel]);

  const totalWidth = totalDays * dayWidth;

  const getPositionFromDate = (dateStr: string) => {
    if (!dateStr) return 0;
    const time = new Date(dateStr).getTime();
    const days = (time - startDate) / (1000 * 60 * 60 * 24);
    return Math.max(0, days * dayWidth);
  };

  const getWidthFromDates = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return dayWidth * 3;
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    return days * dayWidth;
  };

  // Today marker (2026-10-17)
  const todayX = getPositionFromDate('2026-10-17');
  const baselineCodX = getPositionFromDate(baselineCod || '2026-11-28');
  const forecastCodX = getPositionFromDate(forecastCod || '2026-12-18');

  // Generate header time units
  const headerUnits = useMemo(() => {
    const units = [];
    const curr = new Date(startDate);
    const end = new Date(endDate);

    while (curr <= end) {
      const dateStr = curr.toISOString().split('T')[0];
      const monthName = curr.toLocaleString('default', { month: 'short' });
      const year = curr.getFullYear();
      const dayOfMonth = curr.getDate();

      units.push({
        date: dateStr,
        monthName,
        year,
        dayOfMonth,
        time: curr.getTime(),
      });
      curr.setDate(curr.getDate() + 1);
    }
    return units;
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Gantt Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border-b border-slate-800 select-none">
        {/* Left Search & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Gantt activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44"
            />
          </div>

          <select
            value={filterWorkstream}
            onChange={e => setFilterWorkstream(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 py-1.5 px-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Workstreams</option>
            {workstreams.map(ws => (
              <option key={ws} value={ws}>{ws}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterCriticalOnly(!filterCriticalOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
              filterCriticalOnly
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-900/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Critical Path Only</span>
          </button>
        </div>

        {/* Right Scale & Zoom */}
        <div className="flex items-center gap-2">
          {/* Scale Buttons */}
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            {(['day', 'week', 'month'] as TimeScale[]).map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-all ${
                  scale === s
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Gantt Body: Left Table + Right Timeline Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Static Table: Activity Info */}
        <div className="w-[360px] flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col overflow-y-auto">
          {/* Table Header */}
          <div className="h-14 border-b border-slate-800 flex items-center px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900">
            <div className="w-16">WBS</div>
            <div className="flex-1">Activity Name</div>
            <div className="w-12 text-right">Prog</div>
            <div className="w-12 text-center">CP</div>
          </div>

          {/* Activity Rows */}
          <div className="divide-y divide-slate-800/60">
            {filteredActivities.map(act => (
              <div
                key={act.id}
                onClick={() => setEditingActivity(act)}
                className="h-10 px-3 flex items-center text-xs hover:bg-slate-800/60 cursor-pointer transition-colors group"
              >
                <div className="w-16 font-mono text-[11px] text-slate-400 truncate">
                  {act.wbsCode}
                </div>
                <div className="flex-1 pr-2 truncate font-medium text-slate-200 group-hover:text-blue-400">
                  {act.name}
                </div>
                <div className="w-12 text-right font-mono font-bold text-slate-300">
                  {act.currentWeekProgress}%
                </div>
                <div className="w-12 flex justify-center">
                  {act.isCriticalPath && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      CP
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Canvas */}
        <div ref={containerRef} className="flex-1 overflow-x-auto overflow-y-auto bg-slate-950 relative">
          <div style={{ width: `${Math.max(totalWidth, 1200)}px` }} className="relative min-h-full">
            {/* Header Dates Bar (14 height) */}
            <div className="h-14 sticky top-0 z-20 bg-slate-900/95 border-b border-slate-800 flex flex-col justify-end backdrop-blur-md">
              <div className="flex relative h-full">
                {headerUnits.map((u, i) => {
                  if (scale === 'day') {
                    return (
                      <div
                        key={i}
                        style={{ width: `${dayWidth}px` }}
                        className="flex-shrink-0 border-r border-slate-800/40 flex flex-col items-center justify-center text-[10px] text-slate-400"
                      >
                        <span className="font-semibold text-white">{u.dayOfMonth}</span>
                        <span className="text-[9px] text-slate-500">{u.monthName}</span>
                      </div>
                    );
                  } else if (scale === 'week' && i % 7 === 0) {
                    return (
                      <div
                        key={i}
                        style={{ width: `${dayWidth * 7}px` }}
                        className="flex-shrink-0 border-r border-slate-800 flex flex-col items-center justify-center text-[10px] text-slate-300"
                      >
                        <span className="font-bold text-white">{u.monthName} {u.dayOfMonth}</span>
                        <span className="text-[9px] text-slate-500">Week {Math.floor(i / 7) + 32}</span>
                      </div>
                    );
                  } else if (scale === 'month' && u.dayOfMonth === 1) {
                    return (
                      <div
                        key={i}
                        style={{ width: `${dayWidth * 30}px` }}
                        className="flex-shrink-0 border-r border-slate-800 flex flex-col items-center justify-center text-[11px] text-white font-bold"
                      >
                        <span>{u.monthName} {u.year}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Vertical Marker Lines: Today, Baseline COD, Forecast COD (Guaranteed zero-collapse, strictly whitespace-nowrap) */}
            {/* TODAY */}
            <div
              className="absolute top-14 bottom-0 w-0 pointer-events-none z-10 overflow-visible"
              style={{ left: `${todayX}px` }}
            >
              <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-amber-400" />
              <div className="sticky top-16 -translate-x-1/2 inline-flex items-center justify-center bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded shadow-lg uppercase whitespace-nowrap select-none min-w-max tracking-wider border border-amber-300">
                TODAY
              </div>
            </div>

            {/* Baseline COD */}
            <div
              className="absolute top-14 bottom-0 w-0 pointer-events-none z-10 overflow-visible"
              style={{ left: `${baselineCodX}px` }}
            >
              <div className="absolute inset-y-0 -left-[1px] w-0 border-r-2 border-dashed border-sky-400" />
              <div className="sticky top-20 -translate-x-1/2 inline-flex items-center justify-center bg-sky-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded shadow-lg uppercase whitespace-nowrap select-none min-w-max tracking-wider border border-sky-300">
                Baseline COD ({baselineCod})
              </div>
            </div>

            {/* Forecast COD */}
            <div
              className="absolute top-14 bottom-0 w-0 pointer-events-none z-10 overflow-visible"
              style={{ left: `${forecastCodX}px` }}
            >
              <div className="absolute inset-y-0 -left-[1px] w-0 border-r-2 border-dashed border-rose-500" />
              <div className="sticky top-24 -translate-x-1/2 inline-flex items-center justify-center bg-rose-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded shadow-lg uppercase whitespace-nowrap select-none min-w-max tracking-wider border border-rose-400">
                Forecast COD ({forecastCod})
              </div>
            </div>

            {/* Grid rows and activity bars */}
            <div className="divide-y divide-slate-800/40">
              {filteredActivities.map(act => {
                const barLeft = getPositionFromDate(act.plannedStartDate);
                const barWidth = getWidthFromDates(act.plannedStartDate, act.plannedFinishDate);
                const progressWidth = (barWidth * (act.currentWeekProgress || 0)) / 100;

                // Color based on status and critical path
                let barColor = 'bg-blue-600';
                let progressColor = 'bg-blue-400';
                if (act.status === 'Completed') {
                  barColor = 'bg-emerald-600';
                  progressColor = 'bg-emerald-400';
                } else if (act.status === 'Delayed' || act.isCriticalPath) {
                  barColor = act.isCriticalPath ? 'bg-rose-600' : 'bg-amber-600';
                  progressColor = act.isCriticalPath ? 'bg-rose-400' : 'bg-amber-400';
                }

                return (
                  <div
                    key={act.id}
                    className="h-10 relative flex items-center hover:bg-slate-900/40 transition-colors group cursor-pointer"
                    onClick={() => setEditingActivity(act)}
                  >
                    {/* Activity Bar */}
                    <div
                      className={`absolute h-6 rounded-md shadow-md flex items-center overflow-hidden border border-white/10 ${barColor}`}
                      style={{
                        left: `${barLeft}px`,
                        width: `${Math.max(14, barWidth)}px`,
                      }}
                      title={`${act.name}: ${act.currentWeekProgress}% (${act.plannedStartDate} to ${act.plannedFinishDate})`}
                    >
                      {/* Actual progress fill */}
                      <div
                        className={`h-full ${progressColor} opacity-90 transition-all duration-300`}
                        style={{ width: `${progressWidth}px` }}
                      />

                      {/* Inside bar label */}
                      <span className="absolute left-2 text-[10px] font-bold text-white drop-shadow truncate pr-2">
                        {act.name} ({act.currentWeekProgress}%)
                      </span>
                    </div>

                    {/* Milestone diamond if milestone */}
                    {act.isMilestone && (
                      <div
                        className="absolute w-4 h-4 bg-amber-400 transform rotate-45 border-2 border-slate-900 shadow-lg z-10"
                        style={{ left: `${barLeft + barWidth - 8}px` }}
                        title={`Milestone: ${act.name}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Activity Modal if clicked */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-400" />
                  Edit Activity Details
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {editingActivity.wbsCode} · {editingActivity.activityId}
                </span>
              </div>
              <button
                onClick={() => setEditingActivity(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Activity Name</label>
                <input
                  type="text"
                  value={editingActivity.name}
                  onChange={e => setEditingActivity({ ...editingActivity, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Planned Start</label>
                  <input
                    type="date"
                    value={editingActivity.plannedStartDate}
                    onChange={e => setEditingActivity({ ...editingActivity, plannedStartDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Planned Finish</label>
                  <input
                    type="date"
                    value={editingActivity.plannedFinishDate}
                    onChange={e => setEditingActivity({ ...editingActivity, plannedFinishDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Current %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingActivity.currentWeekProgress}
                    onChange={e => setEditingActivity({ ...editingActivity, currentWeekProgress: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Status</label>
                  <select
                    value={editingActivity.status}
                    onChange={e => setEditingActivity({ ...editingActivity, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Delay (Days)</label>
                  <input
                    type="number"
                    value={editingActivity.delayDays}
                    onChange={e => setEditingActivity({ ...editingActivity, delayDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingActivity.isCriticalPath}
                    onChange={e => setEditingActivity({ ...editingActivity, isCriticalPath: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span className="font-bold text-rose-400">Critical Path Activity (CP)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingActivity.isMilestone}
                    onChange={e => setEditingActivity({ ...editingActivity, isMilestone: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span className="font-bold text-amber-400">Milestone</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Remarks & Notes</label>
                <textarea
                  rows={2}
                  value={editingActivity.remarks}
                  onChange={e => setEditingActivity({ ...editingActivity, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingActivity(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateActivity(editingActivity.id, editingActivity);
                  setEditingActivity(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-900/40"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
