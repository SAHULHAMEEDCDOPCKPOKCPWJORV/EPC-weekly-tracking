import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SitePhoto, NextTwoWeeksItem } from '../types';
import { 
  Camera, 
  Plus, 
  Trash2, 
  MapPin, 
  Calendar, 
  CalendarRange, 
  Clock, 
  Upload, 
  Edit3, 
  Check, 
  AlertTriangle,
  Star,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const SiteProgressView: React.FC = () => {
  const {
    activeProject,
    activeReport,
    sitePhotos,
    addSitePhoto,
    updateSitePhoto,
    deleteSitePhoto,
    nextTwoWeeks,
    addNextTwoWeeksItem,
    updateNextTwoWeeksItem,
    deleteNextTwoWeeksItem,
  } = useApp();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isCoverSelected, setIsCoverSelected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoForm, setPhotoForm] = useState<{
    url: string;
    caption: string;
    location: string;
    date: string;
    workstream: string;
    isCover: boolean;
  }>({
    url: '',
    caption: '',
    location: activeProject?.location ? `${activeProject.location} | GPS Verified` : 'Site Location',
    date: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }),
    workstream: 'Construction',
    isCover: false,
  });

  const [isNextModalOpen, setIsNextModalOpen] = useState<boolean>(false);
  const [nextForm, setNextForm] = useState<{
    activityName: string;
    dueDate: string;
    isCriticalPath: boolean;
    responsiblePerson: string;
    expectedProgress: number;
    status: string;
    remarks: string;
  }>({
    activityName: '',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    isCriticalPath: false,
    responsiblePerson: activeProject?.projectManager || 'Site Engineer',
    expectedProgress: 100,
    status: 'In Progress',
    remarks: '',
  });

  // Handle local image file selection from PC or smartphone
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const base64Data = ev.target.result as string;
          setPhotoPreview(base64Data);
          setPhotoForm(prev => ({
            ...prev,
            url: base64Data,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenPhotoModal = () => {
    setPhotoPreview('');
    setIsCoverSelected(sitePhotos.length === 0);
    setPhotoForm({
      url: '',
      caption: '',
      location: activeProject?.location ? `${activeProject.location} | Lat 14.5896° N, Long 76.1992° E` : 'Site Location',
      date: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }),
      workstream: 'Construction',
      isCover: sitePhotos.length === 0,
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.url) {
      alert('Please upload an image file from your computer or camera.');
      return;
    }
    if (!photoForm.caption.trim()) {
      alert('Please provide a photo caption describing the work.');
      return;
    }

    // If this photo is set as cover, unmark any previous cover photo
    if (photoForm.isCover) {
      sitePhotos.forEach(p => {
        if (p.isCover) updateSitePhoto(p.id, { isCover: false });
      });
    }

    addSitePhoto({
      url: photoForm.url,
      caption: photoForm.caption.trim(),
      location: photoForm.location.trim(),
      date: photoForm.date.trim(),
      workstream: photoForm.workstream.trim() || 'Construction',
      isCover: photoForm.isCover,
      displayOrder: sitePhotos.length + 1,
    });

    setIsPhotoModalOpen(false);
  };

  const handleSetCoverPhoto = (photoId: string) => {
    sitePhotos.forEach(p => {
      updateSitePhoto(p.id, { isCover: p.id === photoId });
    });
  };

  const handleSaveNextItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextForm.activityName.trim()) {
      alert('Please provide activity name.');
      return;
    }
    addNextTwoWeeksItem(nextForm);
    setIsNextModalOpen(false);
  };

  if (!activeProject || !activeReport) return null;

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Module 1: Site Progress Photographs (Zero random stock images) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              Site Progress Photographs & GPS Verification (Week {activeReport.weekNumber})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Only authentic user-uploaded photographs are used. Uploaded images are automatically formatted and aligned with GPS tags in your PowerPoint presentation.
            </p>
          </div>

          <button
            onClick={handleOpenPhotoModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-900/40 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Genuine Site Photo</span>
          </button>
        </div>

        {/* Empty State: If no photos uploaded yet */}
        {sitePhotos.length === 0 ? (
          <div className="bg-slate-900/70 border-2 border-dashed border-slate-800 rounded-2xl p-8 md:p-12 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Site Photographs Uploaded Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Upload your actual project site photographs (JPG, PNG, WebP). The system will never use random stock or unsplash images — only your verified ground pictures appear in the report and PowerPoint.
              </p>
            </div>
            <button
              onClick={handleOpenPhotoModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload First Site Photo</span>
            </button>
          </div>
        ) : (
          /* Photos Grid with user uploaded images */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sitePhotos.map(photo => (
              <div
                key={photo.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl group hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Image box with aspect ratio containment */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Workstream tag */}
                    <span className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md text-sky-400 font-bold text-[10px] px-2.5 py-0.5 rounded border border-slate-700/80">
                      {photo.workstream || 'Site Progress'}
                    </span>

                    {/* Cover badge if selected */}
                    {photo.isCover && (
                      <span className="absolute top-2 right-12 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-slate-950" />
                        Cover Photo
                      </span>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (confirm('Delete this site photograph?')) {
                          deleteSitePhoto(photo.id);
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-rose-900/80 hover:bg-rose-600 text-white rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Delete Photograph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Caption & Geotag details */}
                  <div className="p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-white text-sm leading-snug">
                      {photo.caption}
                    </h4>

                    <div className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{photo.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{photo.date}</span>
                    </div>
                  </div>
                </div>

                {/* Card footer: Set as cover button */}
                <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
                  {!photo.isCover ? (
                    <button
                      onClick={() => handleSetCoverPhoto(photo.id)}
                      className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set as Slide 1 Cover Photo</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Displayed on Slide 1 Cover</span>
                    </span>
                  )}

                  <span className="text-[10px] text-slate-500 font-mono">
                    Order #{photo.displayOrder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Module 2: Next Two Weeks Look-Ahead Plan */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-sky-400" />
              Next Two Weeks Look-Ahead Plan
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              14-day milestone look-ahead with critical path dependencies, synced directly into Slide 4 of PowerPoint.
            </p>
          </div>

          <button
            onClick={() => {
              setNextForm({
                activityName: '',
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                isCriticalPath: false,
                responsiblePerson: activeProject?.projectManager || 'Site Engineer',
                expectedProgress: 100,
                status: 'In Progress',
                remarks: '',
              });
              setIsNextModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Add Look-Ahead Task</span>
          </button>
        </div>

        {/* Next Two Weeks Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Activity Name</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Responsible Person</th>
                  <th className="py-3 px-4 text-center">Critical Path</th>
                  <th className="py-3 px-4 text-center">Expected %</th>
                  <th className="py-3 px-4">Status / Remarks</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {nextTwoWeeks.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.activityName}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                      {item.dueDate}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.responsiblePerson}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.isCriticalPath ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Critical Path (CP)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-sky-400">
                      {item.expectedProgress}%
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {item.remarks || item.status}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteNextTwoWeeksItem(item.id)}
                        className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                Upload Genuine Site Photograph
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
              {/* File Selector & Drag-Drop Box */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Select Image File (From Computer / Smartphone) *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/60"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  {photoPreview ? (
                    <div className="space-y-2">
                      <div className="max-h-48 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900">
                        <img
                          src={photoPreview}
                          alt="Upload Preview"
                          className="max-h-48 object-contain rounded"
                        />
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Image ready for PowerPoint export (Click to change)
                      </span>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                      <div className="text-slate-300 font-bold text-xs">
                        Click to browse or drop photograph here
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Supports JPG, PNG, WebP · No stock images
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Activity Caption *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tractor Auger Column Erection for Pre-cast Boundary Wall"
                  value={photoForm.caption}
                  onChange={e => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* GPS Coordinates */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  GPS Coordinates / Site Geotag
                </label>
                <input
                  type="text"
                  value={photoForm.location}
                  onChange={e => setPhotoForm({ ...photoForm, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Date / Timestamp */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date & Timestamp</label>
                  <input
                    type="text"
                    value={photoForm.date}
                    onChange={e => setPhotoForm({ ...photoForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Workstream */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Workstream</label>
                  <input
                    type="text"
                    value={photoForm.workstream}
                    onChange={e => setPhotoForm({ ...photoForm, workstream: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Construction"
                  />
                </div>
              </div>

              {/* Cover Photo Option */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="coverCheck"
                  checked={photoForm.isCover}
                  onChange={e => setPhotoForm({ ...photoForm, isCover: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="coverCheck" className="text-xs text-slate-300 cursor-pointer select-none">
                  <strong className="text-white block">Set as Project Cover Photo (Slide 1)</strong>
                  <span className="text-[10px] text-slate-400">
                    Displays this picture on the executive cover page of the PowerPoint report.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!photoPreview}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-blue-900/40"
                >
                  Save & Include in PPT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Look Ahead Modal */}
      {isNextModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-sky-400" />
                Add Next Two Weeks Task
              </h3>
              <button
                onClick={() => setIsNextModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNextItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Activity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Switchyard & Pile Casting completion"
                  value={nextForm.activityName}
                  onChange={e => setNextForm({ ...nextForm, activityName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={nextForm.dueDate}
                    onChange={e => setNextForm({ ...nextForm, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expected %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={nextForm.expectedProgress}
                    onChange={e => setNextForm({ ...nextForm, expectedProgress: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cpCheck"
                  checked={nextForm.isCriticalPath}
                  onChange={e => setNextForm({ ...nextForm, isCriticalPath: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="cpCheck" className="text-rose-400 font-bold cursor-pointer">
                  Critical Path Item (CP)
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remarks / Dependencies</label>
                <textarea
                  rows={2}
                  value={nextForm.remarks}
                  onChange={e => setNextForm({ ...nextForm, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNextModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/40"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};