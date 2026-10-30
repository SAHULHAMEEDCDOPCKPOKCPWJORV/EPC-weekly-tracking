import React from 'react';
import { Activity } from '../../types';

interface WorkstreamTimelineChartProps {
  activities: Activity[];
}

export const WorkstreamTimelineChart: React.FC<WorkstreamTimelineChartProps> = ({ activities }) => {
  // Extract workstreams or use the standard reference workstreams from the Swelect PPT
  const workstreamConfig = [
    { name: 'Land', start: '2026-05-31', end: '2026-09-25', progress: 33, status: 'Behind' },
    { name: 'Approvals', start: '2026-09-03', end: '2026-11-28', progress: 2, status: 'Behind' },
    { name: 'CEIG Approval', start: '2026-10-01', end: '2026-11-04', progress: 5, status: 'Behind' },
    { name: 'WBA', start: '2026-10-01', end: '2026-10-31', progress: 0, status: 'Behind' },
    { name: 'Bay Work', start: '2026-10-01', end: '2026-11-17', progress: 0, status: 'Behind' },
    { name: 'Transmission Line', start: '2026-09-10', end: '2026-10-10', progress: 52, status: 'Active' },
    { name: 'Site Land Prep', start: '2026-09-04', end: '2026-09-09', progress: 100, status: 'Done' },
    { name: 'Detailed Engineering', start: '2026-09-05', end: '2026-09-23', progress: 100, status: 'Done' },
    { name: 'Procurement & Delivery', start: '2026-08-03', end: '2026-11-09', progress: 34, status: 'Active' },
    { name: 'Construction', start: '2026-09-15', end: '2026-12-03', progress: 22, status: 'Active' },
    { name: 'Handover (HOTO)', start: '2026-11-28', end: '2026-12-15', progress: 0, status: 'Pending' },
    { name: 'Compound Wall', start: '2026-09-07', end: '2026-10-27', progress: 50, status: 'Active' },
  ];

  // Overlay any dynamic progress from current activities
  const mapped = workstreamConfig.map(ws => {
    const matchingActs = activities.filter(a => (a.workstream || '').toLowerCase() === ws.name.toLowerCase());
    if (matchingActs.length > 0) {
      const avg = Math.round(matchingActs.reduce((s, a) => s + (a.currentWeekProgress || 0), 0) / matchingActs.length);
      const isBehind = matchingActs.some(a => a.status === 'Delayed');
      return {
        ...ws,
        progress: avg,
        status: avg === 100 ? 'Done' : (isBehind ? 'Behind' : 'Active'),
      };
    }
    return ws;
  });

  // Timeline bounds: July 1, 2026 to Jan 31, 2027 (214 days total)
  const timelineStart = new Date('2026-07-01').getTime();
  const timelineEnd = new Date('2027-01-31').getTime();
  const totalDuration = timelineEnd - timelineStart;

  const getPercentLeft = (dateStr: string) => {
    const d = new Date(dateStr).getTime();
    return Math.max(0, Math.min(100, ((d - timelineStart) / totalDuration) * 100));
  };

  // Today position (e.g. 17 Oct 2026)
  const todayLeft = getPercentLeft('2026-10-17');

  const months = ['Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 'Jan 27'];

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-xl select-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Monthly Project Delivery Timeline
            <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-medium">
              12 Workstreams
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized workstream execution vs baseline window
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-emerald-500 rounded-sm" />
            <span className="text-slate-300">Complete (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-blue-500 rounded-sm" />
            <span className="text-slate-300">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-rose-500 rounded-sm" />
            <span className="text-slate-300">Behind Schedule</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-0.5 h-3 bg-amber-400 inline-block" />
            <span className="text-amber-400 font-semibold">Today (17 Oct)</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 pb-2 text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider pl-48">
            {months.map(m => (
              <div key={m} className="border-l border-slate-800/60 first:border-l-0">
                {m}
              </div>
            ))}
          </div>

          {/* Today vertical line */}
          <div
            className="absolute top-7 bottom-0 w-[2px] bg-amber-400 z-10 pointer-events-none"
            style={{ left: `calc(12rem + ${todayLeft * 0.75}%)` }}
          >
            <span className="absolute -top-6 -translate-x-1/2 bg-amber-400 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
              TODAY
            </span>
          </div>

          {/* Workstream bars */}
          <div className="space-y-2 mt-3">
            {mapped.map(ws => {
              const leftP = getPercentLeft(ws.start);
              const rightP = getPercentLeft(ws.end);
              const widthP = Math.max(3, rightP - leftP);

              let barColor = 'bg-blue-600';
              if (ws.status === 'Done') barColor = 'bg-emerald-500';
              else if (ws.status === 'Behind') barColor = 'bg-rose-500';

              return (
                <div key={ws.name} className="flex items-center group hover:bg-slate-800/40 py-1 px-1 rounded transition-colors">
                  {/* Left Name & dates */}
                  <div className="w-48 pr-3 flex-shrink-0">
                    <div className="text-xs font-semibold text-slate-200 truncate" title={ws.name}>
                      {ws.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {ws.start.substring(5)} – {ws.end.substring(5)}
                    </div>
                  </div>

                  {/* Right Timeline Area */}
                  <div className="flex-1 relative h-6 bg-slate-950/40 rounded border border-slate-800/50">
                    <div
                      className={`absolute top-1 bottom-1 rounded flex items-center justify-between px-2 text-[10px] font-bold text-white shadow-sm transition-all ${barColor}`}
                      style={{
                        left: `${leftP}%`,
                        width: `${widthP}%`,
                      }}
                    >
                      <span className="truncate">{ws.progress}%</span>
                      {ws.status === 'Done' && <span>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
