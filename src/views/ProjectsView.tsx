import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { 
  FolderKanban, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  Zap, 
  Building2, 
  Clock, 
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    setCurrentView,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    clientName: '',
    contractorName: 'Dexler Energy',
    location: '',
    capacity: '',
    type: 'Utility Solar PV EPC',
    projectManager: '',
    startDate: new Date().toISOString().split('T')[0],
    baselineCod: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    contractualCod: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    forecastCod: new Date(Date.now() + 105 * 86400000).toISOString().split('T')[0],
    reportingFrequency: 'Weekly',
    description: '',
    status: 'Active',
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      clientName: '',
      contractorName: 'Dexler Energy',
      location: '',
      capacity: '10 MW AC / 14 MWp DC',
      type: 'Utility Solar PV EPC',
      projectManager: 'Dexler Project Delivery Team',
      startDate: new Date().toISOString().split('T')[0],
      baselineCod: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      contractualCod: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      forecastCod: new Date(Date.now() + 105 * 86400000).toISOString().split('T')[0],
      reportingFrequency: 'Weekly',
      description: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      clientName: project.clientName,
      contractorName: project.contractorName || 'Dexler Energy',
      location: project.location,
      capacity: project.capacity,
      type: project.type,
      projectManager: project.projectManager,
      startDate: project.startDate,
      baselineCod: project.baselineCod,
      contractualCod: project.contractualCod,
      forecastCod: project.forecastCod,
      reportingFrequency: project.reportingFrequency,
      description: project.description,
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.clientName.trim()) {
      alert('Please fill in Project Name and Client Name.');
      return;
    }

    if (editingId) {
      updateProject(editingId, formData);
    } else {
      createProject(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-500" />
            Project Creation and Portfolio Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and switch between enterprise EPC projects without data loss.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-900/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(proj => {
          const isActive = proj.id === activeProject?.id;
          const isSample = proj.id === 'proj-swelect-5mw';

          return (
            <div
              key={proj.id}
              className={`bg-slate-900 border rounded-xl p-5 shadow-xl transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'border-blue-500 ring-1 ring-blue-500/40 shadow-blue-900/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {proj.capacity || 'Solar Park'}
                  </span>
                  <div className="flex items-center gap-2">
                    {isSample && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Demo Project
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : proj.status === 'Delayed'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{proj.name}</h3>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Client: <strong className="text-slate-200">{proj.clientName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Location: {proj.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Baseline COD: {proj.baselineCod}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Forecast COD: {proj.forecastCod}</span>
                  </div>
                </div>

                {proj.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 mb-4">
                    {proj.description}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {isActive ? (
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active Project
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveProjectId(proj.id)}
                    className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Select Project
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Edit Project Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${proj.name}"? This action cannot be undone.`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-500" />
                {editingId ? 'Edit Project Information' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 MW AC / 7 MWp DC Solar Park"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swelect Energy Systems Ltd"
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contractor / Developer</label>
                  <input
                    type="text"
                    value={formData.contractorName}
                    onChange={e => setFormData({ ...formData, contractorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Pallaghatta, Karnataka"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 MW AC / 7 MWp DC"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Manager</label>
                  <input
                    type="text"
                    placeholder="Dexler Project Delivery Team"
                    value={formData.projectManager}
                    onChange={e => setFormData({ ...formData, projectManager: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reporting Frequency</label>
                  <select
                    value={formData.reportingFrequency}
                    onChange={e => setFormData({ ...formData, reportingFrequency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Baseline COD</label>
                  <input
                    type="date"
                    value={formData.baselineCod}
                    onChange={e => setFormData({ ...formData, baselineCod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contractual COD</label>
                  <input
                    type="date"
                    value={formData.contractualCod}
                    onChange={e => setFormData({ ...formData, contractualCod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Forecast COD</label>
                  <input
                    type="date"
                    value={formData.forecastCod}
                    onChange={e => setFormData({ ...formData, forecastCod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Description & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of project scope, transmission lines, substation work..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  {editingId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
