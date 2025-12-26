import { DashboardData, ChartData } from '../entities/Dashboard';

export interface IDashboardRepository {
  getDashboardData(
    userId: string,
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Promise<DashboardData>;
  getChartData(
    userId: string,
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Promise<ChartData[]>;
}



