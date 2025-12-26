import { IDashboardRepository } from '../repositories/IDashboardRepository';

export class DashboardUseCases {
  constructor(private repository: IDashboardRepository) {}

  async getDashboardData(
    userId: string,
    period: 'week' | 'month' | 'year' = 'month',
    selectedMonth: string
  ) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    return this.repository.getDashboardData(userId, period, selectedMonth);
  }

  async getChartData(
    userId: string,
    period: 'week' | 'month' | 'year' = 'month',
    selectedMonth: string
  ) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    return this.repository.getChartData(userId, period, selectedMonth);
  }
}



