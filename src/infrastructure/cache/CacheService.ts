import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

export class CacheService {
  private static readonly CACHE_PREFIX = '@bytebank_cache:';

  /**
   * Salva dados no cache com TTL
   */
  static async set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error(`[Cache] Erro ao salvar cache para ${key}:`, error);
    }
  }

  /**
   * Recupera dados do cache se ainda válidos
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();
      const age = now - cacheItem.timestamp;

      // Verifica se o cache expirou
      if (age > cacheItem.ttl) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error(`[Cache] Erro ao recuperar cache para ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove um item específico do cache
   */
  static async remove(key: string): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error(`[Cache] Erro ao remover cache para ${key}:`, error);
    }
  }

  /**
   * Limpa todo o cache
   */
  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('[Cache] Erro ao limpar cache:', error);
    }
  }

  /**
   * Verifica se existe cache válido para uma chave
   */
  static async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  /**
   * Remove todos os caches expirados
   */
  static async clearExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      const items = await AsyncStorage.multiGet(cacheKeys);
      const now = Date.now();
      const expiredKeys: string[] = [];

      for (const [key, value] of items) {
        if (!value) continue;
        
        try {
          const cacheItem: CacheItem<any> = JSON.parse(value);
          const age = now - cacheItem.timestamp;
          
          if (age > cacheItem.ttl) {
            expiredKeys.push(key);
          }
        } catch (error) {
          // Se não conseguir parsear, considera expirado
          expiredKeys.push(key);
        }
      }

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
      }
    } catch (error) {
      console.error('[Cache] Erro ao limpar cache expirado:', error);
    }
  }

  /**
   * Obtém o tamanho do cache em bytes (aproximado)
   */
  static async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      const items = await AsyncStorage.multiGet(cacheKeys);
      
      let size = 0;
      for (const [, value] of items) {
        if (value) {
          size += value.length;
        }
      }
      
      return size;
    } catch (error) {
      console.error('[Cache] Erro ao calcular tamanho do cache:', error);
      return 0;
    }
  }
}

