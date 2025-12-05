import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';
import { DashboardData, ChartData } from '../../../domain/entities/Dashboard';
import { firebaseDashboardService } from '../../../../services/firebaseDashboardService';

export class DashboardRepository implements IDashboardRepository {
  async getDashboardData(
    userId: string,
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Promise<DashboardData> {
    return firebaseDashboardService.getDashboardData(userId, period, selectedMonth);
  }

  async getChartData(
    userId: string,
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Promise<ChartData[]> {
    return firebaseDashboardService.getChartData(userId, period, selectedMonth);
  }
}

