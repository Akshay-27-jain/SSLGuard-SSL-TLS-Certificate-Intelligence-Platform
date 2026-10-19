import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Never';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'VALID': return 'text-emerald-600 dark:text-emerald-400';
    case 'EXPIRING_SOON': return 'text-amber-600 dark:text-amber-400';
    case 'EXPIRED': return 'text-rose-600 dark:text-rose-400';
    case 'INVALID': return 'text-slate-500 dark:text-slate-400';
    case 'UNREACHABLE': return 'text-purple-600 dark:text-purple-400';
    case 'PENDING': return 'text-blue-600 dark:text-blue-400';
    default: return 'text-slate-500 dark:text-slate-400';
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'VALID': return 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/25';
    case 'EXPIRING_SOON': return 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/25';
    case 'EXPIRED': return 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/25';
    case 'INVALID': return 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/25';
    case 'UNREACHABLE': return 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/25';
    case 'PENDING': return 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/25';
    default: return 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/25';
  }
}

export function getGradeColor(grade: string | null): string {
  switch (grade) {
    case 'A+':
    case 'A': return 'text-emerald-600 dark:text-emerald-400';
    case 'B': return 'text-blue-600 dark:text-blue-400';
    case 'C': return 'text-amber-600 dark:text-amber-400';
    case 'D': return 'text-orange-600 dark:text-orange-400';
    case 'F': return 'text-rose-600 dark:text-rose-400';
    default: return 'text-slate-500 dark:text-slate-400';
  }
}

export function getGradeBg(grade: string | null): string {
  switch (grade) {
    case 'A+':
    case 'A': return 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
    case 'B': return 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400';
    case 'C': return 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400';
    case 'D': return 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-400';
    case 'F': return 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400';
    default: return 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/30 text-slate-500 dark:text-slate-400';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'VALID': return 'Valid & Active';
    case 'EXPIRING_SOON': return 'Expiring Soon';
    case 'EXPIRED': return 'Expired';
    case 'INVALID': return 'Invalid Certificate';
    case 'UNREACHABLE': return 'Unreachable (Port 443)';
    case 'PENDING': return 'Handshake Pending';
    case 'ERROR': return 'Connection Error';
    default: return status;
  }
}

export function getDaysLabel(days: number | null): string {
  if (days === null || days === undefined) return 'Unknown';
  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
}

export function cleanHostname(input: string): string {
  if (!input) return '';
  let hostname = input.trim().toLowerCase();
  if (hostname.startsWith('https://')) hostname = hostname.substring(8);
  else if (hostname.startsWith('http://')) hostname = hostname.substring(7);
  if (hostname.includes('/')) hostname = hostname.split('/')[0];
  if (hostname.includes('?')) hostname = hostname.split('?')[0];
  if (hostname.includes('#')) hostname = hostname.split('#')[0];
  if (hostname.includes(':')) hostname = hostname.split(':')[0];
  return hostname.trim();
}

export function sanitizeDomainInput(input: string): { hostname: string; port: number } {
  if (!input) return { hostname: '', port: 443 };
  let trimmed = input.trim();
  
  if (trimmed.startsWith('https://')) trimmed = trimmed.substring(8);
  else if (trimmed.startsWith('http://')) trimmed = trimmed.substring(7);

  if (trimmed.includes('/')) trimmed = trimmed.split('/')[0];
  if (trimmed.includes('?')) trimmed = trimmed.split('?')[0];
  if (trimmed.includes('#')) trimmed = trimmed.split('#')[0];

  let port = 443;
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    trimmed = parts[0];
    const parsedPort = parseInt(parts[1], 10);
    if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
      port = parsedPort;
    }
  }

  return { hostname: trimmed.toLowerCase().trim(), port };
}

