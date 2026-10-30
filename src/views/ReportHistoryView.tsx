import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Trash2, 
  Eye, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { generateWeeklyReportPptx } from '../services/pptxGenerator';

export const ReportHistoryView: React.FC = () => {
  const {
    activeProject,
    reports,
    activeReport,
    setActiveReportId,
    deleteReport,
    setCurrentView,
  } = useApp();

  const sortedReports = [...reports].sort((a, b) => b.weekNumber - a.weekNumber);

  const handleExportHistoricalPpt = async (report: any) => {
    if (!activeProject) return;
    try {
      await generateWeeklyReportPptx(activeProject, report);
    } catch (e) {
      console.error(e);
      alert('Error downloading historical report: ' + (e as Error).message);
    }
  };

  if (!activeProject) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          Weekly Report Archive & Version History
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable historical snapshots of all previous reporting weeks for {activeProject.name}.
        </p>
      </div>

      {/* History Cards */}
      <div className="space-y-3">
        {sortedReports.map(rep => {
          const isActive = rep.id === activeReport?.id;
          return (
            <div
              key={rep.id}
              className={`p-4 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                isActive
                  ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-950'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center font-mono font-bold text-blue-400">
                  <span className="text-[10px] uppercase text-slate-500">WK</span>
                  <span className="text-base leading-none text-white">{rep.weekNumber}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Week {rep.weekNumber} Progress Report
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      v{rep.version}.0
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Current Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-1 font-mono">
                    <span>Period: {rep.reportingStartDate} – {rep.reportingEndDate}</span>
                    <span>· Prepared by: {rep.preparedBy}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex items-center gap-6">
                <div className="text-right text-xs">
                  <div className="text-slate-400">
                    Actual: <strong className="text-emerald-400 font-bold">{rep.overallActualProgress}%</strong> / Plan: <strong className="text-sky-400">{rep.overallPlannedProgress}%</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Weekly Achieved: <strong className="text-amber-400">+{rep.weeklyActualProgress}%</strong> · Days to COD: {rep.daysToCod}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveReportId(rep.id);
                      setCurrentView('report-builder');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Deck</span>
                  </button>

                  <button
                    onClick={() => handleExportHistoricalPpt(rep)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded-lg transition-colors"
                    title="Download PPTX for this historical week"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {sortedReports.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete archive for Week ${rep.weekNumber}?`)) {
                          deleteReport(rep.id);
                        }
                      }}
                      className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Delete Historical Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
