import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity } from '../types';
import { 
  ListTodo, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle,
  GitCommit
} from 'lucide-react';

export const ActivityManagementView: React.FC = () => {
  const {
    activeProject,
    activeReport,
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    duplicateActivity,
    setCurrentView,
  } = useApp();

  const [search, setSearch] = useState<string>('');
  const [selectedWorkstream, setSelectedWorkstream] = useState<string>('all');

  const workstreams: string[] = Array.from(new Set(activities.map(a => a.workstream).filter(Boolean))) as string[];

  const filtered = activities.filter(a => {
    const matchS = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.wbsCode.toLowerCase().includes(search.toLowerCase()) ||
      a.activityId.toLowerCase().includes(search.toLowerCase());
    const matchW = selectedWorkstream === 'all' || a.workstream === selectedWorkstream;
    return matchS && matchW;
  });

  if (!activeProject || !activeReport) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-blue-500" />
            Master Activity & WBS Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize work breakdown structure (WBS), activity weightages and task allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('weekly-input')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-900/40"
          >
            Go to Weekly Progress Table →
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity or WBS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedWorkstream}
          onChange={e => setSelectedWorkstream(e.target.value)}
          className="text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 py-1.5 px-3 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Workstreams ({activities.length})</option>
          {workstreams.map(ws => (
            <option key={ws} value={ws}>
              {ws} ({activities.filter(a => a.workstream === ws).length})
            </option>
          ))}
        </select>
      </div>

      {/* Grouped by Workstream Cards */}
      <div className="space-y-6">
        {workstreams
          .filter(ws => selectedWorkstream === 'all' || ws === selectedWorkstream)
          .map(ws => {
            const wsActs = filtered.filter(a => a.workstream === ws);
            if (wsActs.length === 0) return null;
            const avgProgress = Math.round(wsActs.reduce((s, a) => s + a.currentWeekProgress, 0) / wsActs.length);
            const totalWeight = wsActs.reduce((s, a) => s + a.weightage, 0);

            return (
              <div key={ws} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-bold text-white">{ws}</h3>
                    <span className="text-xs text-slate-400">({wsActs.length} activities)</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">Weight: <strong className="text-white">{totalWeight}%</strong></span>
                    <span className="text-slate-400">Progress: <strong className="text-emerald-400">{avgProgress}%</strong></span>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/60 text-xs">
                  {wsActs.map(act => (
                    <div key={act.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 w-12">{act.wbsCode}</span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {act.name}
                            {act.isCriticalPath && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                CP
                              </span>
                            )}
                            {act.isMilestone && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Milestone
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {act.plannedStartDate} → {act.plannedFinishDate} · Responsible: {act.responsiblePerson}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right font-mono">
                          <span className="font-bold text-white text-sm">{act.currentWeekProgress}%</span>
                          <span className={`block text-[10px] font-semibold ${
                            act.status === 'Delayed' ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {act.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => duplicateActivity(act.id)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${act.name}"?`)) {
                                deleteActivity(act.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
