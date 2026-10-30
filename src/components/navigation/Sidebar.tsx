import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  ListTodo,
  GitBranch,
  BarChart3,
  Camera,
  AlertOctagon,
  GitCompare,
  FileSpreadsheet,
  Download,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    sidebarOpen,
    setSidebarOpen,
    activeProject,
    projects,
    setActiveProjectId,
    activeReport,
    reports,
    setActiveReportId,
    saveStatus,
    user
  } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'My Projects', icon: <FolderKanban className="w-4 h-4" />, badge: `${projects.length}` },
    { id: 'weekly-input', label: 'Weekly Progress', icon: <CalendarCheck className="w-4 h-4" />, badge: `Wk ${activeReport?.weekNumber || 1}` },
    { id: 'activities', label: 'Activity Management', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'gantt', label: 'Gantt Chart', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'timeline', label: 'Project Timeline', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'site-progress', label: 'Site Progress', icon: <Camera className="w-4 h-4" /> },
    { id: 'risks', label: 'Risks & Issues', icon: <AlertOctagon className="w-4 h-4" />, badge: `${activeReport?.risks.length || 0}` },
    { id: 'comparison', label: 'Weekly Comparison', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'report-builder', label: 'Report Builder', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'ppt-export', label: 'PPT Export', icon: <Download className="w-4 h-4 text-amber-400" /> },
    { id: 'report-history', label: 'Report History', icon: <History className="w-4 h-4" />, badge: `${reports.length}` },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 z-30 select-none ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand & Toggle Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/40">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
                <span className="text-base tracking-tighter">EPC</span>
              </div>
              <div className="truncate">
                <h1 className="text-sm font-extrabold text-white tracking-wide">
                  PROGRESS<span className="text-blue-500">PRO</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Enterprise EPC Suite</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white mx-auto shadow-md">
              <span className="text-sm">E</span>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Project & Reporting Week Selector Card */}
        {sidebarOpen && (
          <div className="p-3 border-b border-slate-800 bg-slate-900/60 space-y-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Project
              </label>
              <select
                value={activeProject?.id || ''}
                onChange={e => setActiveProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none truncate"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Reporting Week
              </label>
              <select
                value={activeReport?.id || ''}
                onChange={e => setActiveReportId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs font-semibold text-sky-400 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              >
                {reports.map(r => (
                  <option key={r.id} value={r.id}>
                    Week {r.weekNumber} ({r.reportingDate})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                } ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Save & User Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/40">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  {saveStatus === 'saving' && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                  {saveStatus === 'saved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {saveStatus === 'offline' && <HardDrive className="w-3.5 h-3.5 text-rose-400" />}
                  <span className="capitalize">{saveStatus === 'saved' ? 'All changes saved' : saveStatus}</span>
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">v1.0</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="All changes saved" />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-slate-800 flex items-center justify-around py-2 px-1 backdrop-blur-md">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] ${
            currentView === 'dashboard' ? 'text-blue-500 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentView('weekly-input')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] ${
            currentView === 'weekly-input' ? 'text-blue-500 font-bold' : 'text-slate-400'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Input</span>
        </button>
        <button
          onClick={() => setCurrentView('gantt')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] ${
            currentView === 'gantt' ? 'text-blue-500 font-bold' : 'text-slate-400'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Gantt</span>
        </button>
        <button
          onClick={() => setCurrentView('report-builder')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] ${
            currentView === 'report-builder' ? 'text-blue-500 font-bold' : 'text-slate-400'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Report</span>
        </button>
        <button
          onClick={() => setCurrentView('ppt-export')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] ${
            currentView === 'ppt-export' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>PPT</span>
        </button>
      </div>
    </>
  );
};
