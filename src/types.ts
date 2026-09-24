export type UserRole = 'administrator' | 'lead_engineer' | 'editor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin: string;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  caption: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  technicalNote?: string;
  targetId: string; // ID of software or project
  targetType: 'software' | 'project';
  createdAt: string;
  tags?: string[];
  dimensions?: string;
}

export interface SoftwareSpecs {
  solverType: string;
  formulation: string;
  elementsSupported: string[];
  maxNodesTested: string;
  fileIOFormats: string[];
  hardwareAcceleration: string;
  complianceStandards: string[];
}

export interface SoftwareItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  version: string;
  description: string;
  keyFeatures: string[];
  mathematicalFoundations: string[];
  specs: SoftwareSpecs;
  thumbnail: string;
  gallery: MediaItem[];
  releaseDate: string;
  featured: boolean;
}

export interface ProjectMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  year: number;
  span: string;
  structuralSystem: string;
  nodeCount: string;
  memberCount: string;
  steelWeightSaved: string;
  clientOrEngineer: string;
  softwareUsed: string[];
  challenge: string;
  engineeringSolution: string;
  heroImage: string;
  gallery: MediaItem[];
  keyMetrics: ProjectMetric[];
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
}

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  inquiryType: 'Software Demo' | 'Commercial Quotation' | 'Academic License' | 'Consulting / Engineering Partnership';
  softwareInterest: string;
  projectScope?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Archived';
  createdAt: string;
}

export type { PermissionAction } from './utils/security';


export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}
