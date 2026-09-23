import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, Play, Image as ImageIcon, Film, ZoomIn, ZoomOut, UploadCloud, Plus, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { MediaItem } from '../types';

export const MediaGalleryModal: React.FC = () => {
  const { 
    activeGalleryTarget, 
    closeGalleryModal, 
    mediaList, 
    addMediaItem, 
    can, 
    isAdminLoggedIn, 
    openMediaLightbox 
  } = useData();

  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New media upload form state
  const [newType, setNewType] = useState<'photo' | 'video'>('photo');
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTechnicalNote, setNewTechnicalNote] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  if (!activeGalleryTarget) return null;

  // Filter media for this target
  const targetMedia = mediaList.filter(
    m => m.targetType === activeGalleryTarget.targetType && m.targetId === activeGalleryTarget.targetId
  );

  const filteredMedia = targetMedia.filter(m => {
    if (activeTab === 'photo') return m.type === 'photo';
    if (activeTab === 'video') return m.type === 'video';
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewUrl(result);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setIsUploadingFile(false);
    };
    reader.onerror = () => {
      alert('Failed to read selected file.');
      setIsUploadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Please provide a title and image/video URL or file.');
      return;
    }

    addMediaItem({
      type: newType,
      title: newTitle.trim(),
      caption: newCaption.trim(),
      url: newUrl.trim(),
      technicalNote: newTechnicalNote.trim() || undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      targetId: activeGalleryTarget.targetId,
      targetType: activeGalleryTarget.targetType,
      dimensions: newType === 'photo' ? '3840 x 2160' : '1920 x 1080 60fps',
      duration: newType === 'video' ? '0:30' : undefined,
    });

    // Reset form
    setNewTitle('');
    setNewCaption('');
    setNewUrl('');
    setNewTechnicalNote('');
    setNewTags('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <span>Engineering Media Gallery</span>
              <span>·</span>
              <span className="capitalize">{activeGalleryTarget.targetType}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {activeGalleryTarget.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {can('manage_media') && (
              <button
                onClick={() => setShowAddForm(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Close Upload' : 'Upload Media'}</span>
              </button>
            )}

            <button
              onClick={closeGalleryModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close Gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Media Count */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'all' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Assets ({targetMedia.length})
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                activeTab === 'photo' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Photos ({targetMedia.filter(m => m.type === 'photo').length})
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                activeTab === 'video' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Movie Simulations ({targetMedia.filter(m => m.type === 'video').length})
            </button>
          </div>

          <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
            High-Resolution Photographic & Kinematic Simulation Records
          </div>
        </div>

        {/* Admin Upload / Add Media Panel (Collapsible) */}
        {showAddForm && (
          <div className="p-6 border-b border-cyan-500/30 bg-cyan-950/20 text-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Admin Media Uploader: Add photo or video to {activeGalleryTarget.title}
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Media Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType('photo')}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                        newType === 'photo'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Photo Asset
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType('video')}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                        newType === 'video'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Video Simulation
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Asset Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Buckling Mode #3 Finite Element Verification"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload file OR URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Option A: Upload Local Image / Video File
                  </label>
                  <input
                    type="file"
                    accept={newType === 'photo' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {isUploadingFile && <span className="text-[11px] text-cyan-400 mt-1 block">Reading file...</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Option B: Media URL / Cloud Path *
                  </label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder={newType === 'photo' ? 'https://... or /src/assets/...' : 'https://...mp4 or embed'}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Caption / Description</label>
                  <textarea
                    rows={2}
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    placeholder="Engineering context, solver conditions, testing environment..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Technical Specification Note</label>
                  <textarea
                    rows={2}
                    value={newTechnicalNote}
                    onChange={e => setNewTechnicalNote(e.target.value)}
                    placeholder="e.g. Tangent stiffness matrix condition number = 1.4e4 | Time step dt = 0.001s"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="FEA, Buckling, Tensegrity, Wind Tunnel"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  Publish Asset to Gallery
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {filteredMedia.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4 border border-slate-700">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-300 mb-1">
                No media assets found in this category
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                This gallery is structured and ready for future uploads. Administrators can add high-resolution photos and video simulations at any time.
              </p>
              {can('manage_media') && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add First Media Asset
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map(item => (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/20"
                >
                  {/* Media Preview Box */}
                  <div 
                    onClick={() => openMediaLightbox(item, filteredMedia)}
                    className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    {item.type === 'photo' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                        {item.duration && (
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-700/80 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                      {item.type === 'photo' ? <ImageIcon className="w-3 h-3 text-cyan-400" /> : <Film className="w-3 h-3 text-amber-400" />}
                      <span className="capitalize">{item.type}</span>
                    </div>

                    {item.dimensions && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-400">
                        {item.dimensions}
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {item.caption}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      {item.technicalNote && (
                        <div className="font-mono text-cyan-400/90 bg-cyan-950/30 p-1.5 rounded border border-cyan-900/30 truncate">
                          {item.technicalNote}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-slate-500 font-mono">
                        <span>{item.createdAt}</span>
                        <button
                          onClick={() => openMediaLightbox(item)}
                          className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                        >
                          <ZoomIn className="w-3 h-3" />
                          Inspect Full
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
