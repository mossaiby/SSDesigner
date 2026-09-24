import { SoftwareItem, ProjectItem, BlogPost, LeadInquiry, MediaItem, AdminUser, AuditLog } from '../types';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr_admin_master',
    name: 'System Administrator',
    email: 'admin@ssdesigner.ir',
    role: 'administrator',
    lastLogin: 'Pending Initial Login',
  },
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [];

export const INITIAL_SOFTWARE_ITEMS: SoftwareItem[] = [];

export const INITIAL_PROJECT_ITEMS: ProjectItem[] = [];

export const INITIAL_BLOG_POSTS: BlogPost[] = [];

export const INITIAL_LEADS: LeadInquiry[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
