import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Settings, 
  UserCheck, 
  Database, 
  RotateCcw, 
  Smartphone, 
  Monitor, 
  Download, 
  Upload, 
  Check, 
  ShieldCheck,
  Terminal,
  Layers
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    setUser,
    resetToSampleData,
    projects,
    reports,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'data' | 'platforms'>('profile');
  const [saveBanner, setSaveBanner] = useState<boolean>(false);

  const roles: { role: UserRole; desc: string }[] = [
    { role: 'Admin', desc: 'Full portfolio administrative access, project deletion, and system configuration.' },
    { role: 'Project Manager', desc: 'Add/edit project data, enter weekly progress, manage activities, export PPT.' },
    { role: 'Team Member', desc: 'Update progress percentages, upload site photos, log risks.' },
    { role: 'Viewer', desc: 'Read-only access to dashboard, Gantt chart, and presentation downloads.' },
  ];

  // Backup JSON download
  const handleExportBackup = () => {
    const data = {
      projects,
      reports,
      user,
      exportedAt: new Date().toISOString(),
      app: 'EPC Weekly Project Progress Manager',
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EPC_Project_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Restore JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        if (json.projects && json.reports) {
          localStorage.setItem('epc_projects_v1', JSON.stringify(json.projects));
          localStorage.setItem('epc_reports_v1', JSON.stringify(json.reports));
          alert('Database restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Settings, User Roles & Platform Deployment
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          User access control, database backup/restore, and cross-platform native build instructions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        {[
          { id: 'profile', label: 'User Profile & Roles', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'data', label: 'Database & Backups', icon: <Database className="w-4 h-4" /> },
          { id: 'platforms', label: 'Cross-Platform Build (Android / iOS / Desktop)', icon: <Smartphone className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: User Profile & Roles */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Organization / Developer</label>
              <input
                type="text"
                value={user.organization}
                onChange={e => setUser({ ...user, organization: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white">Role-Based Access Control (RBAC)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map(r => (
                <div
                  key={r.role}
                  onClick={() => setUser({ ...user, role: r.role })}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                    user.role === r.role
                      ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{r.role}</span>
                    {user.role === r.role && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Database & Backups */}
      {activeTab === 'data' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">Database Backup & Portability</h3>
            <p className="text-xs text-slate-400">
              Export the entire application database including all projects, activities, weekly snapshots, photos and risk logs as a single JSON file.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/40 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Database Backup (.json)</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restore from Backup (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset to Reference Demo Data */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-rose-400">Reset Application Database</h4>
            <p className="text-xs text-slate-400">
              Revert the application database back to the original Swelect Energy Systems Ltd 5 MW ground-mount solar park reference project (Week 42).
            </p>
            <button
              onClick={resetToSampleData}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Swelect Demonstration Data</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Cross-Platform Build Instructions */}
      {activeTab === 'platforms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              Cross-Platform Native Deployment (Android APK & iOS)
            </h3>
            <p className="text-xs text-slate-400">
              This application has been structured with standard Capacitor configuration for native mobile builds and Desktop PWA packaging.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Android instructions */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 font-sans text-xs block">
                1. Android APK Build (via Capacitor & Android SDK)
              </span>
              <div className="text-slate-300 space-y-1">
                <div># Step 1: Build the production bundle</div>
                <div className="text-sky-300">npm run build</div>
                <div># Step 2: Add Capacitor Android platform (if not already added)</div>
                <div className="text-sky-300">npx cap add android</div>
                <div># Step 3: Copy web assets to Android platform</div>
                <div className="text-sky-300">npx cap sync android</div>
                <div># Step 4: Open in Android Studio or build APK with Gradle</div>
                <div className="text-sky-300">cd android && ./gradlew assembleDebug</div>
                <div className="text-slate-400 font-sans text-[11px] mt-1">
                  Output APK located at: <code>android/app/build/outputs/apk/debug/app-debug.apk</code>
                </div>
              </div>
            </div>

            {/* iOS instructions */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 font-sans text-xs block">
                2. iOS Application Build (Xcode on macOS)
              </span>
              <div className="text-slate-300 space-y-1">
                <div># Step 1: Sync Capacitor with iOS</div>
                <div className="text-sky-300">npx cap add ios && npx cap sync ios</div>
                <div># Step 2: Open workspace in Xcode</div>
                <div className="text-sky-300">npx cap open ios</div>
                <div className="text-slate-400 font-sans text-[11px] mt-1">
                  In Xcode, select your development team and click Product → Archive / Build for iOS devices.
                </div>
              </div>
            </div>

            {/* Desktop / PWA instructions */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 font-sans text-xs block">
                3. Desktop PC (Windows / macOS) PWA Installation
              </span>
              <div className="text-slate-300 space-y-1">
                <div className="font-sans text-[11px] text-slate-300">
                  Open the application in Google Chrome, Microsoft Edge, or Safari and click the "Install Application" icon in the URL bar to install as a native desktop window.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
