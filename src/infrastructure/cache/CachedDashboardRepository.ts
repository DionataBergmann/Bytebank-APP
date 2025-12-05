import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';
import { DashboardData, ChartData } from '../../domain/entities/Dashboard';
import { DashboardRepository } from '../data/repositories/DashboardRepository';
import { CacheService } from './CacheService';
import { CacheKeys, CacheTTL } from './CacheKeys';

export class CachedDashboardRepository implements IDashboardRepository {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  async getDashboardData(
    userId: string,
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Promise<DashboardData> {
    const cacheKey = CacheKeys.DASHBOARD_DATA(userId, period, selectedMonth);
    
    // Tentar recuperar do cache
    const cached = await CacheService.get<DashboardData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, buscar do repositório
    const data = await this.repository.getDashboardData(userId, period, selectedMonth);
    
    // Salvar no cache (TTL de 5 minutos para dashboard)
    await CacheService.set(cacheKey, data, CacheTTL.MEDIUM);
    
    return data;
  }

  async getChartData(
    userId: string,
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Promise<ChartData[]> {
    const cacheKey = CacheKeys.DASHBOARD_CHARTS(userId, period, selectedMonth);
    
    // Tentar recuperar do cache
    const cached = await CacheService.get<ChartData[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, buscar do repositório
    const data = await this.repository.getChartData(userId, period, selectedMonth);
    
    // Salvar no cache (TTL de 5 minutos para gráficos)
    await CacheService.set(cacheKey, data, CacheTTL.MEDIUM);
    
    return data;
  }

  /**
   * Invalida o cache do dashboard de um usuário
   */
  async invalidateCache(userId: string, period?: string, month?: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let cacheKeys: string[];

      if (period && month) {
        // Invalidar cache específico
        cacheKeys = keys.filter(key => 
          key.includes(`dashboard:${userId}:${period}:${month}`) ||
          key.includes(`dashboard_charts:${userId}:${period}:${month}`)
        );
      } else {
        // Invalidar todo o cache do dashboard do usuário
        cacheKeys = keys.filter(key => 
          key.includes(`dashboard:${userId}`) ||
          key.includes(`dashboard_charts:${userId}`)
        );
      }
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('[Cache] Erro ao invalidar cache do dashboard:', error);
    }
  }
}

