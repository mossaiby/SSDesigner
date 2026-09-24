import { UserRole } from '../types';

// XSS Prevention: Sanitize text inputs before storage or display
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Clean unescaped text for display
export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>?/gm, '');
}

// Safe URL validator to prevent javascript: or data: URL injection for external links
export function isValidMediaUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  // Allow data:image for base64 uploads and relative /src paths
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('data:video/')) return true;
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) return true;
  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Password hashing using Web Crypto API SHA-256
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_ssdesigner_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Brute force protection tracker in session
const LOGIN_ATTEMPTS_KEY = 'ssdesigner_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 1 minute lockout

interface AttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

export function getBruteForceStatus(): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
    const record: AttemptRecord = JSON.parse(raw);
    const now = Date.now();
    if (record.lockedUntil && now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    }
    if (record.lockedUntil && now >= record.lockedUntil) {
      // Lockout expired, reset
      sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
    }
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: Math.max(0, MAX_ATTEMPTS - record.count) };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function recordFailedLogin(): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const now = Date.now();
    let record: AttemptRecord = raw ? JSON.parse(raw) : { count: 0, lastAttempt: now, lockedUntil: null };
    
    record.count += 1;
    record.lastAttempt = now;

    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS;
      sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(record));
      return { isLocked: true, remainingSeconds: 60, attemptsLeft: 0 };
    }

    sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(record));
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS - record.count };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS - 1 };
  }
}

export function resetLoginAttempts(): void {
  sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
}

// Role-Based Access Control (RBAC) Permission Matrix
export type PermissionAction = 
  | 'manage_software'
  | 'manage_projects'
  | 'manage_media'
  | 'manage_blog'
  | 'view_leads'
  | 'delete_leads'
  | 'view_audit_logs'
  | 'system_reset';

export function hasPermission(role: UserRole | undefined, action: PermissionAction): boolean {
  if (!role) return false;

  switch (role) {
    case 'administrator':
      return true; // Full privileges
    case 'lead_engineer':
      return ['manage_software', 'manage_projects', 'manage_media', 'manage_blog', 'view_leads'].includes(action);
    case 'editor':
      return ['manage_media', 'manage_blog'].includes(action);
    default:
      return false;
  }
}

// Session validation with expiration (2 hours)
export function validateSession(lastActiveTimestamp: number): boolean {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  return Date.now() - lastActiveTimestamp < TWO_HOURS_MS;
}
