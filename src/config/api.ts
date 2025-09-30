// Configuração da API base
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Configurações de timeout e retry
export const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    UPDATE: (id: string) => `/transactions/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
    RECEIPT: (id: string) => `/transactions/${id}/receipt`,
    CATEGORIES: '/transactions/categories',
    STATS: '/transactions/stats',
  },
  DASHBOARD: {
    DATA: '/dashboard',
    CHARTS: '/dashboard/charts',
    METRICS: '/dashboard/metrics',
    TRENDS: (year: number) => `/dashboard/trends/${year}`,
    CATEGORIES: '/dashboard/categories',
    INCOME_EXPENSE: '/dashboard/income-expense',
  },
};














