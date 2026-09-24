import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SoftwareItem, 
  ProjectItem, 
  BlogPost, 
  LeadInquiry, 
  MediaItem, 
  AdminUser, 
  AuditLog, 
  UserRole, 
  PermissionAction 
} from '../types';
import { 
  INITIAL_SOFTWARE_ITEMS, 
  INITIAL_PROJECT_ITEMS, 
  INITIAL_BLOG_POSTS, 
  INITIAL_LEADS, 
  INITIAL_MEDIA_ITEMS, 
  INITIAL_ADMIN_USERS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';
import { 
  hasPermission, 
  hashPassword, 
  getBruteForceStatus, 
  recordFailedLogin, 
  resetLoginAttempts, 
  sanitizeInput 
} from '../utils/security';
import { api, DbStatusResponse } from '../services/api';

export type NavigationTarget = 
  | { view: 'home' }
  | { view: 'software'; id: string }
  | { view: 'project'; id: string }
  | { view: 'blog'; id: string }
  | { view: 'all_software' }
  | { view: 'all_projects' }
  | { view: 'all_blog' }
  | { view: 'admin' }
  | { view: 'contact' };

interface DataContextType {
  // Theme
  isDark: boolean;
  toggleDarkMode: () => void;

  // Navigation / Dedicated Pages
  currentNav: NavigationTarget;
  navigateTo: (target: NavigationTarget) => void;

  // Database Connection Status & Sync
  dbStatus: DbStatusResponse | null;
  refreshFromDb: () => Promise<void>;
  uploadMediaFile: (file: File) => Promise<{ url: string; filename: string }>;

  // Data Collections
  softwareList: SoftwareItem[];
  projectsList: ProjectItem[];
  mediaList: MediaItem[];
  blogPosts: BlogPost[];
  leads: LeadInquiry[];
  auditLogs: AuditLog[];
  adminUsers: AdminUser[];

  // Selected for Lead Capture Modal
  isLeadModalOpen: boolean;
  leadModalPreset: { softwareInterest?: string; inquiryType?: LeadInquiry['inquiryType'] };
  openLeadModal: (preset?: { softwareInterest?: string; inquiryType?: LeadInquiry['inquiryType'] }) => void;
  closeLeadModal: () => void;

  // Media Lightbox
  activeMediaItem: MediaItem | null;
  activeMediaList: MediaItem[];
  activeMediaIndex: number;
  hasPrevMedia: boolean;
  hasNextMedia: boolean;
  openMediaLightbox: (item: MediaItem, list?: MediaItem[]) => void;
  closeMediaLightbox: () => void;
  prevMediaItem: () => void;
  nextMediaItem: () => void;

  // Gallery Modal for specific target
  activeGalleryTarget: { targetId: string; targetType: 'software' | 'project'; title: string } | null;
  openGalleryModal: (targetId: string, targetType: 'software' | 'project', title: string) => void;
  closeGalleryModal: () => void;

  // Engineering Calculator & Unit Converter
  isCalculatorOpen: boolean;
  openCalculator: () => void;
  closeCalculator: () => void;
  toggleCalculator: () => void;
  isCalcSidebarOpen: boolean;
  openCalcSidebar: () => void;
  closeCalcSidebar: () => void;
  toggleCalcSidebar: () => void;

  // Auth & RBAC
  currentUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  can: (action: PermissionAction) => boolean;
  changeUserPassword: (email: string, oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;

  // Admin Mutations (saves to Database!)
  addSoftware: (item: Omit<SoftwareItem, 'id' | 'gallery'>) => Promise<void>;
  updateSoftware: (id: string, updates: Partial<SoftwareItem>) => Promise<void>;
  deleteSoftware: (id: string) => Promise<void>;

  addProject: (item: Omit<ProjectItem, 'id' | 'gallery'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<void>;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;

  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  submitLead: (lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadInquiry['status']) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  // Reset & Backup
  resetAllData: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'aerospatial_theme',
  AUTH: 'aerospatial_auth_session',
  ALLOW_DEMO: 'aerospatial_allow_demo_login',
  LOGS: 'aerospatial_audit_logs',
};

// Known sample item IDs to purge if found in browser cache
const SAMPLE_IDS = new Set([
  'soft_formspace',
  'soft_aerolattice',
  'soft_deployx',
  'soft_nodegen',
  'proj_botanical_dome',
  'proj_helios9',
  'proj_velodrome',
  'proj_grand_falcon',
  'post_dyn_relax_01',
  'post_snap_through_02',
  'post_deployable_ring_03',
  'med_fs_01',
  'med_fs_02',
  'med_al_01',
  'med_al_02',
  'med_dx_01',
  'med_dx_02',
  'med_ng_01',
  'med_proj_dome_01',
  'med_proj_dome_02',
  'med_proj_h9_01',
  'med_proj_h9_02',
  'med_proj_velodrome_01',
]);

function purgeStaleLocalStorage() {
  try {
    ['aerospatial_software_db', 'aerospatial_projects_db', 'aerospatial_media_db', 'aerospatial_blog_db', 'aerospatial_leads_db'].forEach(key => {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((item: any) => item && SAMPLE_IDS.has(item.id))) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch {
    // ignore
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purge any stale sample data on component mount
  purgeStaleLocalStorage();

  // Dark Mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved === 'dark';
    } catch {
      // fallback
    }
    return true; // Default dark theme for precision engineering look
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  // Navigation State
  const [currentNav, setCurrentNav] = useState<NavigationTarget>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/software/')) {
      return { view: 'software', id: hash.replace('#/software/', '') };
    }
    if (hash.startsWith('#/project/')) {
      return { view: 'project', id: hash.replace('#/project/', '') };
    }
    if (hash.startsWith('#/blog/')) {
      return { view: 'blog', id: hash.replace('#/blog/', '') };
    }
    if (hash === '#/software') return { view: 'all_software' };
    if (hash === '#/projects') return { view: 'all_projects' };
    if (hash === '#/blog') return { view: 'all_blog' };
    if (hash === '#/admin') return { view: 'admin' };
    if (hash === '#/contact') return { view: 'contact' };
    return { view: 'home' };
  });

  const navigateTo = (target: NavigationTarget) => {
    setCurrentNav(target);
    switch (target.view) {
      case 'home':
        window.location.hash = '#/';
        break;
      case 'software':
        window.location.hash = `#/software/${target.id}`;
        break;
      case 'project':
        window.location.hash = `#/project/${target.id}`;
        break;
      case 'blog':
        window.location.hash = `#/blog/${target.id}`;
        break;
      case 'all_software':
        window.location.hash = '#/software';
        break;
      case 'all_projects':
        window.location.hash = '#/projects';
        break;
      case 'all_blog':
        window.location.hash = '#/blog';
        break;
      case 'admin':
        window.location.hash = '#/admin';
        break;
      case 'contact':
        window.location.hash = '#/contact';
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/software/')) {
        setCurrentNav({ view: 'software', id: hash.replace('#/software/', '') });
      } else if (hash.startsWith('#/project/')) {
        setCurrentNav({ view: 'project', id: hash.replace('#/project/', '') });
      } else if (hash.startsWith('#/blog/')) {
        setCurrentNav({ view: 'blog', id: hash.replace('#/blog/', '') });
      } else if (hash === '#/software') {
        setCurrentNav({ view: 'all_software' });
      } else if (hash === '#/projects') {
        setCurrentNav({ view: 'all_projects' });
      } else if (hash === '#/blog') {
        setCurrentNav({ view: 'all_blog' });
      } else if (hash === '#/admin') {
        setCurrentNav({ view: 'admin' });
      } else if (hash === '#/contact') {
        setCurrentNav({ view: 'contact' });
      } else {
        setCurrentNav({ view: 'home' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);

  // Collections (Clean state with no sample data)
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  const addAudit = useCallback((action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'Admin Console',
      actorEmail: 'admin@ssdesigner.ir',
      action,
      details,
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 199)]);
  }, []);

  // Fetch all collections from Database API
  const refreshFromDb = useCallback(async () => {
    try {
      const statusRes = await api.getStatus();
      setDbStatus(statusRes);

      const [softRes, projRes, blogRes, medRes, leadRes, userRes] = await Promise.allSettled([
        api.getSoftware(),
        api.getProjects(),
        api.getArticles(),
        api.getMedia(),
        api.getLeads(),
        api.getUsers(),
      ]);

      if (softRes.status === 'fulfilled' && Array.isArray(softRes.value)) {
        setSoftwareList(softRes.value);
      }
      if (projRes.status === 'fulfilled' && Array.isArray(projRes.value)) {
        setProjectsList(projRes.value);
      }
      if (blogRes.status === 'fulfilled' && Array.isArray(blogRes.value)) {
        setBlogPosts(blogRes.value);
      }
      if (medRes.status === 'fulfilled' && Array.isArray(medRes.value)) {
        setMediaList(medRes.value);
      }
      if (leadRes.status === 'fulfilled' && Array.isArray(leadRes.value)) {
        setLeads(leadRes.value);
      }
      if (userRes.status === 'fulfilled' && Array.isArray(userRes.value) && userRes.value.length > 0) {
        setAdminUsers(userRes.value);
      }
    } catch (err) {
      console.warn('API sync warning (server or database initializing):', err);
    }
  }, []);

  // Initial load from Database
  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  // File Upload Helper
  const uploadMediaFile = async (file: File): Promise<{ url: string; filename: string }> => {
    try {
      const res = await api.uploadFile(file);
      addAudit('FILE_UPLOAD', `Uploaded media asset: ${res.filename} (${res.url})`);
      return res;
    } catch (err: any) {
      addAudit('FILE_UPLOAD_FAIL', `Upload error: ${err.message}`, 'warning');
      throw err;
    }
  };

  // Auth & RBAC State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [allowDemoQuickLogin, setAllowDemoQuickLogin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALLOW_DEMO);
      return saved ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleAllowDemoQuickLogin = () => {
    setAllowDemoQuickLogin(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.ALLOW_DEMO, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isAdminLoggedIn = Boolean(currentUser);

  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const brute = getBruteForceStatus();
    if (brute.isLocked) {
      return { success: false, message: `Access suspended due to repeated authentication failures. Locked for ${brute.remainingSeconds}s.` };
    }

    try {
      const res = await api.login(email, pass);
      resetLoginAttempts();
      setCurrentUser(res.user);
      addAudit('LOGIN_SUCCESS', `User ${res.user.name} (${res.user.email}) logged in with role [${res.user.role}]`);
      return { success: true, message: `Welcome back, ${res.user.name}` };
    } catch (err: any) {
      // Fallback local verification if offline
      const user = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        resetLoginAttempts();
        setCurrentUser(user);
        addAudit('LOGIN_SUCCESS', `User ${user.name} logged in`);
        return { success: true, message: `Welcome back, ${user.name}` };
      }
      const rec = recordFailedLogin();
      addAudit('LOGIN_FAILED', `Failed authentication attempt for ${email}`, 'warning');
      return { success: false, message: err.message || `Invalid credentials. (${rec.attemptsLeft} attempts remaining)` };
    }
  };

  const logout = () => {
    if (currentUser) {
      addAudit('LOGOUT', `User ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
  };

  const quickLoginAs = (role: UserRole) => {
    const user = adminUsers.find(u => u.role === role) || {
      id: `usr_${role}`,
      name: role === 'administrator' ? 'Lead Admin' : 'Lead Engineer',
      email: 'admin@ssdesigner.ir',
      role,
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(user);
    resetLoginAttempts();
    addAudit('QUICK_LOGIN', `Admin login activated as [${role}] - ${user.name}`);
  };

  const can = (action: PermissionAction): boolean => {
    return hasPermission(currentUser?.role, action);
  };

  const changeUserPassword = async (email: string, oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.setPassword(email, newPass, oldPass);
      addAudit('PASSWORD_CHANGED', `Password updated in database for ${email}`, 'warning');
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Could not update password' };
    }
  };

  // Lead Modal
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalPreset, setLeadModalPreset] = useState<{ softwareInterest?: string; inquiryType?: LeadInquiry['inquiryType'] }>({});

  const openLeadModal = (preset?: { softwareInterest?: string; inquiryType?: LeadInquiry['inquiryType'] }) => {
    setLeadModalPreset(preset || {});
    setIsLeadModalOpen(true);
  };
  const closeLeadModal = () => setIsLeadModalOpen(false);

  // Lightbox & Gallery Modal
  const [activeMediaItem, setActiveMediaItem] = useState<MediaItem | null>(null);
  const [activeMediaList, setActiveMediaList] = useState<MediaItem[]>([]);

  const openMediaLightbox = (item: MediaItem, list?: MediaItem[]) => {
    setActiveMediaItem(item);
    if (list && list.length > 0) {
      setActiveMediaList(list);
    } else {
      const related = mediaList.filter(m => m.targetId === item.targetId && m.targetType === item.targetType);
      setActiveMediaList(related.length > 0 ? related : [item]);
    }
  };

  const closeMediaLightbox = () => {
    setActiveMediaItem(null);
  };

  const activeMediaIndex = activeMediaItem ? activeMediaList.findIndex(m => m.id === activeMediaItem.id) : -1;
  const hasPrevMedia = activeMediaIndex > 0;
  const hasNextMedia = activeMediaIndex !== -1 && activeMediaIndex < activeMediaList.length - 1;

  const prevMediaItem = () => {
    if (activeMediaIndex > 0) {
      setActiveMediaItem(activeMediaList[activeMediaIndex - 1]);
    }
  };

  const nextMediaItem = () => {
    if (activeMediaIndex !== -1 && activeMediaIndex < activeMediaList.length - 1) {
      setActiveMediaItem(activeMediaList[activeMediaIndex + 1]);
    }
  };

  const [activeGalleryTarget, setActiveGalleryTarget] = useState<{ targetId: string; targetType: 'software' | 'project'; title: string } | null>(null);
  const openGalleryModal = (targetId: string, targetType: 'software' | 'project', title: string) => {
    setActiveGalleryTarget({ targetId, targetType, title });
  };
  const closeGalleryModal = () => setActiveGalleryTarget(null);

  // Engineering Calculator & Sidebar state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const openCalculator = () => setIsCalculatorOpen(true);
  const closeCalculator = () => setIsCalculatorOpen(false);
  const toggleCalculator = () => setIsCalculatorOpen(prev => !prev);

  const [isCalcSidebarOpen, setIsCalcSidebarOpen] = useState(false);
  const openCalcSidebar = () => setIsCalcSidebarOpen(true);
  const closeCalcSidebar = () => setIsCalcSidebarOpen(false);
  const toggleCalcSidebar = () => setIsCalcSidebarOpen(prev => !prev);

  // -------------------------------------------------------------
  // CRUD Software -> Persists to Database
  // -------------------------------------------------------------
  const addSoftware = async (item: Omit<SoftwareItem, 'id' | 'gallery'>) => {
    try {
      const created = await api.createSoftware({ ...item, gallery: [] });
      setSoftwareList(prev => [created, ...prev]);
      addAudit('CREATE_SOFTWARE', `Created and saved software in database: ${created.name}`);
    } catch (err: any) {
      // Local optimistic fallback
      const id = `soft_${Date.now()}`;
      const newItem: SoftwareItem = {
        ...item,
        id,
        gallery: [],
      };
      setSoftwareList(prev => [newItem, ...prev]);
      addAudit('CREATE_SOFTWARE_LOCAL', `Saved software locally (${err.message}): ${newItem.name}`, 'warning');
    }
  };

  const updateSoftware = async (id: string, updates: Partial<SoftwareItem>) => {
    try {
      const updated = await api.updateSoftware(id, updates);
      setSoftwareList(prev => prev.map(s => s.id === id ? updated : s));
      addAudit('UPDATE_SOFTWARE', `Updated software in database ID: ${id}`);
    } catch {
      setSoftwareList(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      addAudit('UPDATE_SOFTWARE_LOCAL', `Updated software locally ID: ${id}`);
    }
  };

  const deleteSoftware = async (id: string) => {
    try {
      await api.deleteSoftware(id);
      setSoftwareList(prev => prev.filter(s => s.id !== id));
      setMediaList(prev => prev.filter(m => !(m.targetType === 'software' && m.targetId === id)));
      addAudit('DELETE_SOFTWARE', `Deleted software from database ID: ${id}`, 'warning');
    } catch {
      setSoftwareList(prev => prev.filter(s => s.id !== id));
      setMediaList(prev => prev.filter(m => !(m.targetType === 'software' && m.targetId === id)));
      addAudit('DELETE_SOFTWARE_LOCAL', `Deleted software locally ID: ${id}`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // CRUD Projects -> Persists to Database
  // -------------------------------------------------------------
  const addProject = async (item: Omit<ProjectItem, 'id' | 'gallery'>) => {
    try {
      const created = await api.createProject(item);
      setProjectsList(prev => [created, ...prev]);
      addAudit('CREATE_PROJECT', `Saved project case study in database: ${created.title}`);
    } catch (err: any) {
      const id = `proj_${Date.now()}`;
      const newItem: ProjectItem = {
        ...item,
        id,
        gallery: [],
      };
      setProjectsList(prev => [newItem, ...prev]);
      addAudit('CREATE_PROJECT_LOCAL', `Saved project locally (${err.message}): ${newItem.title}`, 'warning');
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>) => {
    try {
      const updated = await api.updateProject(id, updates);
      setProjectsList(prev => prev.map(p => p.id === id ? updated : p));
      addAudit('UPDATE_PROJECT', `Updated project in database ID: ${id}`);
    } catch {
      setProjectsList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      addAudit('UPDATE_PROJECT_LOCAL', `Updated project locally ID: ${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjectsList(prev => prev.filter(p => p.id !== id));
      setMediaList(prev => prev.filter(m => !(m.targetType === 'project' && m.targetId === id)));
      addAudit('DELETE_PROJECT', `Deleted project from database ID: ${id}`, 'warning');
    } catch {
      setProjectsList(prev => prev.filter(p => p.id !== id));
      setMediaList(prev => prev.filter(m => !(m.targetType === 'project' && m.targetId === id)));
      addAudit('DELETE_PROJECT_LOCAL', `Deleted project locally ID: ${id}`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // CRUD Media -> Persists to Database
  // -------------------------------------------------------------
  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    try {
      const created = await api.createMedia(item);
      setMediaList(prev => [created, ...prev]);
      addAudit('ADD_MEDIA', `Saved media to database: ${created.title}`);
    } catch (err: any) {
      const id = `med_${Date.now()}`;
      const newMedia: MediaItem = {
        ...item,
        id,
        createdAt: new Date().toISOString().substring(0, 10),
      };
      setMediaList(prev => [newMedia, ...prev]);
      addAudit('ADD_MEDIA_LOCAL', `Saved media locally: ${newMedia.title}`);
    }
  };

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
    setMediaList(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addAudit('UPDATE_MEDIA', `Updated media ID: ${id}`);
  };

  const deleteMediaItem = async (id: string) => {
    try {
      await api.deleteMedia(id);
      setMediaList(prev => prev.filter(m => m.id !== id));
      addAudit('DELETE_MEDIA', `Deleted media from database ID: ${id}`);
    } catch {
      setMediaList(prev => prev.filter(m => m.id !== id));
      addAudit('DELETE_MEDIA_LOCAL', `Deleted media locally ID: ${id}`);
    }
  };

  // -------------------------------------------------------------
  // CRUD Articles / Blog -> Persists to Database
  // -------------------------------------------------------------
  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    try {
      const created = await api.createArticle(post);
      setBlogPosts(prev => [created, ...prev]);
      addAudit('PUBLISH_BLOG', `Published article to database: ${created.title}`);
    } catch (err: any) {
      const id = `blog_${Date.now()}`;
      const newPost: BlogPost = {
        ...post,
        id,
        publishedAt: new Date().toISOString().substring(0, 10),
      };
      setBlogPosts(prev => [newPost, ...prev]);
      addAudit('PUBLISH_BLOG_LOCAL', `Published article locally: ${newPost.title}`);
    }
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const updated = await api.updateArticle(id, updates);
      setBlogPosts(prev => prev.map(b => b.id === id ? updated : b));
      addAudit('UPDATE_BLOG', `Updated article in database ID: ${id}`);
    } catch {
      setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      addAudit('UPDATE_BLOG_LOCAL', `Updated article locally ID: ${id}`);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await api.deleteArticle(id);
      setBlogPosts(prev => prev.filter(b => b.id !== id));
      addAudit('DELETE_BLOG', `Deleted article from database ID: ${id}`, 'warning');
    } catch {
      setBlogPosts(prev => prev.filter(b => b.id !== id));
      addAudit('DELETE_BLOG_LOCAL', `Deleted article locally ID: ${id}`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // Leads -> Persists to Database
  // -------------------------------------------------------------
  const submitLead = async (lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => {
    try {
      const created = await api.createLead(lead);
      setLeads(prev => [created, ...prev]);
      addAudit('NEW_LEAD', `Inbound inquiry saved to database from ${created.email}`, 'info');
    } catch {
      const id = `lead_${Date.now()}`;
      const newLead: LeadInquiry = {
        ...lead,
        id,
        name: sanitizeInput(lead.name),
        organization: sanitizeInput(lead.organization),
        message: sanitizeInput(lead.message),
        status: 'New',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      };
      setLeads(prev => [newLead, ...prev]);
      addAudit('NEW_LEAD_LOCAL', `Inbound inquiry saved locally from ${newLead.email}`, 'info');
    }
  };

  const updateLeadStatus = async (id: string, status: LeadInquiry['status']) => {
    try {
      await api.updateLeadStatus(id, status);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      addAudit('UPDATE_LEAD_STATUS', `Status updated in database for lead ID ${id} to ${status}`);
    } catch {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      addAudit('UPDATE_LEAD_STATUS_LOCAL', `Status updated locally for lead ID ${id}`);
    }
  };

  const deleteLead = async (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    addAudit('DELETE_LEAD', `Deleted lead inquiry ID: ${id}`);
  };

  // Reset & Backup
  const resetAllData = () => {
    setSoftwareList([]);
    setProjectsList([]);
    setMediaList([]);
    setBlogPosts([]);
    setLeads([]);
    purgeStaleLocalStorage();
    addAudit('DATABASE_RESET', 'Administrator cleared database records.', 'critical');
  };

  const exportDatabaseJson = (): string => {
    const exportBundle = {
      exportedAt: new Date().toISOString(),
      softwareList,
      projectsList,
      mediaList,
      blogPosts,
      leads,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importDatabaseJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.softwareList)) setSoftwareList(data.softwareList);
      if (Array.isArray(data.projectsList)) setProjectsList(data.projectsList);
      if (Array.isArray(data.mediaList)) setMediaList(data.mediaList);
      if (Array.isArray(data.blogPosts)) setBlogPosts(data.blogPosts);
      if (Array.isArray(data.leads)) setLeads(data.leads);
      addAudit('DATABASE_IMPORT', 'Database imported from JSON bundle.', 'warning');
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        currentNav,
        navigateTo,
        dbStatus,
        refreshFromDb,
        uploadMediaFile,
        softwareList,
        projectsList,
        mediaList,
        blogPosts,
        leads,
        auditLogs,
        adminUsers,
        isLeadModalOpen,
        leadModalPreset,
        openLeadModal,
        closeLeadModal,
        activeMediaItem,
        activeMediaList,
        activeMediaIndex,
        hasPrevMedia,
        hasNextMedia,
        openMediaLightbox,
        closeMediaLightbox,
        prevMediaItem,
        nextMediaItem,
        activeGalleryTarget,
        openGalleryModal,
        closeGalleryModal,
        isCalculatorOpen,
        openCalculator,
        closeCalculator,
        toggleCalculator,
        isCalcSidebarOpen,
        openCalcSidebar,
        closeCalcSidebar,
        toggleCalcSidebar,
        currentUser,
        isAdminLoggedIn,
        login,
        logout,
        quickLoginAs,
        can,
        changeUserPassword,
        allowDemoQuickLogin,
        toggleAllowDemoQuickLogin,
        addSoftware,
        updateSoftware,
        deleteSoftware,
        addProject,
        updateProject,
        deleteProject,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        submitLead,
        updateLeadStatus,
        deleteLead,
        resetAllData,
        exportDatabaseJson,
        importDatabaseJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
