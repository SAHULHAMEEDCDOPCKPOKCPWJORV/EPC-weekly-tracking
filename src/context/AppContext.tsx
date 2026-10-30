import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Project, 
  WeeklyReport, 
  Activity, 
  SitePhoto, 
  NextTwoWeeksItem, 
  ProjectRisk, 
  WeeklyAchievementsSummary, 
  UserProfile, 
  ViewMode 
} from '../types';
import { sampleProject, sampleReports, initialUser } from '../data/mockData';

interface AppContextType {
  // Navigation & View
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // User
  user: UserProfile;
  setUser: (user: UserProfile) => void;

  // Projects
  projects: Project[];
  activeProject: Project | null;
  setActiveProjectId: (id: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Reports
  reports: WeeklyReport[]; // All reports for active project
  activeReport: WeeklyReport | null;
  setActiveReportId: (id: string) => void;
  createNewWeekReport: (weekNumber: number, reportingDate: string) => WeeklyReport;
  updateActiveReport: (updates: Partial<WeeklyReport>) => void;
  deleteReport: (id: string) => void;

  // Activities (Within active report)
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'order' | 'projectId'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  duplicateActivity: (id: string) => void;
  bulkUpdateActivities: (activities: Activity[]) => void;
  recalculateProgress: () => void;

  // Photos
  sitePhotos: SitePhoto[];
  addSitePhoto: (photo: Omit<SitePhoto, 'id' | 'reportId' | 'projectId'>) => void;
  updateSitePhoto: (id: string, updates: Partial<SitePhoto>) => void;
  deleteSitePhoto: (id: string) => void;
  reorderSitePhotos: (newPhotos: SitePhoto[]) => void;

  // Next Two Weeks
  nextTwoWeeks: NextTwoWeeksItem[];
  addNextTwoWeeksItem: (item: Omit<NextTwoWeeksItem, 'id' | 'reportId'>) => void;
  updateNextTwoWeeksItem: (id: string, updates: Partial<NextTwoWeeksItem>) => void;
  deleteNextTwoWeeksItem: (id: string) => void;

  // Risks
  risks: ProjectRisk[];
  addRisk: (risk: Omit<ProjectRisk, 'id' | 'reportId' | 'projectId'>) => void;
  updateRisk: (id: string, updates: Partial<ProjectRisk>) => void;
  deleteRisk: (id: string) => void;

  // Summary
  summary: WeeklyAchievementsSummary;
  updateSummary: (summary: Partial<WeeklyAchievementsSummary>) => void;

  // State info
  saveStatus: 'saved' | 'saving' | 'offline';
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  resetToSampleData: () => void;
}

const STORAGE_KEY_PROJECTS = 'epc_projects_v1';
const STORAGE_KEY_REPORTS = 'epc_reports_v1';
const STORAGE_KEY_ACTIVE_PROJ = 'epc_active_proj_v1';
const STORAGE_KEY_ACTIVE_REP = 'epc_active_rep_v1';
const STORAGE_KEY_USER = 'epc_user_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline'>('saved');

  // User profile
  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : initialUser;
    } catch {
      return initialUser;
    }
  });

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  // Projects list
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [sampleProject];
  });

  // Active Project ID
  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJ);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return sampleProject.id;
  });

  // All weekly reports across all projects
  const [allReports, setAllReports] = useState<WeeklyReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Clean out any legacy random stock images so only authentic user photos remain
          return parsed.map((r: WeeklyReport) => ({
            ...r,
            sitePhotos: (r.sitePhotos || []).filter(p => !p.url?.includes('images.unsplash.com')),
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return sampleReports;
  });

  // Active Report ID
  const [activeReportId, setActiveReportIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_REP);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'rep-wk-42';
  });

  // Undo / Redo history stack
  const [history, setHistory] = useState<WeeklyReport[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Derived active project
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Derived reports for active project
  const projectReports = allReports.filter(r => r.projectId === activeProjectId);

  // Derived active report
  const activeReport = projectReports.find(r => r.id === activeReportId) || projectReports[projectReports.length - 1] || null;

  // Active report sub-entities
  const activities = activeReport?.activities || [];
  const sitePhotos = activeReport?.sitePhotos || [];
  const nextTwoWeeks = activeReport?.nextTwoWeeks || [];
  const risks = activeReport?.risks || [];
  const summary = activeReport?.summary || {
    completedThisWeek: [],
    ongoingActivities: [],
    delayedActivities: [],
    majorAchievements: [],
    issuesEncountered: [],
    correctiveActions: [],
    nextWeekTargets: [],
    managementComments: '',
  };

  // Helper to persist with visual saving indicator
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerAutoSave = useCallback((newProjects?: Project[], newReports?: WeeklyReport[]) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (newProjects) localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(newProjects));
        if (newReports) localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(newReports));
        setSaveStatus('saved');
      } catch (e) {
        console.error('Save failed:', e);
        setSaveStatus('offline');
      }
    }, 400);
  }, []);

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROJ, id);
    // Switch active report to the latest report of this project
    const pReps = allReports.filter(r => r.projectId === id);
    if (pReps.length > 0) {
      const latest = pReps[pReps.length - 1];
      setActiveReportIdState(latest.id);
      localStorage.setItem(STORAGE_KEY_ACTIVE_REP, latest.id);
    }
  };

  const setActiveReportId = (id: string) => {
    setActiveReportIdState(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_REP, id);
  };

  // Project CRUD
  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProj];
    setProjects(updatedProjects);
    setActiveProjectId(newProj.id);

    // Also initialize Week 1 report for this new project
    const newReport: WeeklyReport = {
      id: `rep-${Date.now()}-1`,
      projectId: newProj.id,
      weekNumber: 1,
      reportingStartDate: newProj.startDate,
      reportingEndDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      reportingDate: new Date().toISOString().split('T')[0],
      preparedBy: newProj.projectManager || 'Project Manager',
      overallPlannedProgress: 5,
      overallActualProgress: 0,
      weeklyPlannedProgress: 5,
      weeklyActualProgress: 0,
      daysToCod: Math.max(0, Math.ceil((new Date(newProj.baselineCod).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      forecastCod: newProj.forecastCod || newProj.baselineCod,
      forecastDaysToCod: Math.max(0, Math.ceil((new Date(newProj.forecastCod || newProj.baselineCod).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      statusNotes: 'Project kick-off report.',
      version: 1,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: [],
      sitePhotos: [],
      nextTwoWeeks: [],
      risks: [],
      summary: {
        completedThisWeek: [],
        ongoingActivities: ['Project mobilization', 'Initial topographical survey'],
        delayedActivities: [],
        majorAchievements: ['Contract signed and site handed over.'],
        issuesEncountered: [],
        correctiveActions: [],
        nextWeekTargets: ['Mobilize survey team', 'Set up site office'],
        managementComments: 'Work scheduled according to baseline plan.',
      },
    };

    const updatedReports = [...allReports, newReport];
    setAllReports(updatedReports);
    setActiveReportIdState(newReport.id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_REP, newReport.id);
    triggerAutoSave(updatedProjects, updatedReports);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
    setProjects(updated);
    triggerAutoSave(updated, undefined);
  };

  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert('Cannot delete the only project. Please create another project first.');
      return;
    }
    const updatedProjects = projects.filter(p => p.id !== id);
    const updatedReports = allReports.filter(r => r.projectId !== id);
    setProjects(updatedProjects);
    setAllReports(updatedReports);
    if (activeProjectId === id) {
      setActiveProjectId(updatedProjects[0].id);
    }
    triggerAutoSave(updatedProjects, updatedReports);
  };

  // Helper to commit report changes into history and save
  const commitReportUpdate = (updatedReport: WeeklyReport) => {
    // Push previous to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), allReports]);
    setHistoryIndex(prev => prev + 1);

    const updatedAll = allReports.map(r => r.id === updatedReport.id ? { ...updatedReport, updatedAt: new Date().toISOString() } : r);
    setAllReports(updatedAll);
    triggerAutoSave(undefined, updatedAll);
  };

  // Create a brand new reporting week based on previous week
  const createNewWeekReport = (weekNumber: number, reportingDate: string): WeeklyReport => {
    if (!activeProject) throw new Error('No active project');
    const prevRep = activeReport;

    // Clone activities for the new week; prevWeekProgress becomes previous currentWeekProgress
    const clonedActivities: Activity[] = prevRep ? prevRep.activities.map(a => ({
      ...a,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      prevWeekProgress: a.currentWeekProgress,
      currentWeekProgress: a.currentWeekProgress,
      weeklyAchieved: 0,
    })) : [];

    const newReport: WeeklyReport = {
      id: `rep-wk-${weekNumber}-${Date.now()}`,
      projectId: activeProject.id,
      weekNumber,
      reportingStartDate: prevRep ? prevRep.reportingEndDate : new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      reportingEndDate: reportingDate,
      reportingDate,
      preparedBy: prevRep ? prevRep.preparedBy : activeProject.projectManager,
      overallPlannedProgress: Math.min(100, (prevRep?.overallPlannedProgress || 0) + 4),
      overallActualProgress: prevRep?.overallActualProgress || 0,
      weeklyPlannedProgress: 4,
      weeklyActualProgress: 0,
      daysToCod: Math.max(0, Math.ceil((new Date(activeProject.baselineCod).getTime() - new Date(reportingDate).getTime()) / (1000 * 60 * 60 * 24))),
      forecastCod: activeProject.forecastCod || activeProject.baselineCod,
      forecastDaysToCod: Math.max(0, Math.ceil((new Date(activeProject.forecastCod || activeProject.baselineCod).getTime() - new Date(reportingDate).getTime()) / (1000 * 60 * 60 * 24))),
      statusNotes: `Progress monitoring report for Week ${weekNumber}.`,
      version: 1,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: clonedActivities,
      sitePhotos: prevRep?.sitePhotos ? [...prevRep.sitePhotos] : [],
      nextTwoWeeks: prevRep?.nextTwoWeeks ? [...prevRep.nextTwoWeeks] : [],
      risks: prevRep?.risks ? [...prevRep.risks] : [],
      summary: prevRep?.summary ? { ...prevRep.summary } : {
        completedThisWeek: [],
        ongoingActivities: [],
        delayedActivities: [],
        majorAchievements: [],
        issuesEncountered: [],
        correctiveActions: [],
        nextWeekTargets: [],
        managementComments: '',
      },
    };

    const updatedReports = [...allReports, newReport];
    setAllReports(updatedReports);
    setActiveReportId(newReport.id);
    triggerAutoSave(undefined, updatedReports);
    return newReport;
  };

  const updateActiveReport = (updates: Partial<WeeklyReport>) => {
    if (!activeReport) return;
    const updated = { ...activeReport, ...updates };
    commitReportUpdate(updated);
  };

  const deleteReport = (id: string) => {
    if (projectReports.length <= 1) {
      alert('Cannot delete the only weekly report for this project.');
      return;
    }
    const updatedReports = allReports.filter(r => r.id !== id);
    setAllReports(updatedReports);
    if (activeReportId === id) {
      const remaining = updatedReports.filter(r => r.projectId === activeProjectId);
      if (remaining.length > 0) {
        setActiveReportId(remaining[remaining.length - 1].id);
      }
    }
    triggerAutoSave(undefined, updatedReports);
  };

  // Recalculate weighted project progress
  const recalculateProgress = useCallback(() => {
    if (!activeReport) return;
    const currentActs = activeReport.activities;
    if (currentActs.length === 0) return;

    const totalWeight = currentActs.reduce((sum, a) => sum + (Number(a.weightage) || 1), 0);
    const weightedActual = currentActs.reduce((sum, a) => sum + (Number(a.currentWeekProgress || a.actualProgress) * (Number(a.weightage) || 1)), 0);
    const weightedPlanned = currentActs.reduce((sum, a) => sum + (Number(a.plannedProgress) * (Number(a.weightage) || 1)), 0);
    const weightedWeeklyAchieved = currentActs.reduce((sum, a) => sum + (Math.max(0, Number(a.currentWeekProgress) - Number(a.prevWeekProgress)) * (Number(a.weightage) || 1)), 0);

    const actualPercent = totalWeight > 0 ? Number((weightedActual / totalWeight).toFixed(1)) : 0;
    const plannedPercent = totalWeight > 0 ? Number((weightedPlanned / totalWeight).toFixed(1)) : 0;
    const weeklyPercent = totalWeight > 0 ? Number((weightedWeeklyAchieved / totalWeight).toFixed(1)) : 0;

    const updated = {
      ...activeReport,
      overallActualProgress: actualPercent,
      overallPlannedProgress: plannedPercent,
      weeklyActualProgress: weeklyPercent,
    };
    commitReportUpdate(updated);
  }, [activeReport]);

  // Activity operations
  const addActivity = (actData: Omit<Activity, 'id' | 'order' | 'projectId'>) => {
    if (!activeReport) return;
    const newAct: Activity = {
      ...actData,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectId: activeReport.projectId,
      order: activeReport.activities.length + 1,
      weeklyAchieved: Math.max(0, actData.currentWeekProgress - actData.prevWeekProgress),
      actualProgress: actData.currentWeekProgress,
    };
    const updatedActs = [...activeReport.activities, newAct];
    
    // Auto-calculate weighted progress
    const totalWeight = updatedActs.reduce((sum, a) => sum + (Number(a.weightage) || 1), 0);
    const weightedActual = updatedActs.reduce((sum, a) => sum + (Number(a.currentWeekProgress) * (Number(a.weightage) || 1)), 0);
    const weightedPlanned = updatedActs.reduce((sum, a) => sum + (Number(a.plannedProgress) * (Number(a.weightage) || 1)), 0);

    const updatedReport = {
      ...activeReport,
      activities: updatedActs,
      overallActualProgress: totalWeight > 0 ? Number((weightedActual / totalWeight).toFixed(1)) : activeReport.overallActualProgress,
      overallPlannedProgress: totalWeight > 0 ? Number((weightedPlanned / totalWeight).toFixed(1)) : activeReport.overallPlannedProgress,
    };
    commitReportUpdate(updatedReport);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    if (!activeReport) return;
    const updatedActs = activeReport.activities.map(a => {
      if (a.id === id) {
        const current = updates.currentWeekProgress !== undefined ? updates.currentWeekProgress : a.currentWeekProgress;
        const prev = updates.prevWeekProgress !== undefined ? updates.prevWeekProgress : a.prevWeekProgress;
        return {
          ...a,
          ...updates,
          currentWeekProgress: current,
          actualProgress: current,
          weeklyAchieved: Math.max(0, current - prev),
        };
      }
      return a;
    });

    const totalWeight = updatedActs.reduce((sum, a) => sum + (Number(a.weightage) || 1), 0);
    const weightedActual = updatedActs.reduce((sum, a) => sum + (Number(a.currentWeekProgress) * (Number(a.weightage) || 1)), 0);
    const weightedPlanned = updatedActs.reduce((sum, a) => sum + (Number(a.plannedProgress) * (Number(a.weightage) || 1)), 0);

    const updatedReport = {
      ...activeReport,
      activities: updatedActs,
      overallActualProgress: totalWeight > 0 ? Number((weightedActual / totalWeight).toFixed(1)) : activeReport.overallActualProgress,
      overallPlannedProgress: totalWeight > 0 ? Number((weightedPlanned / totalWeight).toFixed(1)) : activeReport.overallPlannedProgress,
    };
    commitReportUpdate(updatedReport);
  };

  const deleteActivity = (id: string) => {
    if (!activeReport) return;
    const updatedActs = activeReport.activities.filter(a => a.id !== id);
    const updatedReport = {
      ...activeReport,
      activities: updatedActs,
    };
    commitReportUpdate(updatedReport);
  };

  const duplicateActivity = (id: string) => {
    if (!activeReport) return;
    const existing = activeReport.activities.find(a => a.id === id);
    if (!existing) return;
    const duplicated: Activity = {
      ...existing,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      activityId: `${existing.activityId}-COPY`,
      name: `${existing.name} (Copy)`,
      order: activeReport.activities.length + 1,
    };
    commitReportUpdate({
      ...activeReport,
      activities: [...activeReport.activities, duplicated],
    });
  };

  const bulkUpdateActivities = (newActivities: Activity[]) => {
    if (!activeReport) return;
    const totalWeight = newActivities.reduce((sum, a) => sum + (Number(a.weightage) || 1), 0);
    const weightedActual = newActivities.reduce((sum, a) => sum + (Number(a.currentWeekProgress) * (Number(a.weightage) || 1)), 0);
    const weightedPlanned = newActivities.reduce((sum, a) => sum + (Number(a.plannedProgress) * (Number(a.weightage) || 1)), 0);

    const updatedReport = {
      ...activeReport,
      activities: newActivities,
      overallActualProgress: totalWeight > 0 ? Number((weightedActual / totalWeight).toFixed(1)) : activeReport.overallActualProgress,
      overallPlannedProgress: totalWeight > 0 ? Number((weightedPlanned / totalWeight).toFixed(1)) : activeReport.overallPlannedProgress,
    };
    commitReportUpdate(updatedReport);
  };

  // Photo operations
  const addSitePhoto = (photoData: Omit<SitePhoto, 'id' | 'reportId' | 'projectId'>) => {
    if (!activeReport) return;
    const newPhoto: SitePhoto = {
      ...photoData,
      id: `photo-${Date.now()}`,
      reportId: activeReport.id,
      projectId: activeReport.projectId,
      displayOrder: activeReport.sitePhotos.length + 1,
    };
    commitReportUpdate({
      ...activeReport,
      sitePhotos: [...activeReport.sitePhotos, newPhoto],
    });
  };

  const updateSitePhoto = (id: string, updates: Partial<SitePhoto>) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      sitePhotos: activeReport.sitePhotos.map(p => p.id === id ? { ...p, ...updates } : p),
    });
  };

  const deleteSitePhoto = (id: string) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      sitePhotos: activeReport.sitePhotos.filter(p => p.id !== id),
    });
  };

  const reorderSitePhotos = (newPhotos: SitePhoto[]) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      sitePhotos: newPhotos.map((p, idx) => ({ ...p, displayOrder: idx + 1 })),
    });
  };

  // Next Two Weeks operations
  const addNextTwoWeeksItem = (itemData: Omit<NextTwoWeeksItem, 'id' | 'reportId'>) => {
    if (!activeReport) return;
    const newItem: NextTwoWeeksItem = {
      ...itemData,
      id: `ntw-${Date.now()}`,
      reportId: activeReport.id,
    };
    commitReportUpdate({
      ...activeReport,
      nextTwoWeeks: [...activeReport.nextTwoWeeks, newItem],
    });
  };

  const updateNextTwoWeeksItem = (id: string, updates: Partial<NextTwoWeeksItem>) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      nextTwoWeeks: activeReport.nextTwoWeeks.map(i => i.id === id ? { ...i, ...updates } : i),
    });
  };

  const deleteNextTwoWeeksItem = (id: string) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      nextTwoWeeks: activeReport.nextTwoWeeks.filter(i => i.id !== id),
    });
  };

  // Risks operations
  const addRisk = (riskData: Omit<ProjectRisk, 'id' | 'reportId' | 'projectId'>) => {
    if (!activeReport) return;
    const newRisk: ProjectRisk = {
      ...riskData,
      id: `risk-${Date.now()}`,
      reportId: activeReport.id,
      projectId: activeReport.projectId,
    };
    commitReportUpdate({
      ...activeReport,
      risks: [...activeReport.risks, newRisk],
    });
  };

  const updateRisk = (id: string, updates: Partial<ProjectRisk>) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      risks: activeReport.risks.map(r => r.id === id ? { ...r, ...updates } : r),
    });
  };

  const deleteRisk = (id: string) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      risks: activeReport.risks.filter(r => r.id !== id),
    });
  };

  // Summary updates
  const updateSummary = (newSummary: Partial<WeeklyAchievementsSummary>) => {
    if (!activeReport) return;
    commitReportUpdate({
      ...activeReport,
      summary: {
        ...activeReport.summary,
        ...newSummary,
      },
    });
  };

  // Undo / Redo
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = () => {
    if (!canUndo) return;
    const prev = history[historyIndex];
    setHistoryIndex(prevIdx => prevIdx - 1);
    setAllReports(prev);
    triggerAutoSave(undefined, prev);
  };

  const redo = () => {
    if (!canRedo) return;
    const nextIdx = historyIndex + 1;
    const next = history[nextIdx];
    setHistoryIndex(nextIdx);
    setAllReports(next);
    triggerAutoSave(undefined, next);
  };

  const resetToSampleData = () => {
    if (confirm('Reset entire application database to the demonstration Swelect Energy 5 MW Solar Park project?')) {
      setProjects([sampleProject]);
      setAllReports(sampleReports);
      setActiveProjectId(sampleProject.id);
      setActiveReportId('rep-wk-42');
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify([sampleProject]));
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(sampleReports));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROJ, sampleProject.id);
      localStorage.setItem(STORAGE_KEY_ACTIVE_REP, 'rep-wk-42');
      setHistory([]);
      setHistoryIndex(-1);
      setSaveStatus('saved');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        sidebarOpen,
        setSidebarOpen,
        user,
        setUser,
        projects,
        activeProject,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,
        reports: projectReports,
        activeReport,
        setActiveReportId,
        createNewWeekReport,
        updateActiveReport,
        deleteReport,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        duplicateActivity,
        bulkUpdateActivities,
        recalculateProgress,
        sitePhotos,
        addSitePhoto,
        updateSitePhoto,
        deleteSitePhoto,
        reorderSitePhotos,
        nextTwoWeeks,
        addNextTwoWeeksItem,
        updateNextTwoWeeksItem,
        deleteNextTwoWeeksItem,
        risks,
        addRisk,
        updateRisk,
        deleteRisk,
        summary,
        updateSummary,
        saveStatus,
        canUndo,
        canRedo,
        undo,
        redo,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
