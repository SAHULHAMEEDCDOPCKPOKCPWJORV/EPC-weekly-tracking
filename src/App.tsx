import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { WeeklyInputView } from './views/WeeklyInputView';
import { ActivityManagementView } from './views/ActivityManagementView';
import { GanttChart } from './components/gantt/GanttChart';
import { WorkstreamTimelineChart } from './components/charts/WorkstreamTimelineChart';
import { SiteProgressView } from './views/SiteProgressView';
import { RisksView } from './views/RisksView';
import { ComparisonView } from './views/ComparisonView';
import { ReportBuilderView } from './views/ReportBuilderView';
import { PptExportView } from './views/PptExportView';
import { ReportHistoryView } from './views/ReportHistoryView';
import { SettingsView } from './views/SettingsView';

export const AppContent: React.FC = () => {
  const { currentView, activities, updateActivity, activeProject, activeReport } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'weekly-input':
        return <WeeklyInputView />;
      case 'activities':
        return <ActivityManagementView />;
      case 'gantt':
        return (
          <div className="p-4 md:p-6 h-full flex flex-col">
            <div className="mb-3">
              <h2 className="text-base md:text-lg font-bold text-white">
                Interactive Project Master Gantt Schedule (Primavera P6 Style)
              </h2>
              <p className="text-xs text-slate-400">
                Click any activity row or bar to modify start/finish dates, delay days, and critical path parameters.
              </p>
            </div>
            <div className="flex-1 min-h-[500px]">
              <GanttChart
                activities={activities}
                onUpdateActivity={updateActivity}
                baselineCod={activeProject?.baselineCod || '2026-11-28'}
                forecastCod={activeReport?.forecastCod || activeProject?.forecastCod || '2026-12-18'}
              />
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto overflow-y-auto">
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">
                Monthly Workstream Delivery Timeline
              </h2>
              <p className="text-xs text-slate-400">
                Synchronized 12-workstream baseline tracking matching Slide 2 of executive report.
              </p>
            </div>
            <WorkstreamTimelineChart activities={activities} />
          </div>
        );
      case 'site-progress':
        return <SiteProgressView />;
      case 'risks':
        return <RisksView />;
      case 'comparison':
        return <ComparisonView />;
      case 'report-builder':
        return <ReportBuilderView />;
      case 'ppt-export':
        return <PptExportView />;
      case 'report-history':
        return <ReportHistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-14 md:pb-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};
