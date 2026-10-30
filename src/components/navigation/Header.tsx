import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Undo2, 
  Redo2, 
  Download, 
  PlusCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  ShieldAlert,
  ChevronDown,
  Layers
} from 'lucide-react';
import { generateWeeklyReportPptx } from '../../services/pptxGenerator';

export const Header: React.FC = () => {
  const {
    activeProject,
    activeReport,
    canUndo,
    canRedo,
    undo,
    redo,
    setCurrentView,
    createNewWeekReport,
  } = useApp();

  const handleDownloadQuickPptx = async () => {
    if (!activeProject || !activeReport) return;
    try {
      await generateWeeklyReportPptx(activeProject, activeReport);
    } catch (err) {
      console.error(err);
      alert('Error generating PowerPoint: ' + (err as Error).message);
    }
  };

  const handleCreateNextWeek = () => {
    if (!activeReport) return;
    const nextWeekNum = activeReport.weekNumber + 1;
    const nextDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const ok = confirm(`Initialize new reporting week (Week ${nextWeekNum})? Previous weeks will be fully preserved in history.`);
    if (ok) {
      createNewWeekReport(nextWeekNum, nextDate);
      setCurrentView('weekly-input');
    }
  };

  if (!activeProject) return null;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-20 flex-shrink-0">
      {/* Left: Project title & metadata pill */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-extrabold text-white truncate">
              {activeProject.name}
            </h2>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {activeProject.capacity}
            </span>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeProject.status === 'Delayed'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {activeProject.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <strong className="text-slate-300 font-semibold">{activeProject.clientName}</strong>
            </span>
            <span className="hidden md:flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{activeProject.location}</span>
            </span>
            <span className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-amber-400">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>COD: {activeProject.baselineCod} ({activeReport?.daysToCod || 0}d remaining)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Undo/Redo, New Week, PPT Download) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded text-slate-400 hover:text-white transition-colors ${
              !canUndo ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded text-slate-400 hover:text-white transition-colors ${
              !canRedo ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* New Reporting Week Button */}
        <button
          onClick={handleCreateNextWeek}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>New Week</span>
        </button>

        {/* Export PPT Button */}
        <button
          onClick={handleDownloadQuickPptx}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 transition-all active:scale-95"
          title="Generate and Download Editable PowerPoint (.pptx)"
        >
          <Download className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Export PPT</span>
          <span className="sm:hidden">PPT</span>
        </button>
      </div>
    </header>
  );
};
