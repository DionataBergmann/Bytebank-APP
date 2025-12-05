import { CacheService } from './CacheService';

/**
 * Gerenciador de cache com funções utilitárias
 */
export class CacheManager {
  /**
   * Inicializa o cache (limpa itens expirados)
   */
  static async initialize(): Promise<void> {
    try {
      await CacheService.clearExpired();
      console.log('[Cache] Cache inicializado e limpo');
    } catch (error) {
      console.error('[Cache] Erro ao inicializar cache:', error);
    }
  }

  /**
   * Limpa todo o cache
   */
  static async clearAll(): Promise<void> {
    await CacheService.clear();
  }

  /**
   * Obtém informações sobre o cache
   */
  static async getInfo(): Promise<{
    size: number;
    sizeInMB: number;
  }> {
    const size = await CacheService.getSize();
    const sizeInMB = size / (1024 * 1024);
    
    return {
      size,
      sizeInMB: Math.round(sizeInMB * 100) / 100,
    };
  }

  /**
   * Limpa cache expirado manualmente
   */
  static async clearExpired(): Promise<void> {
    await CacheService.clearExpired();
  }
}

