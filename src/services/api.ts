import { SoftwareItem, ProjectItem, BlogPost, MediaItem, LeadInquiry, AdminUser, AuditLog } from '../types';

export interface DbStatusResponse {
  connected: boolean;
  engine: string;
  database?: string;
  message?: string;
  counts?: {
    software: number;
    projects: number;
    articles: number;
    media: number;
    leads: number;
    users: number;
  };
}

class ApiService {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorMsg = `HTTP Error ${res.status} (${res.statusText})`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.error) {
          errorMsg = errJson.error;
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // --- Diagnostics & Status ---
  async getStatus(): Promise<DbStatusResponse> {
    try {
      return await this.request<DbStatusResponse>('/status');
    } catch {
      return {
        connected: false,
        engine: 'Disconnected / Offline',
        message: 'Could not reach /api/status endpoint',
      };
    }
  }

  // --- Software ---
  async getSoftware(): Promise<SoftwareItem[]> {
    return this.request<SoftwareItem[]>('/software');
  }

  async createSoftware(item: Omit<SoftwareItem, 'id'>): Promise<SoftwareItem> {
    return this.request<SoftwareItem>('/software', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateSoftware(id: string, item: Partial<SoftwareItem>): Promise<SoftwareItem> {
    return this.request<SoftwareItem>(`/software/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteSoftware(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/software/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // --- Projects ---
  async getProjects(): Promise<ProjectItem[]> {
    return this.request<ProjectItem[]>('/projects');
  }

  async createProject(item: Omit<ProjectItem, 'id' | 'gallery'>): Promise<ProjectItem> {
    return this.request<ProjectItem>('/projects', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateProject(id: string, item: Partial<ProjectItem>): Promise<ProjectItem> {
    return this.request<ProjectItem>(`/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // --- Articles / Blog ---
  async getArticles(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/articles');
  }

  async createArticle(item: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> {
    return this.request<BlogPost>('/articles', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateArticle(id: string, item: Partial<BlogPost>): Promise<BlogPost> {
    return this.request<BlogPost>(`/articles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/articles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // --- Media ---
  async getMedia(): Promise<MediaItem[]> {
    return this.request<MediaItem[]>('/media');
  }

  async createMedia(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> {
    return this.request<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async deleteMedia(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/media/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // --- File Upload ---
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.request<{ url: string; filename: string }>('/upload', {
      method: 'POST',
      body: fd,
    });
  }

  // --- Leads ---
  async getLeads(): Promise<LeadInquiry[]> {
    return this.request<LeadInquiry[]>('/leads');
  }

  async createLead(lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>): Promise<LeadInquiry> {
    return this.request<LeadInquiry>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  async updateLeadStatus(id: string, status: LeadInquiry['status']): Promise<LeadInquiry> {
    return this.request<LeadInquiry>(`/leads/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // --- Users & Auth ---
  async getUsers(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>('/auth/users');
  }

  async login(email: string, password?: string): Promise<{ user: AdminUser; token?: string }> {
    return this.request<{ user: AdminUser; token?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async setPassword(email: string, newPassword: string, currentPassword?: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword, currentPassword }),
    });
  }
}

export const api = new ApiService();
