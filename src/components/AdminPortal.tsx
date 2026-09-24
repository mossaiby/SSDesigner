import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  UploadCloud, 
  FileText, 
  Layers, 
  Building2, 
  Image as ImageIcon, 
  Film, 
  Users, 
  Activity, 
  Download, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Eye, 
  X,
  Search
} from 'lucide-react';
import { SoftwareItem, ProjectItem, MediaItem, BlogPost, LeadInquiry, UserRole } from '../types';
import { getBruteForceStatus } from '../utils/security';

type AdminTab = 'software' | 'projects' | 'media' | 'blog' | 'leads' | 'audit' | 'system';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    isAdminLoggedIn,
    login,
    logout,
    quickLoginAs,
    can,
    softwareList,
    addSoftware,
    updateSoftware,
    deleteSoftware,
    projectsList,
    addProject,
    updateProject,
    deleteProject,
    mediaList,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    leads,
    updateLeadStatus,
    deleteLead,
    auditLogs,
    resetAllData,
    exportDatabaseJson,
    importDatabaseJson,
    openMediaLightbox,
    navigateTo,
  } = useData();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<AdminTab>('software');

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTargetFilter, setMediaTargetFilter] = useState<string>('all');

  // Modals for CRUD operations
  const [editingSoftware, setEditingSoftware] = useState<SoftwareItem | null>(null);
  const [isAddingSoftware, setIsAddingSoftware] = useState(false);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);

  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; name: string } | null>(null);

  // File upload state
  const [uploadPreview, setUploadPreview] = useState<string>('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError('');

    const res = await login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
    setIsSubmittingLogin(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      callback(url);
      setUploadPreview(url);
    };
    reader.readAsDataURL(file);
  };

  // If not logged in, show secure login screen
  if (!isAdminLoggedIn) {
    const bf = getBruteForceStatus();

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Engineering Admin Portal
              </h2>
              <p className="text-xs text-slate-400">
                Authorized Personnel & System Operators Only
              </p>
            </div>
          </div>

          {bf.isLocked ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs mb-6 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Security Lockout Active</p>
                <p className="mt-1 text-slate-400">
                  Multiple invalid credentials detected. Temporary lock enabled for {bf.remainingSeconds} seconds to mitigate brute-force attacks.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 mb-6">
              {loginError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Operator Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="admin@spatialfem.com"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Security Passkey
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50"
              >
                {isSubmittingLogin ? 'Authenticating...' : 'Authenticate Operator'}
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="pt-6 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Role-Based Access (Evaluation)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLoginAs('administrator')}
                className="p-2 text-center rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-[11px] text-slate-300 transition-colors"
              >
                <span className="font-semibold block">Admin</span>
                <span className="text-[9px] text-slate-500">Full Access</span>
              </button>
              <button
                onClick={() => quickLoginAs('lead_engineer')}
                className="p-2 text-center rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-[11px] text-slate-300 transition-colors"
              >
                <span className="font-semibold block">Engineer</span>
                <span className="text-[9px] text-slate-500">Profiles/Media</span>
              </button>
              <button
                onClick={() => quickLoginAs('editor')}
                className="p-2 text-center rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-[11px] text-slate-300 transition-colors"
              >
                <span className="font-semibold block">Editor</span>
                <span className="text-[9px] text-slate-500">Blog/Media</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in Dashboard
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Top Control Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  SSDesigner Master Admin Console
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-slate-200">{currentUser?.name}</span> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo({ view: 'home' })}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              View Public Website
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl mb-8 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('software')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'software' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Software Profiles ({softwareList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Real-World Projects ({projectsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'media' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galleries & Media ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'blog' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Technical Blog ({blogPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'leads' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Inbound Leads ({leads.length})</span>
          </button>

          {can('view_audit_logs') && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'audit' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </button>
          )}

          {can('system_reset') && (
            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'system' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Backup & Reset</span>
            </button>
          )}
        </div>

        {/* ===================== TAB 1: SOFTWARE PROFILES ===================== */}
        {activeTab === 'software' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Engineering Software Profiles
                </h2>
                <p className="text-xs text-slate-400">
                  Manage spatial structure calculation engines, solvers, and mathematical specifications.
                </p>
              </div>

              {can('manage_software') && (
                <button
                  onClick={() => setIsAddingSoftware(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Software Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {softwareList.map(soft => {
                const mediaCount = mediaList.filter(m => m.targetType === 'software' && m.targetId === soft.id).length;
                return (
                  <div
                    key={soft.id}
                    className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                          {soft.category} · v{soft.version}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {mediaCount} Media Assets
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">
                        {soft.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium mb-3">
                        {soft.tagline}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {soft.description}
                      </p>

                      <div className="space-y-2 mb-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]">
                        <div className="text-slate-400 font-mono">
                          <span className="text-cyan-400 font-semibold">Solver:</span> {soft.specs.solverType}
                        </div>
                        <div className="text-slate-400 font-mono">
                          <span className="text-cyan-400 font-semibold">Capacity:</span> {soft.specs.maxNodesTested}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => navigateTo({ view: 'software', id: soft.id })}
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Showcase Page
                      </button>

                      <div className="flex items-center gap-2">
                        {can('manage_software') && (
                          <button
                            onClick={() => setEditingSoftware(soft)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title="Edit Profile"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {can('manage_software') && (
                          <button
                            onClick={() => setConfirmDelete({ type: 'software', id: soft.id, name: soft.name })}
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors"
                            title="Delete Software"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: REAL-WORLD PROJECTS ===================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Real-World Space Structure Projects
                </h2>
                <p className="text-xs text-slate-400">
                  Case studies, clear spans, client endorsements, and structural solutions.
                </p>
              </div>

              {can('manage_projects') && (
                <button
                  onClick={() => setIsAddingProject(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Project Case Study
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectsList.map(proj => {
                const mediaCount = mediaList.filter(m => m.targetType === 'project' && m.targetId === proj.id).length;
                return (
                  <div
                    key={proj.id}
                    className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                          {proj.category} · {proj.year}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {mediaCount} Media Assets
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium mb-3">
                        {proj.location} · {proj.span}
                      </p>

                      <div className="space-y-2 mb-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]">
                        <div className="text-slate-400">
                          <span className="text-cyan-400 font-mono font-semibold">Structural System:</span> {proj.structuralSystem}
                        </div>
                        <div className="text-slate-400">
                          <span className="text-cyan-400 font-mono font-semibold">Lead Client:</span> {proj.clientOrEngineer}
                        </div>
                        <div className="text-slate-400">
                          <span className="text-emerald-400 font-mono font-semibold">Material Saved:</span> {proj.steelWeightSaved}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => navigateTo({ view: 'project', id: proj.id })}
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Case Study Page
                      </button>

                      <div className="flex items-center gap-2">
                        {can('manage_projects') && (
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {can('manage_projects') && (
                          <button
                            onClick={() => setConfirmDelete({ type: 'project', id: proj.id, name: proj.title })}
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: MEDIA & GALLERIES ===================== */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Central Media & Gallery Repository
                </h2>
                <p className="text-xs text-slate-400">
                  Upload, inspect, and organize photo assets and video simulations for all software and projects.
                </p>
              </div>

              {can('manage_media') && (
                <button
                  onClick={() => setIsAddingMedia(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Photo / Video
                </button>
              )}
            </div>

            {/* Media Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">Filter by Target:</span>
                <select
                  value={mediaTargetFilter}
                  onChange={e => setMediaTargetFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                >
                  <option value="all">All Targets ({mediaList.length})</option>
                  <optgroup label="Software Packages">
                    {softwareList.map(s => (
                      <option key={s.id} value={`software:${s.id}`}>Software: {s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Real-World Projects">
                    {projectsList.map(p => (
                      <option key={p.id} value={`project:${p.id}`}>Project: {p.title}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="text-slate-500 font-mono text-[11px]">
                Showing {
                  mediaList.filter(m => {
                    if (mediaTargetFilter === 'all') return true;
                    const [type, id] = mediaTargetFilter.split(':');
                    return m.targetType === type && m.targetId === id;
                  }).length
                } media items
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaList
                .filter(m => {
                  if (mediaTargetFilter === 'all') return true;
                  const [type, id] = mediaTargetFilter.split(':');
                  return m.targetType === type && m.targetId === id;
                })
                .map(item => {
                  const targetName = item.targetType === 'software'
                    ? softwareList.find(s => s.id === item.targetId)?.name || item.targetId
                    : projectsList.find(p => p.id === item.targetId)?.title || item.targetId;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden flex flex-col justify-between"
                    >
                      <div 
                        onClick={() => openMediaLightbox(item)}
                        className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={item.type === 'photo' ? item.url : (item.thumbnailUrl || item.url)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                          {item.type.toUpperCase()}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300">
                          {item.targetType}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-cyan-400 mb-1 truncate">
                            Attached to: {targetName}
                          </div>
                          <h4 className="text-sm font-semibold text-white truncate mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                            {item.caption}
                          </p>
                          {item.technicalNote && (
                            <p className="text-[11px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-800/80 truncate mb-2">
                              {item.technicalNote}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                          <span className="text-[11px] font-mono text-slate-500">
                            {item.createdAt}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openMediaLightbox(item)}
                              className="p-1 text-cyan-400 hover:text-cyan-300"
                              title="Inspect Full"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {can('manage_media') && (
                              <button
                                onClick={() => setEditingMedia(item)}
                                className="p-1 text-slate-400 hover:text-white"
                                title="Edit Metadata"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {can('manage_media') && (
                              <button
                                onClick={() => setConfirmDelete({ type: 'media', id: item.id, name: item.title })}
                                className="p-1 text-rose-400 hover:text-rose-300"
                                title="Delete Media"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: BLOG POSTS ===================== */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Industry Insights & Technical Publications
                </h2>
                <p className="text-xs text-slate-400">
                  Publish whitepapers, release notes, and computational research papers.
                </p>
              </div>

              {can('manage_blog') && (
                <button
                  onClick={() => setIsAddingBlog(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Publish Article
                </button>
              )}
            </div>

            <div className="space-y-4">
              {blogPosts.map(post => (
                <div
                  key={post.id}
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                      <span className="text-cyan-400">{post.category}</span>
                      <span>·</span>
                      <span>{post.publishedAt}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateTo({ view: 'blog', id: post.id })}
                      className="px-3 py-1.5 text-xs text-cyan-400 border border-slate-700 rounded-lg hover:border-cyan-500 transition-colors"
                    >
                      Read Post
                    </button>
                    {can('manage_blog') && (
                      <button
                        onClick={() => setEditingBlog(post)}
                        className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    {can('manage_blog') && (
                      <button
                        onClick={() => setConfirmDelete({ type: 'blog', id: post.id, name: post.title })}
                        className="p-2 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: INBOUND LEADS ===================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Lead Inquiries & Inbound Opportunities
                </h2>
                <p className="text-xs text-slate-400">
                  Structural engineers, aerospace analysts, and universities requesting demos or quotes.
                </p>
              </div>

              <button
                onClick={() => {
                  const headers = 'ID,Name,Email,Organization,Role,InquiryType,Software,Status,CreatedAt\n';
                  const rows = leads.map(l => `"${l.id}","${l.name}","${l.email}","${l.organization}","${l.role}","${l.inquiryType}","${l.softwareInterest}","${l.status}","${l.createdAt}"`).join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `aerospatial_leads_${new Date().toISOString().substring(0, 10)}.csv`;
                  a.click();
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Organization & Role</th>
                    <th className="py-3 px-4">Inquiry Type</th>
                    <th className="py-3 px-4">Interest</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="font-mono text-cyan-400 text-[11px]">{lead.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{lead.organization}</div>
                        <div className="text-slate-500 text-[11px]">{lead.role}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {lead.inquiryType}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {lead.softwareInterest}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                          className="px-2 py-1 text-xs rounded bg-slate-950 border border-slate-700 text-slate-200"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Demo Scheduled">Demo Scheduled</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {lead.createdAt}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {can('delete_leads') && (
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: AUDIT LOGS ===================== */}
        {activeTab === 'audit' && can('view_audit_logs') && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Security & Audit Ledger
              </h2>
              <p className="text-xs text-slate-400">
                Tamper-resistant record of administrative actions, data edits, and security events.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden font-mono text-xs">
              <div className="divide-y divide-slate-800">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        log.severity === 'critical' ? 'bg-rose-500' : log.severity === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
                      <div>
                        <span className="font-semibold text-white">{log.action}</span>
                        <span className="text-slate-400 ml-2">by {log.actor}</span>
                        <div className="text-slate-400 text-[11px] font-sans mt-0.5">
                          {log.details}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 7: BACKUP & SYSTEM RESET ===================== */}
        {activeTab === 'system' && can('system_reset') && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Database Backup & Disaster Recovery
              </h2>
              <p className="text-xs text-slate-400">
                Export JSON snapshots of all software profiles, projects, media, and leads, or restore original demo configurations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
              <h3 className="text-sm font-semibold text-white">Database Snapshot Export</h3>
              <p className="text-xs text-slate-400">
                Download a complete, offline JSON bundle containing all profiles, galleries, and blog articles.
              </p>
              <button
                onClick={() => {
                  const json = exportDatabaseJson();
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `aerospatial_backup_${new Date().toISOString().substring(0, 10)}.json`;
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download JSON Backup
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
              <h3 className="text-sm font-semibold text-white">Technical SEO, Schema.org & LLM Index Inspector</h3>
              <p className="text-xs text-slate-400">
                Audit JSON-LD structured data, metadata tags, and the public <code>/llms.txt</code> AI indexing manifest for this page.
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-seo-audit'));
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Open SEO & LLM Metadata Inspector
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-rose-950/40 bg-rose-950/10 space-y-4">
              <h3 className="text-sm font-semibold text-rose-300">Factory Reset Database</h3>
              <p className="text-xs text-slate-400">
                Resets all software packages, projects, media items, and blog articles to the original factory seed dataset.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all software, projects, and media to official factory data?')) {
                    resetAllData();
                    alert('Database has been reset to official demo seed data.');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Seed Dataset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL: ADD / EDIT SOFTWARE ===================== */}
      {(isAddingSoftware || editingSoftware) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingSoftware ? `Edit Software: ${editingSoftware.name}` : 'Create Engineering Software Profile'}
              </h3>
              <button
                onClick={() => { setIsAddingSoftware(false); setEditingSoftware(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);

                const softwareData = {
                  name: fd.get('name') as string,
                  tagline: fd.get('tagline') as string,
                  category: fd.get('category') as any,
                  version: fd.get('version') as string,
                  description: fd.get('description') as string,
                  keyFeatures: (fd.get('keyFeatures') as string).split('\n').filter(Boolean),
                  mathematicalFoundations: (fd.get('math') as string).split('\n').filter(Boolean),
                  thumbnail: fd.get('thumbnail') as string || '/src/assets/images/software_form_finding_1790188528595.jpg',
                  releaseDate: fd.get('releaseDate') as string || new Date().toISOString().substring(0, 10),
                  featured: fd.get('featured') === 'on',
                  specs: {
                    solverType: fd.get('solverType') as string,
                    formulation: fd.get('formulation') as string,
                    elementsSupported: (fd.get('elements') as string).split(',').map(s => s.trim()).filter(Boolean),
                    maxNodesTested: fd.get('maxNodes') as string,
                    fileIOFormats: (fd.get('fileIO') as string).split(',').map(s => s.trim()).filter(Boolean),
                    hardwareAcceleration: fd.get('hardware') as string,
                    complianceStandards: (fd.get('standards') as string).split(',').map(s => s.trim()).filter(Boolean),
                  }
                };

                if (editingSoftware) {
                  updateSoftware(editingSoftware.id, softwareData);
                } else {
                  addSoftware(softwareData);
                }

                setIsAddingSoftware(false);
                setEditingSoftware(null);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Software Name *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingSoftware?.name || ''}
                    placeholder="e.g. FormSpace Prime"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Version *</label>
                  <input
                    name="version"
                    required
                    defaultValue={editingSoftware?.version || '2026.1'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Category</label>
                <select
                  name="category"
                  defaultValue={editingSoftware?.category || 'Form-Finding & Cable-Net'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="Form-Finding & Cable-Net">Form-Finding & Cable-Net</option>
                  <option value="Nonlinear FEA & Buckling">Nonlinear FEA & Buckling</option>
                  <option value="Aerospace Deployables">Aerospace Deployables</option>
                  <option value="Parametric Detailing & CNC">Parametric Detailing & CNC</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Tagline / Summary *</label>
                <input
                  name="tagline"
                  required
                  defaultValue={editingSoftware?.tagline || ''}
                  placeholder="e.g. Nonlinear Dynamic Relaxation & Equilibrium Solver"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Detailed Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingSoftware?.description || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Key Features (One per line)</label>
                <textarea
                  name="keyFeatures"
                  rows={3}
                  defaultValue={editingSoftware?.keyFeatures.join('\n') || ''}
                  placeholder="Dynamic Relaxation with kinetic damping&#10;Slack cable auto-detection"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Solver Engine</label>
                  <input
                    name="solverType"
                    defaultValue={editingSoftware?.specs.solverType || 'Dynamic Relaxation & Sparse Cholesky'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Tested Node Capacity</label>
                  <input
                    name="maxNodes"
                    defaultValue={editingSoftware?.specs.maxNodesTested || '100,000+ Spatial Nodes'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Supported Elements (Comma-separated)</label>
                <input
                  name="elements"
                  defaultValue={editingSoftware?.specs.elementsSupported.join(', ') || 'Tension Cables, Compression Struts, Beams'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Thumbnail Image URL or Path</label>
                <input
                  name="thumbnail"
                  defaultValue={editingSoftware?.thumbnail || '/src/assets/images/software_form_finding_1790188528595.jpg'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddingSoftware(false); setEditingSoftware(null); }}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  {editingSoftware ? 'Save Profile Changes' : 'Create Software Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT PROJECT ===================== */}
      {(isAddingProject || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Add Real-World Space Structure Project'}
              </h3>
              <button
                onClick={() => { setIsAddingProject(false); setEditingProject(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);

                const projectData = {
                  title: fd.get('title') as string,
                  subtitle: fd.get('subtitle') as string,
                  category: fd.get('category') as any,
                  location: fd.get('location') as string,
                  year: parseInt(fd.get('year') as string) || 2025,
                  span: fd.get('span') as string,
                  structuralSystem: fd.get('structuralSystem') as string,
                  nodeCount: fd.get('nodeCount') as string,
                  memberCount: fd.get('memberCount') as string,
                  steelWeightSaved: fd.get('steelWeightSaved') as string,
                  clientOrEngineer: fd.get('clientOrEngineer') as string,
                  softwareUsed: (fd.get('softwareUsed') as string).split(',').map(s => s.trim()).filter(Boolean),
                  challenge: fd.get('challenge') as string,
                  engineeringSolution: fd.get('engineeringSolution') as string,
                  heroImage: fd.get('heroImage') as string || '/src/assets/images/project_botanical_dome_1790188539068.jpg',
                  featured: fd.get('featured') === 'on',
                  keyMetrics: [
                    { label: 'Clear Span', value: fd.get('metricSpan') as string || '120.0', unit: 'm' },
                    { label: 'Steel Weight', value: fd.get('metricWeight') as string || '38.5', unit: 'kg/m²' },
                  ]
                };

                if (editingProject) {
                  updateProject(editingProject.id, projectData);
                } else {
                  addProject(projectData);
                }

                setIsAddingProject(false);
                setEditingProject(null);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Project Title *</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingProject?.title || ''}
                    placeholder="e.g. Grand Falcon International Velodrome"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Completion Year *</label>
                  <input
                    name="year"
                    type="number"
                    required
                    defaultValue={editingProject?.year || 2025}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Location</label>
                <input
                  name="location"
                  defaultValue={editingProject?.location || ''}
                  placeholder="e.g. Munich, Germany"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Category</label>
                <select
                  name="category"
                  defaultValue={editingProject?.category || 'Sports & Arenas'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="Sports & Arenas">Sports & Arenas</option>
                  <option value="Botanical & Domes">Botanical & Domes</option>
                  <option value="Aerospace & Satellites">Aerospace & Satellites</option>
                  <option value="Transit Hubs">Transit Hubs</option>
                  <option value="Experimental Tensegrity">Experimental Tensegrity</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Clear Span / Aperture *</label>
                  <input
                    name="span"
                    required
                    defaultValue={editingProject?.span || '140 m Clear Span'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Spatial Nodes Count</label>
                  <input
                    name="nodeCount"
                    defaultValue={editingProject?.nodeCount || '3,400 Nodes'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Structural System Description *</label>
                <input
                  name="structuralSystem"
                  required
                  defaultValue={editingProject?.structuralSystem || ''}
                  placeholder="Double-layer elliptic paraboloid space grid with spherical nodes"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Lead Client / Engineering Entity</label>
                <input
                  name="clientOrEngineer"
                  defaultValue={editingProject?.clientOrEngineer || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Engineering Challenges</label>
                <textarea
                  name="challenge"
                  rows={2}
                  defaultValue={editingProject?.challenge || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Engineering Solution & Software Role</label>
                <textarea
                  name="engineeringSolution"
                  rows={2}
                  defaultValue={editingProject?.engineeringSolution || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Software Used (Comma-separated)</label>
                <input
                  name="softwareUsed"
                  defaultValue={editingProject?.softwareUsed.join(', ') || 'FormSpace Prime, AeroLattice 3D'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Hero Image URL</label>
                <input
                  name="heroImage"
                  defaultValue={editingProject?.heroImage || '/src/assets/images/project_botanical_dome_1790188539068.jpg'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddingProject(false); setEditingProject(null); }}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  {editingProject ? 'Save Project Changes' : 'Create Project Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT MEDIA ===================== */}
      {(isAddingMedia || editingMedia) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingMedia ? 'Edit Media Asset' : 'Upload Gallery Photo / Video Simulation'}
              </h3>
              <button
                onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);

                const targetVal = fd.get('target') as string;
                const [targetType, targetId] = targetVal.split(':') as ['software' | 'project', string];

                const mediaData = {
                  type: fd.get('type') as 'photo' | 'video',
                  title: fd.get('title') as string,
                  caption: fd.get('caption') as string,
                  url: fd.get('url') as string,
                  thumbnailUrl: (fd.get('thumbnailUrl') as string) || undefined,
                  technicalNote: (fd.get('technicalNote') as string) || undefined,
                  targetType,
                  targetId,
                  tags: (fd.get('tags') as string).split(',').map(s => s.trim()).filter(Boolean),
                  dimensions: fd.get('type') === 'photo' ? '3840 x 2160 UHD' : '1920 x 1080 60fps',
                };

                if (editingMedia) {
                  updateMediaItem(editingMedia.id, mediaData);
                } else {
                  addMediaItem(mediaData);
                }

                setIsAddingMedia(false);
                setEditingMedia(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Assign to Software or Project *</label>
                <select
                  name="target"
                  required
                  defaultValue={editingMedia ? `${editingMedia.targetType}:${editingMedia.targetId}` : `software:${softwareList[0]?.id}`}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  <optgroup label="Engineering Software Profiles">
                    {softwareList.map(s => (
                      <option key={s.id} value={`software:${s.id}`}>Software: {s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Real-World Projects">
                    {projectsList.map(p => (
                      <option key={p.id} value={`project:${p.id}`}>Project: {p.title}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Asset Type</label>
                  <select
                    name="type"
                    defaultValue={editingMedia?.type || 'photo'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="photo">Photo / High-Res Render</option>
                    <option value="video">Movie / Simulation Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Asset Title *</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingMedia?.title || ''}
                    placeholder="e.g. Snap-Through Buckling Mode #1"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Option A: Upload Local File</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        const urlInput = document.getElementById('media_url_input') as HTMLInputElement;
                        if (urlInput && ev.target?.result) {
                          urlInput.value = ev.target.result as string;
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-slate-800 file:text-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Option B: Media URL / Cloud Path *</label>
                <input
                  id="media_url_input"
                  name="url"
                  required
                  defaultValue={editingMedia?.url || ''}
                  placeholder="https://... or /src/assets/images/..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Caption / Context</label>
                <textarea
                  name="caption"
                  rows={2}
                  defaultValue={editingMedia?.caption || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Technical Specification Note</label>
                <input
                  name="technicalNote"
                  defaultValue={editingMedia?.technicalNote || ''}
                  placeholder="e.g. Iteration #240 | Residual norm < 1e-8"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddingMedia(false); setEditingMedia(null); }}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  {editingMedia ? 'Save Asset' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT BLOG ===================== */}
      {(isAddingBlog || editingBlog) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingBlog ? 'Edit Technical Article' : 'Publish Technical Blog Post'}
              </h3>
              <button
                onClick={() => { setIsAddingBlog(false); setEditingBlog(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);

                const postData = {
                  title: fd.get('title') as string,
                  slug: (fd.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  category: fd.get('category') as any,
                  readTime: fd.get('readTime') as string || '5 min read',
                  excerpt: fd.get('excerpt') as string,
                  content: fd.get('content') as string,
                  coverImage: fd.get('coverImage') as string || '/src/assets/images/software_form_finding_1790188528595.jpg',
                  author: {
                    name: currentUser?.name || 'AeroSpatial Lead Engineer',
                    role: currentUser?.role === 'administrator' ? 'Chief Scientist' : 'Structural Engineer',
                  },
                  tags: (fd.get('tags') as string).split(',').map(s => s.trim()).filter(Boolean),
                };

                if (editingBlog) {
                  updateBlogPost(editingBlog.id, postData);
                } else {
                  addBlogPost(postData);
                }

                setIsAddingBlog(false);
                setEditingBlog(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Article Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingBlog?.title || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Category</label>
                  <select
                    name="category"
                    defaultValue={editingBlog?.category || 'Computational Mechanics'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Computational Mechanics">Computational Mechanics</option>
                    <option value="Aerospace Deployables">Aerospace Deployables</option>
                    <option value="Structural Case Studies">Structural Case Studies</option>
                    <option value="Product Releases">Product Releases</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Read Time</label>
                  <input
                    name="readTime"
                    defaultValue={editingBlog?.readTime || '6 min read'}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Executive Summary / Excerpt</label>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={editingBlog?.excerpt || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Article Content (Markdown Supported)</label>
                <textarea
                  name="content"
                  rows={6}
                  defaultValue={editingBlog?.content || ''}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Featured Cover Image URL</label>
                <input
                  name="coverImage"
                  defaultValue={editingBlog?.coverImage || '/src/assets/images/software_form_finding_1790188528595.jpg'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddingBlog(false); setEditingBlog(null); }}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  {editingBlog ? 'Save Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== CONFIRM DELETE MODAL ===================== */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-900/60 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Confirm Record Deletion
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Are you sure you want to permanently delete <span className="text-white font-semibold">"{confirmDelete.name}"</span>? Associated gallery media will also be unlinked.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === 'software') deleteSoftware(confirmDelete.id);
                  if (confirmDelete.type === 'project') deleteProject(confirmDelete.id);
                  if (confirmDelete.type === 'media') deleteMediaItem(confirmDelete.id);
                  if (confirmDelete.type === 'blog') deleteBlogPost(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
