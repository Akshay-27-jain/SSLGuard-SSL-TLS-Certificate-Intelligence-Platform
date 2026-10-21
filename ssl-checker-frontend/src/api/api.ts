import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401/403 session expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthRoute = url.includes('/api/auth/');

    if ((status === 401 || status === 403) && !isAuthRoute) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && !window.location.pathname.startsWith('/reset-password')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  forgotPassword: (data: { email: string }) =>
    api.post('/api/auth/forgot-password', data),
  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/api/auth/reset-password', data),
  sendTestEmail: (data?: { email?: string }) =>
    api.post('/api/auth/test-email', data || {}),
};

// SSL API
export const sslApi = {
  checkSsl: (hostname: string, port = 443) =>
    api.post('/api/ssl/check', { hostname, port }),
  getHistory: (domainId: string) =>
    api.get(`/api/ssl/history/${domainId}`),
};

// Domain API
export const domainApi = {
  getAll: () => api.get('/api/domains'),
  add: (data: { hostname: string; port?: number; notes?: string; alertDaysBefore?: number; emailAlertsEnabled?: boolean }) =>
    api.post('/api/domains', data),
  update: (id: string, data: object) =>
    api.put(`/api/domains/${id}`, data),
  delete: (id: string) =>
    api.delete(`/api/domains/${id}`),
  checkNow: (id: string) =>
    api.post(`/api/domains/${id}/check`),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/api/dashboard/stats'),
  getRecentActivity: () => api.get('/api/dashboard/recent-activity'),
};

export default api;
