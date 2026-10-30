import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ActivityStatus } from '../types';
import { 
  CalendarCheck, 
  Plus, 
  FileUp, 
  FileDown, 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  Edit, 
  Calculator, 
  Save, 
  Check, 
  AlertTriangle,
  ArrowUpDown,
  Download,
  FolderKanban,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { exportActivitiesToExcel, parseActivitiesFromExcel } from '../services/excelService';
import { epcTemplates } from '../data/templates';

export const WeeklyInputView: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    reports,
    activeReport,
    setActiveReportId,
    updateActiveReport,
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    duplicateActivity,
    bulkUpdateActivities,
    recalculateProgress,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWorkstream, setFilterWorkstream] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Activity>('order');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Activity form state for Add/Edit
  const [activityForm, setActivityForm] = useState<Omit<Activity, 'id' | 'order' | 'projectId'>>({
    wbsCode: '',
    activityId: '',
    name: '',
    workstream: 'Construction',
    description: '',
    responsiblePerson: '',
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedFinishDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    actualStartDate: '',
    actualFinishDate: '',
    weightage: 5,
    prevWeekProgress: 0,
    currentWeekProgress: 0,
    weeklyAchieved: 0,
    plannedProgress: 100,
    actualProgress: 0,
    status: 'In Progress',
    delayDays: 0,
    isCriticalPath: false,
    dependencies: [],
    dependencyType: 'FS',
    isMilestone: false,
    remarks: '',
  });

  // Filter & sort activities
  const filteredActivities = useMemo(() => {
    return activities
      .filter(act => {
        const matchesSearch =
          act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          act.activityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          act.wbsCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (act.responsiblePerson && act.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || act.status === filterStatus;
        const matchesWs = filterWorkstream === 'all' || act.workstream === filterWorkstream;
        return matchesSearch && matchesStatus && matchesWs;
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? '';
        let valB = b[sortField] ?? '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [activities, searchQuery, filterStatus, filterWorkstream, sortField, sortAsc]);

  const workstreams = useMemo<string[]>(() => {
    return Array.from(new Set(activities.map(a => a.workstream).filter(Boolean))) as string[];
  }, [activities]);

  // Load a full template so user doesn't have to create activities manually
  const handleApplyTemplate = (templateId: string) => {
    const tmpl = epcTemplates.find(t => t.id === templateId);
    if (!tmpl || !activeProject) return;

    if (confirm(`Apply "${tmpl.name}"? This will populate ${tmpl.activities.length} standard EPC activities into the current week schedule.`)) {
      const newActs: Activity[] = tmpl.activities.map((a, idx) => ({
        ...a,
        id: `act-${Date.now()}-${idx}`,
        projectId: activeProject.id,
        order: idx + 1,
      }));
      bulkUpdateActivities(newActs);
      setIsTemplateModalOpen(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingActivity(null);
    setActivityForm({
      wbsCode: `${Math.floor(activities.length / 5) + 1}.${(activities.length % 5) + 1}`,
      activityId: `ACT-${activities.length + 101}`,
      name: '',
      workstream: 'Construction',
      description: '',
      responsiblePerson: activeProject?.projectManager || 'Site Engineer',
      plannedStartDate: activeReport?.reportingStartDate || new Date().toISOString().split('T')[0],
      plannedFinishDate: activeReport?.reportingEndDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      actualStartDate: '',
      actualFinishDate: '',
      weightage: 5,
      prevWeekProgress: 0,
      currentWeekProgress: 0,
      weeklyAchieved: 0,
      plannedProgress: 100,
      actualProgress: 0,
      status: 'In Progress',
      delayDays: 0,
      isCriticalPath: false,
      dependencies: [],
      dependencyType: 'FS',
      isMilestone: false,
      remarks: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityForm({
      wbsCode: activity.wbsCode,
      activityId: activity.activityId,
      name: activity.name,
      workstream: activity.workstream,
      description: activity.description,
      responsiblePerson: activity.responsiblePerson,
      plannedStartDate: activity.plannedStartDate,
      plannedFinishDate: activity.plannedFinishDate,
      actualStartDate: activity.actualStartDate,
      actualFinishDate: activity.actualFinishDate,
      weightage: activity.weightage,
      prevWeekProgress: activity.prevWeekProgress,
      currentWeekProgress: activity.currentWeekProgress,
      weeklyAchieved: activity.weeklyAchieved,
      plannedProgress: activity.plannedProgress,
      actualProgress: activity.actualProgress,
      status: activity.status,
      delayDays: activity.delayDays,
      isCriticalPath: activity.isCriticalPath,
      dependencies: activity.dependencies || [],
      dependencyType: activity.dependencyType || 'FS',
      isMilestone: activity.isMilestone,
      remarks: activity.remarks,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveActivityModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.name.trim() || !activityForm.activityId.trim()) {
      alert('Activity ID and Name are required.');
      return;
    }

    if (editingActivity) {
      updateActivity(editingActivity.id, activityForm);
    } else {
      addActivity(activityForm);
    }
    setIsAddModalOpen(false);
  };

  // Excel Export
  const handleExportExcel = async () => {
    if (!activeProject || !activeReport) return;
    try {
      await exportActivitiesToExcel(activeProject, activeReport, activities);
    } catch (err) {
      console.error(err);
      alert('Error exporting Excel: ' + (err as Error).message);
    }
  };

  // Excel Import
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject) return;
    try {
      const imported = await parseActivitiesFromExcel(file, activeProject.id);
      if (imported.length === 0) {
        alert('No activity rows found in the imported file.');
        return;
      }
      if (confirm(`Successfully parsed ${imported.length} activities from Excel. Load them into current reporting week?`)) {
        imported.forEach(item => {
          addActivity(item as any);
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error importing Excel: ' + (err as Error).message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleSort = (field: keyof Activity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  if (!activeProject || !activeReport) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Project & Week Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-400 font-semibold">Active Project:</span>
            <select
              value={activeProject.id}
              onChange={e => setActiveProjectId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.clientName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-sky-400" />
            <span className="text-xs text-slate-400 font-semibold">Reporting Week:</span>
            <select
              value={activeReport.id}
              onChange={e => setActiveReportId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-sky-400 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            >
              {reports.map(r => (
                <option key={r.id} value={r.id}>
                  Week {r.weekNumber} · {r.reportingDate}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1-Click Template Loader Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-extrabold shadow-md shadow-amber-900/30 transition-all"
            title="Load ready-made EPC activities schedule without creating one by one"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Standard EPC Schedule Pack</span>
          </button>
        </div>
      </div>

      {/* Module Title & Top Reporting Week Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-500" />
              Weekly Progress & Activity Master Table (Week {activeReport.weekNumber})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit every activity name, dates, status, and progress directly in the table below. All edits sync straight into the PowerPoint report.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={recalculateProgress}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              title="Recalculate weighted project progress from activity table"
            >
              <Calculator className="w-3.5 h-3.5 text-sky-400" />
              <span>Recalculate Weighted %</span>
            </button>
          </div>
        </div>

        {/* Reporting Metadata Editable Form */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Week Number</label>
            <input
              type="number"
              value={activeReport.weekNumber}
              onChange={e => updateActiveReport({ weekNumber: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Reporting Start</label>
            <input
              type="date"
              value={activeReport.reportingStartDate}
              onChange={e => updateActiveReport({ reportingStartDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Reporting End</label>
            <input
              type="date"
              value={activeReport.reportingEndDate}
              onChange={e => updateActiveReport({ reportingEndDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Prepared By</label>
            <input
              type="text"
              value={activeReport.preparedBy}
              onChange={e => updateActiveReport({ preparedBy: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Overall Plan %</label>
            <input
              type="number"
              step="0.1"
              value={activeReport.overallPlannedProgress}
              onChange={e => updateActiveReport({ overallPlannedProgress: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sky-400 font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Overall Actual %</label>
            <input
              type="number"
              step="0.1"
              value={activeReport.overallActualProgress}
              onChange={e => updateActiveReport({ overallActualProgress: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Filters, Excel Import/Export, Add Activity */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search activity name, WBS, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 py-1.5 px-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
            <option value="Not Started">Not Started</option>
          </select>

          <select
            value={filterWorkstream}
            onChange={e => setFilterWorkstream(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 py-1.5 px-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Workstreams</option>
            {workstreams.map(ws => (
              <option key={ws} value={ws}>{ws}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Hidden File Input for Excel Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".xlsx, .xls"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
            title="Import Excel activities schedule (.xlsx)"
          >
            <FileUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Import Excel</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
            title="Export Activity Schedule to Excel (.xlsx)"
          >
            <FileDown className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Activity</span>
          </button>
        </div>
      </div>

      {/* FULLY EDITABLE ACTIVITY TABLE WITH ZERO TEXT CLIPPING (GUARANTEED EXPANDED MIN-WIDTH & FIXED COLUMN GEOMETRY) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[2000px] table-fixed">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider select-none">
              <tr>
                <th onClick={() => toggleSort('wbsCode')} className="py-3.5 px-3 cursor-pointer hover:text-white min-w-[70px] w-[70px]">
                  WBS {sortField === 'wbsCode' && (sortAsc ? '↑' : '↓')}
                </th>
                <th onClick={() => toggleSort('activityId')} className="py-3.5 px-3 cursor-pointer hover:text-white min-w-[110px] w-[110px]">
                  Activity ID
                </th>
                <th onClick={() => toggleSort('name')} className="py-3.5 px-3 cursor-pointer hover:text-white min-w-[360px] w-[360px]">
                  Activity Name (Full Editable)
                </th>
                <th className="py-3.5 px-3 min-w-[210px] w-[210px]">Workstream</th>
                <th className="py-3.5 px-3 min-w-[320px] w-[320px]">Responsible Person</th>
                <th onClick={() => toggleSort('plannedFinishDate')} className="py-3.5 px-3 cursor-pointer hover:text-white min-w-[155px] w-[155px]">
                  Planned Finish
                </th>
                <th className="py-3.5 px-2 text-right min-w-[80px] w-[80px]">Weight %</th>
                <th className="py-3.5 px-2 text-right min-w-[80px] w-[80px]">Prev %</th>
                <th className="py-3.5 px-2 text-right min-w-[95px] w-[95px]">Current %</th>
                <th className="py-3.5 px-2 text-right min-w-[80px] w-[80px]">Delta %</th>
                <th className="py-3.5 px-3 min-w-[195px] w-[195px]">Status</th>
                <th className="py-3.5 px-2 text-center min-w-[80px] w-[80px]">Delay</th>
                <th className="py-3.5 px-2 text-center min-w-[55px] w-[55px]">CP</th>
                <th className="py-3.5 px-3 text-center min-w-[110px] w-[110px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredActivities.map(act => (
                <tr key={act.id} className="hover:bg-slate-800/50 transition-colors group">
                  {/* WBS */}
                  <td className="py-2.5 px-3 min-w-[70px] w-[70px]">
                    <input
                      type="text"
                      value={act.wbsCode}
                      onChange={e => updateActivity(act.id, { wbsCode: e.target.value })}
                      className="w-14 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2 py-1.5 rounded font-mono text-slate-300 text-xs text-center"
                    />
                  </td>

                  {/* ID */}
                  <td className="py-2.5 px-3 min-w-[110px] w-[110px]">
                    <input
                      type="text"
                      value={act.activityId}
                      onChange={e => updateActivity(act.id, { activityId: e.target.value })}
                      className="w-24 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2 py-1.5 rounded font-mono text-slate-300 text-xs font-semibold"
                    />
                  </td>

                  {/* Name (Full width editable without clipping!) */}
                  <td className="py-2.5 px-3 min-w-[360px] w-[360px]">
                    <input
                      type="text"
                      value={act.name}
                      onChange={e => updateActivity(act.id, { name: e.target.value })}
                      className="w-full min-w-[340px] font-semibold text-white bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-3 py-1.5 rounded text-xs"
                    />
                  </td>

                  {/* Workstream */}
                  <td className="py-2.5 px-3 min-w-[210px] w-[210px]">
                    <input
                      type="text"
                      value={act.workstream}
                      onChange={e => updateActivity(act.id, { workstream: e.target.value })}
                      className="w-full min-w-[190px] bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2.5 py-1.5 rounded text-slate-300 text-xs"
                    />
                  </td>

                  {/* Responsible Person (Expanded 320px width - zero text clipping guaranteed!) */}
                  <td className="py-2.5 px-3 min-w-[320px] w-[320px]">
                    <input
                      type="text"
                      value={act.responsiblePerson}
                      onChange={e => updateActivity(act.id, { responsiblePerson: e.target.value })}
                      className="w-full min-w-[300px] bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-3 py-1.5 rounded text-slate-200 text-xs font-medium"
                    />
                  </td>

                  {/* Planned Finish Date */}
                  <td className="py-2.5 px-3 min-w-[155px] w-[155px] font-mono">
                    <input
                      type="date"
                      value={act.plannedFinishDate}
                      onChange={e => updateActivity(act.id, { plannedFinishDate: e.target.value })}
                      className="w-full min-w-[145px] bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2 py-1.5 rounded text-slate-300 text-xs"
                    />
                  </td>

                  {/* Weight */}
                  <td className="py-2.5 px-2 text-right min-w-[80px] w-[80px]">
                    <input
                      type="number"
                      step="0.5"
                      value={act.weightage}
                      onChange={e => updateActivity(act.id, { weightage: Number(e.target.value) })}
                      className="w-16 text-right bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2 py-1.5 rounded font-mono text-slate-300 text-xs"
                    />
                  </td>

                  {/* Previous % */}
                  <td className="py-2.5 px-2 text-right min-w-[80px] w-[80px]">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={act.prevWeekProgress}
                      onChange={e => updateActivity(act.id, { prevWeekProgress: Number(e.target.value) })}
                      className="w-16 text-right bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2 py-1.5 rounded font-mono text-slate-400 text-xs"
                    />
                  </td>

                  {/* Current % (Prominent live editor) */}
                  <td className="py-2.5 px-2 text-right min-w-[95px] w-[95px]">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={act.currentWeekProgress}
                      onChange={e => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        updateActivity(act.id, {
                          currentWeekProgress: val,
                          status: val === 100 ? 'Completed' : (act.delayDays > 0 ? 'Delayed' : 'In Progress'),
                        });
                      }}
                      className="w-18 text-right font-black text-white bg-slate-950 border border-blue-500/50 hover:border-blue-400 focus:border-blue-400 focus:outline-none px-2.5 py-1.5 rounded text-xs ring-1 ring-blue-500/30"
                    />
                  </td>

                  {/* Weekly Delta Achieved */}
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-400 min-w-[80px] w-[80px]">
                    +{Math.max(0, act.currentWeekProgress - act.prevWeekProgress)}%
                  </td>

                  {/* Status Dropdown (Expanded 195px width - zero truncation, fully readable words!) */}
                  <td className="py-2.5 px-3 min-w-[195px] w-[195px]">
                    <select
                      value={act.status}
                      onChange={e => updateActivity(act.id, { status: e.target.value as ActivityStatus })}
                      className={`text-xs font-bold py-1.5 px-3 rounded-lg bg-slate-950 border focus:outline-none w-full min-w-[180px] ${
                        act.status === 'Completed'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : act.status === 'Delayed'
                          ? 'text-rose-400 border-rose-500/40'
                          : 'text-blue-400 border-blue-500/40'
                      }`}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Not Started">Not Started</option>
                    </select>
                  </td>

                  {/* Delay in Days */}
                  <td className="py-2.5 px-2 text-center font-mono min-w-[80px] w-[80px]">
                    <input
                      type="number"
                      value={act.delayDays}
                      onChange={e => {
                        const days = Number(e.target.value);
                        updateActivity(act.id, {
                          delayDays: days,
                          status: days > 0 && act.currentWeekProgress < 100 ? 'Delayed' : act.status,
                        });
                      }}
                      className={`w-16 text-center bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none px-2 py-1.5 rounded font-bold text-xs ${
                        act.delayDays > 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    />
                  </td>

                  {/* Critical Path Checkbox */}
                  <td className="py-2.5 px-2 text-center min-w-[55px] w-[55px]">
                    <input
                      type="checkbox"
                      checked={act.isCriticalPath}
                      onChange={e => updateActivity(act.id, { isCriticalPath: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0 cursor-pointer w-4 h-4"
                      title="Mark as Critical Path (CP)"
                    />
                  </td>

                  {/* Action buttons */}
                  <td className="py-2.5 px-3 text-center min-w-[110px] w-[110px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => duplicateActivity(act.id)}
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 rounded transition-colors"
                        title="Duplicate Activity"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(act)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors"
                        title="Edit Full Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete activity "${act.name}"?`)) {
                            deleteActivity(act.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredActivities.length}</strong> of{' '}
            <strong className="text-white">{activities.length}</strong> activities
          </span>
          <div className="flex items-center gap-5">
            <span>
              Total Weight:{' '}
              <strong className="text-white">
                {activities.reduce((s, a) => s + (Number(a.weightage) || 0), 0)}%
              </strong>
            </span>
            <span>
              Calculated Overall Progress:{' '}
              <strong className="text-emerald-400 font-bold text-sm">{activeReport.overallActualProgress}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* TEMPLATE PICKER MODAL (1-Click Load Standard Schedule) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Select Standard EPC Schedule Template
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Instantly populate a complete industry-standard activity schedule with realistic WBS codes, weights, and dependencies so you don't have to create each activity one by one!
            </p>

            <div className="space-y-3">
              {epcTemplates.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => handleApplyTemplate(tmpl.id)}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-xl cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {tmpl.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {tmpl.activities.length} Activities
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{tmpl.description}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-500" />
                {editingActivity ? 'Edit Project Activity' : 'Add New Activity to Schedule'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivityModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WBS Code *</label>
                  <input
                    type="text"
                    required
                    value={activityForm.wbsCode}
                    onChange={e => setActivityForm({ ...activityForm, wbsCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Activity ID *</label>
                  <input
                    type="text"
                    required
                    value={activityForm.activityId}
                    onChange={e => setActivityForm({ ...activityForm, activityId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Workstream *</label>
                  <input
                    type="text"
                    required
                    value={activityForm.workstream}
                    onChange={e => setActivityForm({ ...activityForm, workstream: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Activity Name *</label>
                <input
                  type="text"
                  required
                  value={activityForm.name}
                  onChange={e => setActivityForm({ ...activityForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsible Person</label>
                  <input
                    type="text"
                    value={activityForm.responsiblePerson}
                    onChange={e => setActivityForm({ ...activityForm, responsiblePerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weightage in Project (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={activityForm.weightage}
                    onChange={e => setActivityForm({ ...activityForm, weightage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Planned Start</label>
                  <input
                    type="date"
                    value={activityForm.plannedStartDate}
                    onChange={e => setActivityForm({ ...activityForm, plannedStartDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Planned Finish</label>
                  <input
                    type="date"
                    value={activityForm.plannedFinishDate}
                    onChange={e => setActivityForm({ ...activityForm, plannedFinishDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Actual Start</label>
                  <input
                    type="date"
                    value={activityForm.actualStartDate}
                    onChange={e => setActivityForm({ ...activityForm, actualStartDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Actual Finish</label>
                  <input
                    type="date"
                    value={activityForm.actualFinishDate}
                    onChange={e => setActivityForm({ ...activityForm, actualFinishDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prev Week %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activityForm.prevWeekProgress}
                    onChange={e => setActivityForm({ ...activityForm, prevWeekProgress: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Week %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activityForm.currentWeekProgress}
                    onChange={e => setActivityForm({ ...activityForm, currentWeekProgress: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={activityForm.status}
                    onChange={e => setActivityForm({ ...activityForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Delay (Days)</label>
                  <input
                    type="number"
                    value={activityForm.delayDays}
                    onChange={e => setActivityForm({ ...activityForm, delayDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={activityForm.isCriticalPath}
                    onChange={e => setActivityForm({ ...activityForm, isCriticalPath: e.target.checked })}
                    className="rounded bg-slate-950 text-rose-600 focus:ring-0"
                  />
                  <span className="font-bold text-rose-400">Critical Path Item (CP)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={activityForm.isMilestone}
                    onChange={e => setActivityForm({ ...activityForm, isMilestone: e.target.checked })}
                    className="rounded bg-slate-950 text-amber-500 focus:ring-0"
                  />
                  <span className="font-bold text-amber-400">Key Project Milestone</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remarks & Field Notes</label>
                <textarea
                  rows={2}
                  value={activityForm.remarks}
                  onChange={e => setActivityForm({ ...activityForm, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/40"
                >
                  {editingActivity ? 'Save Activity' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
