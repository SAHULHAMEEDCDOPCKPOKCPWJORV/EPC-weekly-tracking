import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Layers, 
  Camera, 
  AlertOctagon, 
  CalendarCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { generateWeeklyReportPptx } from '../services/pptxGenerator';

export const ReportBuilderView: React.FC = () => {
  const {
    activeProject,
    updateProject,
    activeReport,
    updateActiveReport,
    updateSummary,
    activities,
    updateActivity,
    sitePhotos,
    updateSitePhoto,
    nextTwoWeeks,
    updateNextTwoWeeksItem,
    risks,
    updateRisk,
    summary,
  } = useApp();

  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const totalSlides = 7;

  const handleDownloadPpt = async () => {
    if (!activeProject || !activeReport) return;
    try {
      setIsExporting(true);
      await generateWeeklyReportPptx(activeProject, activeReport);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PowerPoint: ' + (e as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (!activeProject || !activeReport) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-500" />
            Executive Weekly Report Builder & PowerPoint Visualizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 7-page presentation deck synchronized live with application data. Changes update the PPT download immediately.
          </p>
        </div>

        {/* Slide Navigation & Export Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isEditMode
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Editing Mode: ON' : 'Edit Slide Content'}</span>
          </button>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveSlide(prev => Math.max(1, prev - 1))}
              disabled={activeSlide === 1}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-200">
              Slide {activeSlide} of {totalSlides}
            </span>
            <button
              onClick={() => setActiveSlide(prev => Math.min(totalSlides, prev + 1))}
              disabled={activeSlide === totalSlides}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadPpt}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>{isExporting ? 'Generating PPTX...' : 'Download Synced PPTX'}</span>
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { num: 1, name: 'Project Cover' },
          { num: 2, name: 'Delivery Timeline' },
          { num: 3, name: 'Status Details' },
          { num: 4, name: 'Site Progress' },
          { num: 5, name: 'Next Two Weeks' },
          { num: 6, name: 'Risks & Actions' },
          { num: 7, name: 'Weekly Summary' },
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setActiveSlide(s.num)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeSlide === s.num
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-950 ring-1 ring-blue-500'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold block uppercase opacity-75">
              Page {s.num}
            </span>
            <span className="text-xs font-semibold truncate block mt-0.5">
              {s.name}
            </span>
          </button>
        ))}
      </div>

      {/* Main Slide Canvas (16:9 Aspect Ratio Presentation Slide) */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 aspect-[16/9] min-h-[580px] flex flex-col justify-between border border-slate-200 select-none overflow-hidden relative">
        {/* ============================================================== */}
        {/* SLIDE 1: PROJECT COVER */}
        {/* ============================================================== */}
        {activeSlide === 1 && (
          <div className="h-full flex flex-col justify-between">
            {/* Header branding */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <span className="text-xs text-slate-500">
                Confidential. Prepared for {activeProject.clientName} by {activeProject.contractorName || 'Dexler Energy'}.
              </span>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-700 tracking-tight block">
                  {activeProject.contractorName?.toUpperCase() || 'DEXLER'}
                </span>
                <span className="text-[9px] font-bold text-amber-500 tracking-widest uppercase">
                  Developers of Solar Power Plants
                </span>
              </div>
            </div>

            {/* Middle: Left metadata + Right Cover Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto items-center">
              <div className="space-y-4">
                <div className="inline-block bg-amber-500 text-white font-extrabold text-sm px-3 py-1 rounded">
                  WEEK {activeReport.weekNumber}
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Weekly Project Report
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Reporting week ending {activeReport.reportingEndDate || activeReport.reportingDate}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      CLIENT
                    </span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={activeProject.clientName}
                        onChange={e => updateProject(activeProject.id, { clientName: e.target.value })}
                        className="font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 w-full bg-amber-50"
                      />
                    ) : (
                      <span className="text-base font-bold text-slate-900">
                        {activeProject.clientName}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      PROJECT
                    </span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={activeProject.name}
                        onChange={e => updateProject(activeProject.id, { name: e.target.value })}
                        className="font-bold text-slate-800 border border-slate-300 rounded px-2 py-1 w-full bg-amber-50"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-800">
                        {activeProject.capacity ? `${activeProject.capacity} - ${activeProject.name}` : activeProject.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      LOCATION
                    </span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={activeProject.location}
                        onChange={e => updateProject(activeProject.id, { location: e.target.value })}
                        className="font-semibold text-slate-700 border border-slate-300 rounded px-2 py-1 w-full bg-amber-50"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-700">
                        {activeProject.location}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      COMMISSIONING (COD)
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {activeProject.baselineCod} baseline · Forecast {activeReport.forecastCod || activeProject.forecastCod}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      PREPARED BY
                    </span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={activeReport.preparedBy}
                        onChange={e => updateActiveReport({ preparedBy: e.target.value })}
                        className="font-semibold text-slate-700 border border-slate-300 rounded px-2 py-1 w-full bg-amber-50"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-700">
                        {activeReport.preparedBy || 'Dexler Project Delivery'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Cover Photo Box (Zero random stock images) */}
              {(() => {
                const coverPhoto = sitePhotos.find(p => p.isCover) || sitePhotos[0];
                if (coverPhoto) {
                  return (
                    <div className="h-72 md:h-80 rounded-xl overflow-hidden border border-slate-200 shadow-md relative bg-slate-950 flex items-center justify-center">
                      <img
                        src={coverPhoto.url}
                        alt={coverPhoto.caption}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-sm p-3 border-t border-slate-800 text-white text-[11px]">
                        <div className="font-bold text-xs">{coverPhoto.caption}</div>
                        <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                          {coverPhoto.location} · {coverPhoto.date}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="h-72 md:h-80 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{activeProject.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{activeProject.location} · {activeProject.capacity}</p>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-mono">
                      Upload site photo in "Site Progress" tab to display here
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Footer page number */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>{activeProject.clientName} · Week {activeReport.weekNumber}</span>
              <span className="font-bold">1</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 2: PROJECT DELIVERY TIMELINE */}
        {/* ============================================================== */}
        {activeSlide === 2 && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delivery Timeline</h3>
                <span className="text-xs text-slate-500">
                  Overall progress vs baseline milestones (Dynamically synchronized)
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-blue-700">{activeProject.clientName}</span>
                <span className="text-xs text-slate-400 block">Week {activeReport.weekNumber} · {activeReport.reportingDate}</span>
              </div>
            </div>

            {/* KPI Tiles */}
            <div className="grid grid-cols-3 gap-4 my-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  OVERALL PROGRESS
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-blue-700">
                    {activeReport.overallActualProgress}%
                  </span>
                  <span className="text-xs text-slate-500">
                    plan {activeReport.overallPlannedProgress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${activeReport.overallActualProgress}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  DAYS TO COD
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-amber-500">
                    {activeReport.daysToCod}
                  </span>
                  <span className="text-xs text-slate-500">
                    forecast {activeReport.forecastDaysToCod || 63} d
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">
                  Remaining calendar days
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  COMMISSIONING DATE
                </span>
                <div className="text-xl font-extrabold text-slate-800 mt-1">
                  {activeProject.baselineCod}
                </div>
                <span className="text-[11px] text-rose-600 font-bold block mt-1">
                  Forecast COD: {activeReport.forecastCod || activeProject.forecastCod}
                </span>
              </div>
            </div>

            {/* Dynamic Workstream summary & Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">
                  Workstream Progress Status
                </span>
                {Array.from(new Set(activities.map(a => a.workstream || 'General'))).slice(0, 6).map(ws => {
                  const wsActs = activities.filter(a => (a.workstream || 'General') === ws);
                  const avg = Math.round(wsActs.reduce((s, a) => s + (a.currentWeekProgress || 0), 0) / (wsActs.length || 1));
                  const isDelayed = wsActs.some(a => a.status === 'Delayed');
                  return (
                    <div key={ws} className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700 truncate w-48">{ws}</span>
                      <span className="font-bold text-blue-700">{avg}%</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isDelayed ? 'bg-rose-100 text-rose-700' : (avg === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')
                      }`}>
                        {isDelayed ? 'Behind Schedule' : (avg === 100 ? 'Completed' : 'In Progress')}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Key Milestones (Synchronized)
                </span>
                <div className="space-y-1.5">
                  {activities.filter(a => a.isMilestone).length > 0 ? (
                    activities.filter(a => a.isMilestone).slice(0, 6).map((m, idx) => (
                      <div key={m.id} className="flex justify-between items-center text-slate-700">
                        <span>{idx + 1}. {m.name}</span>
                        <strong className="text-slate-900 font-mono">{m.plannedFinishDate} ({m.currentWeekProgress}%)</strong>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-slate-700">
                        <span>1. CEIG Approval</span>
                        <strong className="text-slate-900 font-mono">04 Nov 26</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span>2. PV Module Installation</span>
                        <strong className="text-slate-900 font-mono">06 Nov 26</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span>3. Bay Work Completion</span>
                        <strong className="text-rose-600 font-mono">17 Nov 26 (CP)</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span>4. Commissioning (COD)</span>
                        <strong className="text-blue-700 font-mono">{activeProject.baselineCod}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>Delivery Timeline</span>
              <span className="font-bold">2</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 3: WEEKLY STATUS DETAILS TABLE */}
        {/* ============================================================== */}
        {activeSlide === 3 && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Status Detail · week ending {activeReport.reportingEndDate || activeReport.reportingDate}
                </h3>
                <span className="text-xs text-slate-500">
                  {activities.length} activities tracked in project schedule
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Week {activeReport.weekNumber}
              </span>
            </div>

            <div className="my-2 overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[9px] font-bold">
                  <tr>
                    <th className="py-1.5 px-2">Task</th>
                    <th className="py-1.5 px-2">Planned Finish</th>
                    <th className="py-1.5 px-2">Status</th>
                    <th className="py-1.5 px-2 text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activities.slice(0, 10).map(act => (
                    <tr key={act.id}>
                      <td className="py-1 px-2 font-medium text-slate-800">{act.name}</td>
                      <td className="py-1 px-2 font-mono text-slate-500">{act.plannedFinishDate}</td>
                      <td className="py-1 px-2">
                        {act.status === 'Delayed' ? (
                          <span className="text-rose-600 font-bold">
                            Delayed {act.delayDays} d {act.isCriticalPath && '· CP'}
                          </span>
                        ) : act.status === 'Completed' ? (
                          <span className="text-emerald-600 font-bold">Completed</span>
                        ) : (
                          <span className="text-blue-600 font-medium">In Progress {act.isCriticalPath && '· CP'}</span>
                        )}
                      </td>
                      <td className="py-1 px-2 text-right font-bold text-slate-900">
                        {act.currentWeekProgress}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[10px] text-slate-400 italic mt-2">
                All {activities.length} activities are exported into the generated PowerPoint across paginated slides.
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>Status Detail</span>
              <span className="font-bold">3</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 4: SITE PROGRESS & NEXT TWO WEEKS */}
        {/* ============================================================== */}
        {activeSlide === 4 && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Site Progress</h3>
                <span className="text-xs text-slate-500">
                  Ground photographic evidence and look-ahead execution targets
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Week {activeReport.weekNumber}</span>
            </div>

            {sitePhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
                {sitePhotos.slice(0, 3).map((photo) => (
                  <div key={photo.id} className="space-y-1">
                    <div className="h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={e => updateSitePhoto(photo.id, { caption: e.target.value })}
                        className="text-[10px] font-bold text-slate-800 border rounded px-1.5 py-0.5 w-full bg-amber-50"
                      />
                    ) : (
                      <div className="text-[10px] font-bold text-slate-800 truncate">
                        {photo.caption}
                      </div>
                    )}
                    <div className="text-[9px] text-slate-400 font-mono">
                      {photo.location}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 my-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
                <span className="text-xs font-bold text-slate-700 block">No Site Photographs Uploaded</span>
                <span className="text-[11px] text-slate-500 block">
                  Upload your ground photos in the "Site Progress" tab to display them in this preview and in the exported PowerPoint.
                </span>
              </div>
            )}

            {/* Next Two Weeks List */}
            <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1.5 my-1">
              <span className="font-extrabold text-[11px] text-amber-400 uppercase tracking-wider block mb-1">
                NEXT TWO WEEKS PLAN
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                {nextTwoWeeks.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="truncate pr-2">{item.activityName}</span>
                    <span className="text-amber-300 font-mono font-bold flex-shrink-0">
                      Due {item.dueDate.substring(5)} {item.isCriticalPath && '(CP)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>Site Progress</span>
              <span className="font-bold">4</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 5: NEXT TWO WEEKS PLAN DETAILED */}
        {/* ============================================================== */}
        {activeSlide === 5 && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Next 14 Days Look-Ahead Plan</h3>
                <span className="text-xs text-slate-500">
                  Detailed task allocation and dependencies
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Week {activeReport.weekNumber}</span>
            </div>

            <div className="space-y-2 my-auto">
              {nextTwoWeeks.map(item => (
                <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.activityName}
                          onChange={e => updateNextTwoWeeksItem(item.id, { activityName: e.target.value })}
                          className="font-bold border rounded px-1.5 py-0.5 bg-amber-50"
                        />
                      ) : (
                        <span>{item.activityName}</span>
                      )}
                      {item.isCriticalPath && (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                          Critical Path
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Owner: {item.responsiblePerson} · {item.remarks}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-amber-600">Due: {item.dueDate}</div>
                    <div className="text-[10px] text-slate-400">Target: {item.expectedProgress}%</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>Next Two Weeks Plan</span>
              <span className="font-bold">5</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 6: RISKS AND CLIENT ACTIONS */}
        {/* ============================================================== */}
        {activeSlide === 6 && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Risks and Client Actions</h3>
                <span className="text-xs text-slate-500">
                  Bottleneck resolutions and client dependencies
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Week {activeReport.weekNumber}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
              {/* Left Column: RISKS */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  RISKS (Synchronized)
                </span>
                {risks.slice(0, 2).map(r => (
                  <div key={r.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800">{r.title}</span>
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {r.currentStatus}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{r.description}</p>
                    <div className="text-[10px] text-slate-500 italic">
                      Mitigation: {r.mitigationPlan}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: WHAT WE NEED FROM YOU */}
              <div className="bg-blue-950 text-white p-5 rounded-2xl space-y-4">
                <div>
                  <span className="text-sm font-black text-amber-400 tracking-wide uppercase block">
                    WHAT WE NEED FROM YOU
                  </span>
                  <p className="text-[10px] text-sky-300 mt-0.5">
                    Client points of contact: {activeProject.contractorName || 'Dexler'} Project Delivery team.
                  </p>
                </div>

                <div className="space-y-3">
                  {risks.filter(r => r.clientActionRequired?.trim()).map((risk, idx) => (
                    <div key={risk.id} className="flex items-start gap-2.5 text-xs">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={risk.clientActionRequired}
                          onChange={e => updateRisk(risk.id, { clientActionRequired: e.target.value })}
                          className="font-semibold text-slate-900 border rounded px-1.5 py-0.5 w-full bg-amber-50"
                        />
                      ) : (
                        <span className="font-semibold text-slate-100">
                          {risk.clientActionRequired}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>Risks and Client Actions</span>
              <span className="font-bold">6</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 7: WEEKLY ACHIEVEMENTS AND SUMMARY */}
        {/* ============================================================== */}
        {activeSlide === 7 && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Weekly Achievements and Management Summary
                </h3>
                <span className="text-xs text-slate-500">
                  Executive recap of completed activities, delays and corrective actions
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Week {activeReport.weekNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  COMPLETED THIS WEEK
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  {summary.completedThisWeek?.slice(0, 3).map((item, i) => (
                    <li key={i}>{item}</li>
                  )) || <li>PV Module 100% delivered to site yard.</li>}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  DELAYED ACTIVITIES & CORRECTIVE ACTIONS
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  {summary.delayedActivities?.slice(0, 3).map((item, i) => (
                    <li key={i}>{item}</li>
                  )) || <li>TB Meeting and Bay Estimate delay</li>}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  NEXT WEEK TARGETS
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  {summary.nextWeekTargets?.slice(0, 3).map((item, i) => (
                    <li key={i}>{item}</li>
                  )) || <li>Inverter delivery and placement on plinth.</li>}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                  MANAGEMENT COMMENTS
                </span>
                {isEditMode ? (
                  <textarea
                    rows={3}
                    value={summary.managementComments}
                    onChange={e => updateSummary({ managementComments: e.target.value })}
                    className="w-full text-slate-800 border rounded p-1.5 text-[11px] bg-amber-50"
                  />
                ) : (
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {summary.managementComments || 'All project disciplines remain mobilized. Critical path items are closely monitored to prevent compounding slippage on COD.'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>Weekly Summary</span>
              <span className="font-bold">7</span>
            </div>
          </div>
        )}
      </div>

      {/* Editor Drawer for quick edits when isEditMode is enabled */}
      {isEditMode && (
        <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Live Slide Editor Drawer (Slide {activeSlide})
            </h4>
            <span className="text-xs text-slate-400">
              All edits automatically save and synchronize straight into the PowerPoint presentation.
            </span>
          </div>

          {activeSlide === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Client Name</label>
                <input
                  type="text"
                  value={activeProject.clientName}
                  onChange={e => updateProject(activeProject.id, { clientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Project Name</label>
                <input
                  type="text"
                  value={activeProject.name}
                  onChange={e => updateProject(activeProject.id, { name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Prepared By</label>
                <input
                  type="text"
                  value={activeReport.preparedBy}
                  onChange={e => updateActiveReport({ preparedBy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>
            </div>
          )}

          {activeSlide === 7 && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Management Comments</label>
                <textarea
                  rows={2}
                  value={summary.managementComments}
                  onChange={e => updateSummary({ managementComments: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
