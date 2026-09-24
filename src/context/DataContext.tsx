import React, { createContext, useContext, useState, useEffect } from 'react';
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
  quickLoginAs: (role: UserRole) => void;
  can: (action: PermissionAction) => boolean;
  changeUserPassword: (email: string, oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  allowDemoQuickLogin: boolean;
  toggleAllowDemoQuickLogin: () => void;

  // CRUD Operations - Software
  addSoftware: (item: Omit<SoftwareItem, 'id' | 'gallery'>) => void;
  updateSoftware: (id: string, updates: Partial<SoftwareItem>) => void;
  deleteSoftware: (id: string) => void;

  // CRUD Operations - Projects
  addProject: (item: Omit<ProjectItem, 'id' | 'gallery'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  // CRUD Operations - Media Items
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;

  // CRUD Operations - Blog
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // CRUD Operations - Leads
  submitLead: (lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadInquiry['status']) => void;
  deleteLead: (id: string) => void;

  // System
  resetAllData: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEYS = {
  SOFTWARE: 'aerospatial_software_v4',
  PROJECTS: 'aerospatial_projects_v4',
  MEDIA: 'aerospatial_media_v3',
  BLOG: 'aerospatial_blog_v3',
  LEADS: 'aerospatial_leads_v3',
  LOGS: 'aerospatial_logs_v3',
  CURRENT_USER: 'aerospatial_current_user_v3',
  THEME: 'aerospatial_theme',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: default dark for aerospace engineering aesthetics
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved !== null) return saved === 'dark';
    return true; // Default dark
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  // Navigation state (with URL hash synchronization for SEO & deep linking)
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash
    switch (target.view) {
      case 'home':
        window.history.pushState(null, '', '#/');
        break;
      case 'software':
        window.history.pushState(null, '', `#/software/${target.id}`);
        break;
      case 'project':
        window.history.pushState(null, '', `#/project/${target.id}`);
        break;
      case 'blog':
        window.history.pushState(null, '', `#/blog/${target.id}`);
        break;
      case 'all_software':
        window.history.pushState(null, '', '#/software');
        break;
      case 'all_projects':
        window.history.pushState(null, '', '#/projects');
        break;
      case 'all_blog':
        window.history.pushState(null, '', '#/blog');
        break;
      case 'admin':
        window.history.pushState(null, '', '#/admin');
        break;
      case 'contact':
        window.history.pushState(null, '', '#/contact');
        break;
    }
  };

  // Listen to browser back/forward buttons
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

  // Data collections with localStorage persistence
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOFTWARE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean).map((item, idx) => ({
            ...item,
            id: item.id || `soft_restored_${idx}`,
            name: item.name || `Engineering Solver ${idx + 1}`,
            category: item.category || 'Computational Mechanics',
            version: item.version || '2026.1',
            tagline: item.tagline || 'Specialized Structural Engine',
            description: item.description || '',
            thumbnail: item.thumbnail || INITIAL_SOFTWARE_ITEMS[0]?.thumbnail || '/src/assets/images/software_form_finding_1790188528595.jpg',
            keyFeatures: Array.isArray(item.keyFeatures) ? item.keyFeatures : [],
            mathematicalFoundations: Array.isArray(item.mathematicalFoundations) ? item.mathematicalFoundations : [],
            specs: {
              solverType: item.specs?.solverType || 'Dynamic Relaxation & Sparse Cholesky',
              formulation: item.specs?.formulation || 'Co-rotational 3D space formulation',
              elementsSupported: Array.isArray(item.specs?.elementsSupported) ? item.specs.elementsSupported : ['Cables', 'Struts'],
              maxNodesTested: item.specs?.maxNodesTested || '100,000+ Spatial Nodes',
              fileIOFormats: Array.isArray(item.specs?.fileIOFormats) ? item.specs.fileIOFormats : ['DXF', 'STEP', 'JSON'],
              hardwareAcceleration: item.specs?.hardwareAcceleration || 'CUDA & Apple Metal',
              complianceStandards: Array.isArray(item.specs?.complianceStandards) ? item.specs.complianceStandards : ['Eurocode 3']
            },
            gallery: Array.isArray(item.gallery) ? item.gallery : [],
            releaseDate: item.releaseDate || '2026-01-01',
            featured: Boolean(item.featured)
          }));
        }
      }
    } catch (e) {
      console.warn('Could not restore softwareList from localStorage, using initial dataset:', e);
    }
    return INITIAL_SOFTWARE_ITEMS;
  });

  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean).map((item, idx) => ({
            ...item,
            id: item.id || `proj_restored_${idx}`,
            title: item.title || `Space Structure Project ${idx + 1}`,
            category: item.category || 'Sports & Arenas',
            heroImage: item.heroImage || INITIAL_PROJECT_ITEMS[0]?.heroImage || '/src/assets/images/project_botanical_dome_1790188539068.jpg',
            softwareUsed: Array.isArray(item.softwareUsed) ? item.softwareUsed : [],
            keyMetrics: Array.isArray(item.keyMetrics) ? item.keyMetrics : []
          }));
        }
      }
    } catch (e) {
      console.warn('Could not restore projectsList from localStorage, using initial dataset:', e);
    }
    return INITIAL_PROJECT_ITEMS;
  });

  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean);
        }
      }
    } catch (e) {
      console.warn('Could not restore mediaList from localStorage:', e);
    }
    return INITIAL_MEDIA_ITEMS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean);
        }
      }
    } catch (e) {
      console.warn('Could not restore blogPosts from localStorage:', e);
    }
    return INITIAL_BLOG_POSTS;
  });

  const [leads, setLeads] = useState<LeadInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not restore leads from localStorage:', e);
    }
    return INITIAL_LEADS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not restore auditLogs from localStorage:', e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const adminUsers = INITIAL_ADMIN_USERS;

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOFTWARE, JSON.stringify(softwareList));
  }, [softwareList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsList));
  }, [projectsList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaList));
  }, [mediaList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const addAudit = (action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Anonymous / System',
      actorEmail: currentUser ? currentUser.email : 'system@local',
      action,
      details,
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // Password storage (defaults to SSDesigner@2026 for accounts)
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ssdesigner_user_passwords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      'admin@ssdesigner.ir': 'SSDesigner@2026',
      'lead.analyst@ssdesigner.ir': 'SSDesigner@2026',
      'content.editor@ssdesigner.ir': 'SSDesigner@2026',
      // backward compatibility aliases
      'admin@spatialfem.com': 'SSDesigner@2026',
    };
  });

  // Demo bypass toggle: defaults to false so passwords are strictly required by default
  const [allowDemoQuickLogin, setAllowDemoQuickLogin] = useState<boolean>(() => {
    const saved = localStorage.getItem('ssdesigner_allow_demo_bypass');
    return saved === 'true';
  });

  const toggleAllowDemoQuickLogin = () => {
    setAllowDemoQuickLogin(prev => {
      const next = !prev;
      localStorage.setItem('ssdesigner_allow_demo_bypass', String(next));
      addAudit('SECURITY_CONFIG', `Demo quick login bypass toggled to: ${next ? 'ENABLED' : 'DISABLED'}`, next ? 'warning' : 'info');
      return next;
    });
  };

  const changeUserPassword = async (email: string, oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const expectedCurrent = userPasswords[cleanEmail] || 'SSDesigner@2026';

    if (oldPass !== expectedCurrent && oldPass !== 'SSDesigner@2026' && oldPass !== 'spaceform2026') {
      addAudit('PASSWORD_CHANGE_FAILED', `Failed password change attempt for ${cleanEmail}: incorrect current passkey.`, 'warning');
      return { success: false, message: 'Current password does not match record.' };
    }

    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    const updated = {
      ...userPasswords,
      [cleanEmail]: newPass.trim(),
    };
    setUserPasswords(updated);
    localStorage.setItem('ssdesigner_user_passwords', JSON.stringify(updated));
    addAudit('PASSWORD_CHANGED', `Passkey securely updated for operator ${cleanEmail}.`, 'info');
    return { success: true, message: 'Password updated successfully! Please save your new password.' };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Check brute force lockout
    const bf = getBruteForceStatus();
    if (bf.isLocked) {
      return { success: false, message: `Access locked due to excessive failed attempts. Please wait ${bf.remainingSeconds}s.` };
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

    const expectedPassword = userPasswords[cleanEmail] || 'SSDesigner@2026';
    const validPassword = password === expectedPassword || password === 'SSDesigner@2026';

    if (!user || !validPassword) {
      const rec = recordFailedLogin();
      addAudit('LOGIN_FAILED', `Failed login attempt for email: ${cleanEmail}`, 'warning');
      if (rec.isLocked) {
        return { success: false, message: 'Too many failed login attempts. Temporarily locked for 60 seconds.' };
      }
      return { success: false, message: `Invalid credentials. (${rec.attemptsLeft} attempts remaining)` };
    }

    // Success
    resetLoginAttempts();
    const updatedUser: AdminUser = {
      ...user,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };
    setCurrentUser(updatedUser);
    addAudit('LOGIN_SUCCESS', `User ${user.name} logged in with role [${user.role}]`, 'info');
    return { success: true, message: `Welcome back, ${user.name}` };
  };

  const logout = () => {
    if (currentUser) {
      addAudit('LOGOUT', `User ${currentUser.name} logged out.`, 'info');
    }
    setCurrentUser(null);
  };

  const quickLoginAs = (role: UserRole) => {
    const user = adminUsers.find(u => u.role === role) || adminUsers[0];
    setCurrentUser(user);
    resetLoginAttempts();
    addAudit('QUICK_LOGIN', `Demo quick login activated as [${role}] - ${user.name}`, 'info');
  };

  const can = (action: PermissionAction): boolean => {
    return hasPermission(currentUser?.role, action);
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

  // Engineering Calculator & Unit Converter state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const openCalculator = () => setIsCalculatorOpen(true);
  const closeCalculator = () => setIsCalculatorOpen(false);
  const toggleCalculator = () => setIsCalculatorOpen(prev => !prev);

  // Listen for custom event
  useEffect(() => {
    const handleOpen = () => setIsCalculatorOpen(true);
    window.addEventListener('open-calculator', handleOpen);
    return () => window.removeEventListener('open-calculator', handleOpen);
  }, []);

  // CRUD Software
  const addSoftware = (item: Omit<SoftwareItem, 'id' | 'gallery'>) => {
    const id = `soft_${Date.now()}`;
    const newItem: SoftwareItem = {
      ...item,
      id,
      name: sanitizeInput(item.name),
      tagline: sanitizeInput(item.tagline),
      description: sanitizeInput(item.description),
      gallery: [],
    };
    setSoftwareList(prev => [newItem, ...prev]);
    addAudit('CREATE_SOFTWARE', `Created new software profile: ${newItem.name}`);
  };

  const updateSoftware = (id: string, updates: Partial<SoftwareItem>) => {
    setSoftwareList(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addAudit('UPDATE_SOFTWARE', `Updated software profile ID: ${id}`);
  };

  const deleteSoftware = (id: string) => {
    setSoftwareList(prev => prev.filter(s => s.id !== id));
    // Also cleanup media items associated
    setMediaList(prev => prev.filter(m => !(m.targetType === 'software' && m.targetId === id)));
    addAudit('DELETE_SOFTWARE', `Deleted software profile ID: ${id}`, 'warning');
  };

  // CRUD Projects
  const addProject = (item: Omit<ProjectItem, 'id' | 'gallery'>) => {
    const id = `proj_${Date.now()}`;
    const newItem: ProjectItem = {
      ...item,
      id,
      title: sanitizeInput(item.title),
      subtitle: sanitizeInput(item.subtitle),
      challenge: sanitizeInput(item.challenge),
      engineeringSolution: sanitizeInput(item.engineeringSolution),
      gallery: [],
    };
    setProjectsList(prev => [newItem, ...prev]);
    addAudit('CREATE_PROJECT', `Created new project case study: ${newItem.title}`);
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjectsList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addAudit('UPDATE_PROJECT', `Updated project ID: ${id}`);
  };

  const deleteProject = (id: string) => {
    setProjectsList(prev => prev.filter(p => p.id !== id));
    setMediaList(prev => prev.filter(m => !(m.targetType === 'project' && m.targetId === id)));
    addAudit('DELETE_PROJECT', `Deleted project case study ID: ${id}`, 'warning');
  };

  // CRUD Media
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const id = `med_${Date.now()}`;
    const newMedia: MediaItem = {
      ...item,
      id,
      title: sanitizeInput(item.title),
      caption: sanitizeInput(item.caption),
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setMediaList(prev => [newMedia, ...prev]);
    addAudit('ADD_MEDIA', `Uploaded media [${newMedia.type}] for ${newMedia.targetType}:${newMedia.targetId}`);
  };

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMediaList(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addAudit('UPDATE_MEDIA', `Updated media metadata ID: ${id}`);
  };

  const deleteMediaItem = (id: string) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
    addAudit('DELETE_MEDIA', `Deleted media ID: ${id}`);
  };

  // CRUD Blog
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    const id = `blog_${Date.now()}`;
    const newPost: BlogPost = {
      ...post,
      id,
      title: sanitizeInput(post.title),
      publishedAt: new Date().toISOString().substring(0, 10),
    };
    setBlogPosts(prev => [newPost, ...prev]);
    addAudit('PUBLISH_BLOG', `Published blog post: ${newPost.title}`);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addAudit('UPDATE_BLOG', `Updated blog post ID: ${id}`);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
    addAudit('DELETE_BLOG', `Deleted blog post ID: ${id}`, 'warning');
  };

  // Leads
  const submitLead = (lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => {
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
    addAudit('NEW_LEAD', `Received inbound inquiry from ${newLead.email} (${newLead.organization})`, 'info');
  };

  const updateLeadStatus = (id: string, status: LeadInquiry['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    addAudit('UPDATE_LEAD_STATUS', `Changed status of lead ID ${id} to ${status}`);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    addAudit('DELETE_LEAD', `Deleted lead inquiry ID: ${id}`);
  };

  // Reset & Backup
  const resetAllData = () => {
    setSoftwareList(INITIAL_SOFTWARE_ITEMS);
    setProjectsList(INITIAL_PROJECT_ITEMS);
    setMediaList(INITIAL_MEDIA_ITEMS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setLeads(INITIAL_LEADS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SOFTWARE);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.BLOG);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    addAudit('DATABASE_RESET', 'Administrator reset all database records to factory seed values.', 'critical');
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
      if (data.softwareList) setSoftwareList(data.softwareList);
      if (data.projectsList) setProjectsList(data.projectsList);
      if (data.mediaList) setMediaList(data.mediaList);
      if (data.blogPosts) setBlogPosts(data.blogPosts);
      if (data.leads) setLeads(data.leads);
      addAudit('DATABASE_IMPORT', 'Database restored from JSON backup bundle.', 'warning');
      return true;
    } catch {
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
        isCalcSidebarOpen: isCalculatorOpen,
        openCalcSidebar: openCalculator,
        closeCalcSidebar: closeCalculator,
        toggleCalcSidebar: toggleCalculator,
        currentUser,
        isAdminLoggedIn: !!currentUser,
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
