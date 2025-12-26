/**
 * Chaves de cache padronizadas para evitar conflitos
 */
export const CacheKeys = {
  // Transactions
  TRANSACTIONS: (userId: string, filters?: string) => 
    `transactions:${userId}:${filters || 'all'}`,
  
  TRANSACTION: (userId: string, transactionId: string) => 
    `transaction:${userId}:${transactionId}`,
  
  TRANSACTION_CATEGORIES: (userId: string) => 
    `transaction_categories:${userId}`,

  // Dashboard
  DASHBOARD_DATA: (userId: string, period: string, month: string) => 
    `dashboard:${userId}:${period}:${month}`,
  
  DASHBOARD_CHARTS: (userId: string, period: string, month: string) => 
    `dashboard_charts:${userId}:${period}:${month}`,

  // User
  USER_PROFILE: (userId: string) => 
    `user_profile:${userId}`,

  // Auth
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
} as const;

/**
 * TTL padrão em milissegundos
 */
export const CacheTTL = {
  SHORT: 1 * 60 * 1000,        // 1 minuto
  MEDIUM: 5 * 60 * 1000,       // 5 minutos
  LONG: 15 * 60 * 1000,        // 15 minutos
  VERY_LONG: 60 * 60 * 1000,   // 1 hora
  INFINITE: Number.MAX_SAFE_INTEGER, // Sem expiração
} as const;




