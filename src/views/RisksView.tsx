import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectRisk } from '../types';
import { 
  AlertOctagon, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  UserCheck, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const RisksView: React.FC = () => {
  const {
    activeProject,
    activeReport,
    risks,
    addRisk,
    updateRisk,
    deleteRisk,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [riskForm, setRiskForm] = useState<Omit<ProjectRisk, 'id' | 'reportId' | 'projectId'>>({
    title: '',
    description: '',
    category: 'Approvals & Permits',
    identifiedDate: new Date().toISOString().split('T')[0],
    probability: 'High',
    impact: 'High',
    riskLevel: 'High',
    responsiblePerson: activeProject?.projectManager || 'Project Delivery Lead',
    mitigationPlan: '',
    currentStatus: 'Open',
    clientActionRequired: '',
    targetResolutionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setRiskForm({
      title: '',
      description: '',
      category: 'Approvals & Permits',
      identifiedDate: new Date().toISOString().split('T')[0],
      probability: 'High',
      impact: 'High',
      riskLevel: 'High',
      responsiblePerson: activeProject?.projectManager || 'Project Delivery Lead',
      mitigationPlan: '',
      currentStatus: 'Open',
      clientActionRequired: '',
      targetResolutionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (risk: ProjectRisk) => {
    setEditingId(risk.id);
    setRiskForm({
      title: risk.title,
      description: risk.description,
      category: risk.category,
      identifiedDate: risk.identifiedDate,
      probability: risk.probability,
      impact: risk.impact,
      riskLevel: risk.riskLevel,
      responsiblePerson: risk.responsiblePerson,
      mitigationPlan: risk.mitigationPlan,
      currentStatus: risk.currentStatus,
      clientActionRequired: risk.clientActionRequired,
      targetResolutionDate: risk.targetResolutionDate,
    });
    setIsModalOpen(true);
  };

  const handleSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskForm.title.trim()) {
      alert('Please provide risk title.');
      return;
    }

    if (editingId) {
      updateRisk(editingId, riskForm);
    } else {
      addRisk(riskForm);
    }
    setIsModalOpen(false);
  };

  if (!activeProject || !activeReport) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            Risks, Mitigation & Client Actions Register
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify project bottleneck risks and capture explicit action items required from the client.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-900/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Risk</span>
        </button>
      </div>

      {/* Risk Matrix & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xl">
            {risks.filter(r => r.riskLevel === 'Critical' || r.riskLevel === 'High').length}
          </div>
          <div>
            <div className="text-sm font-bold text-white">Critical & High Risks</div>
            <div className="text-xs text-rose-400 font-medium">Requiring executive attention</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xl">
            {risks.filter(r => r.currentStatus === 'Open').length}
          </div>
          <div>
            <div className="text-sm font-bold text-white">Active Open Items</div>
            <div className="text-xs text-amber-400 font-medium">Awaiting mitigation action</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
            {risks.filter(r => Boolean(r.clientActionRequired)).length}
          </div>
          <div>
            <div className="text-sm font-bold text-white">Client Action Items</div>
            <div className="text-xs text-blue-400 font-medium">What we need from you</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left Risks / Right Client Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Risk Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Project Risks & Impact Log
          </h3>

          <div className="space-y-3">
            {risks.map(risk => (
              <div
                key={risk.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {risk.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{risk.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        risk.riskLevel === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : risk.riskLevel === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {risk.riskLevel} Level
                    </span>

                    <button
                      onClick={() => handleOpenEdit(risk)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                      title="Edit Risk"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete risk "${risk.title}"?`)) {
                          deleteRisk(risk.id);
                        }
                      }}
                      className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded"
                      title="Delete Risk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {risk.description}
                </p>

                <div className="text-xs space-y-1 text-slate-400">
                  <div>
                    Mitigation:{' '}
                    <strong className="text-slate-200 font-medium">{risk.mitigationPlan || 'Active follow up'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                    <span>Owner: {risk.responsiblePerson}</span>
                    <span>Target: <strong className="text-amber-400 font-mono">{risk.targetResolutionDate}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: "WHAT WE NEED FROM YOU" (Matches Page 5 of PPT!) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            What We Need From You (Client Support Required)
          </h3>

          <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 p-3 rounded-lg border border-blue-500/20">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Primary Escalation Path
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Client points of contact: {activeProject.contractorName || 'Dexler'} Project Delivery team.
              </p>
            </div>

            <div className="space-y-3">
              {risks
                .filter(r => r.clientActionRequired)
                .map((risk, idx) => (
                  <div
                    key={risk.id}
                    className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-white mb-1">
                        {risk.clientActionRequired}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Linked Risk: <span className="text-slate-300">{risk.title}</span> · Target: <span className="text-amber-400 font-mono">{risk.targetResolutionDate}</span>
                      </div>
                    </div>
                  </div>
                ))}

              {risks.filter(r => r.clientActionRequired).length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active client dependencies recorded. Edit any risk to add client action items.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Risk Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                {editingId ? 'Edit Risk Record' : 'Log New Project Risk'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRisk} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Risk Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GO Name Transfer/Change"
                  value={riskForm.title}
                  onChange={e => setRiskForm({ ...riskForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Risk Category</label>
                  <select
                    value={riskForm.category}
                    onChange={e => setRiskForm({ ...riskForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Approvals & Permits">Approvals & Permits</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Land & Civil">Land & Civil</option>
                    <option value="Transmission & Bay">Transmission & Bay</option>
                    <option value="Commercial & Billing">Commercial & Billing</option>
                    <option value="Quality & Safety">Quality & Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Risk Level</label>
                  <select
                    value={riskForm.riskLevel}
                    onChange={e => setRiskForm({ ...riskForm, riskLevel: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Risk Description & Potential Impact</label>
                <textarea
                  rows={2}
                  placeholder="Awaiting signed Shareholding Agreement from Swelect..."
                  value={riskForm.description}
                  onChange={e => setRiskForm({ ...riskForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mitigation Plan</label>
                <textarea
                  rows={2}
                  placeholder="Steps taken by EPC contractor to reduce delay..."
                  value={riskForm.mitigationPlan}
                  onChange={e => setRiskForm({ ...riskForm, mitigationPlan: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  What We Need From You (Client Support Required)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Awaiting Share Holding Agreement - dependency for GO name Transfer"
                  value={riskForm.clientActionRequired}
                  onChange={e => setRiskForm({ ...riskForm, clientActionRequired: e.target.value })}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-lg p-2.5 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Resolution Date</label>
                  <input
                    type="date"
                    value={riskForm.targetResolutionDate}
                    onChange={e => setRiskForm({ ...riskForm, targetResolutionDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={riskForm.currentStatus}
                    onChange={e => setRiskForm({ ...riskForm, currentStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Mitigated">Mitigated</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-lg shadow-rose-900/40"
                >
                  {editingId ? 'Save Changes' : 'Add Risk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
