import { store } from '../store';
import { fetchDashboardData, fetchChartData } from '../store/slices/dashboardSlice';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import { RootState } from '../store/types';

/**
 * Pré-carrega dados críticos da aplicação
 */
export class PreloadData {
  /**
   * Pré-carrega dados do usuário autenticado
   */
  static async preloadUserData(userId: string): Promise<void> {
    try {
      const state = store.getState() as RootState;
      
      // Pré-carregar dados do dashboard
      if (!state.dashboard.data) {
        await Promise.all([
          store.dispatch(fetchDashboardData('month') as any),
          store.dispatch(fetchChartData('month') as any),
        ]);
      }

      // Pré-carregar transações recentes
      if (state.transactions.transactions.length === 0) {
        await store.dispatch(fetchTransactions(1) as any);
      }
    } catch (error) {
      console.error('[Preload] Erro ao pré-carregar dados:', error);
    }
  }

  /**
   * Pré-carrega dados críticos após login
   */
  static async preloadAfterLogin(userId: string): Promise<void> {
    try {
      // Carregar dados do usuário
      await store.dispatch(getCurrentUser() as any);
      
      // Pré-carregar dados principais em paralelo
      await Promise.all([
        this.preloadUserData(userId),
      ]);
    } catch (error) {
      console.error('[Preload] Erro ao pré-carregar após login:', error);
    }
  }

  /**
   * Pré-carrega dados do dashboard em background
   */
  static async preloadDashboard(userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<void> {
    try {
      await Promise.all([
        store.dispatch(fetchDashboardData(period) as any),
        store.dispatch(fetchChartData(period) as any),
      ]);
    } catch (error) {
      console.error('[Preload] Erro ao pré-carregar dashboard:', error);
    }
  }
}



