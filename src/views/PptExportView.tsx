import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateWeeklyReportPptx } from '../services/pptxGenerator';
import { 
  Download, 
  CheckSquare, 
  Square, 
  FileCheck, 
  Layers, 
  Palette, 
  Printer, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const PptExportView: React.FC = () => {
  const {
    activeProject,
    activeReport,
  } = useApp();

  const [slideOptions, setSlideOptions] = useState({
    includeCover: true,
    includeTimeline: true,
    includeGanttChart: true,
    includeStatusDetail: true,
    includeSiteProgress: true,
    includeNextTwoWeeks: true,
    includeRisks: true,
    includeSummary: true,
  });

  const [theme, setTheme] = useState<'navy' | 'light' | 'corporate'>('corporate');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const toggleOption = (key: keyof typeof slideOptions) => {
    setSlideOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDownloadPptx = async () => {
    if (!activeProject || !activeReport) return;
    try {
      setIsExporting(true);
      await generateWeeklyReportPptx(activeProject, activeReport, {
        ...slideOptions,
        includeGanttChart: slideOptions.includeGanttChart,
        theme,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Error exporting PowerPoint presentation: ' + (err as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  if (!activeProject || !activeReport) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-amber-400" />
          PowerPoint Generation & Download Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Generate genuinely editable PowerPoint presentations (.pptx) adhering to EPC executive standards.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {/* Project & Week Target Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              TARGET REPORT DECK
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{activeProject.name}</h3>
            <p className="text-xs text-slate-400">
              Client: <strong className="text-slate-200">{activeProject.clientName}</strong> · Week {activeReport.weekNumber} ({activeReport.reportingDate})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Format: <strong className="text-amber-400">Microsoft PowerPoint (.pptx)</strong>
            </span>
          </div>
        </div>

        {/* Slide Selection Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Select Slides to Include in Export
            </h4>
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setSlideOptions({
                  includeCover: true,
                  includeTimeline: true,
                  includeGanttChart: true,
                  includeStatusDetail: true,
                  includeSiteProgress: true,
                  includeNextTwoWeeks: true,
                  includeRisks: true,
                  includeSummary: true,
                })}
                className="text-blue-400 hover:underline"
              >
                Select All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'includeCover', title: 'Slide 1: Project Cover', desc: 'Logos, client, COD dates & site cover' },
              { key: 'includeTimeline', title: 'Slide 2: Delivery Timeline', desc: 'Progress gauge, workstreams, milestones' },
              { key: 'includeGanttChart', title: 'Slide 3: Weekly Gantt Schedule', desc: 'Primavera P6 color Gantt, baseline & today lines' },
              { key: 'includeStatusDetail', title: 'Slide 4: Status Details', desc: 'All activities, 3.0" wide delay column, zero overlap' },
              { key: 'includeSiteProgress', title: 'Slide 5: Site Photographs', desc: 'Genuine user-uploaded photos & GPS tags' },
              { key: 'includeNextTwoWeeks', title: 'Slide 6: Next 2 Weeks Plan', desc: 'Dedicated 14-day look-ahead execution table' },
              { key: 'includeRisks', title: 'Slide 7: Risks & Client Actions', desc: 'Impact matrix, what we need from you' },
              { key: 'includeSummary', title: 'Slide 8: Weekly Summary', desc: 'Achievements, corrective actions, targets' },
            ].map(item => {
              const checked = (slideOptions as any)[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleOption(item.key as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 ${
                    checked
                      ? 'bg-blue-600/10 border-blue-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{item.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Theme Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-sky-400" />
            Executive Visual Theme
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'corporate', label: 'Swelect / Dexler Navy & Orange', desc: 'Reference template theme with dark navy headers & vibrant accents' },
              { id: 'light', label: 'Clean Enterprise Minimalist', desc: 'Crisp light background with steel blue typography' },
              { id: 'navy', label: 'High-Contrast Dark Enterprise', desc: 'Full dark navy slide background for boardroom presentations' },
            ].map(t => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  theme === t.id
                    ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{t.label}</span>
                  {theme === t.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Guarantee Banner */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <div>
            <strong className="block text-emerald-200">100% Native Editable PowerPoint (.pptx)</strong>
            Every text block, table row, shape, and progress element is rendered as genuine Microsoft PowerPoint objects, not bitmap screenshots.
          </div>
        </div>

        {/* Download Trigger */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Estimated slide deck size: ~6 slides · Compatible with PowerPoint 2016+, Office 365, Google Slides, Keynote.
          </div>

          <button
            onClick={handleDownloadPptx}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{isExporting ? 'Generating Presentation...' : 'Download Complete Weekly Report (.pptx)'}</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            PowerPoint report downloaded successfully! Check your browser downloads folder.
          </div>
        )}
      </div>
    </div>
  );
};
