import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';
import { DashboardData, ChartData } from '../../../domain/entities/Dashboard';
import { firebaseDashboardService } from '../../../../services/firebaseDashboardService';
import { CacheService } from '../../cache/CacheService';
import { CacheKeys, CacheTTL } from '../../cache/CacheKeys';

export class DashboardRepository implements IDashboardRepository {
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

    // Se não estiver em cache, buscar do serviço
    const data = await firebaseDashboardService.getDashboardData(userId, period, selectedMonth);
    
    // Salvar no cache (TTL de 5 minutos)
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

    // Se não estiver em cache, buscar do serviço
    const data = await firebaseDashboardService.getChartData(userId, period, selectedMonth);
    
    // Salvar no cache (TTL de 5 minutos)
    await CacheService.set(cacheKey, data, CacheTTL.MEDIUM);
    
    return data;
  }
}

