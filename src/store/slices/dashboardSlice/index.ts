import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData, ChartData } from '../../../domain/entities/Dashboard';
import { dashboardUseCases } from '../../../infrastructure/di/container';
import { SessionManager } from '../../../infrastructure/security/SessionManager';
import { auth } from '../../../config/firebase';

interface DashboardState {
  data: DashboardData | null;
  charts: ChartData[];
  loading: boolean;
  error: string | null;
  selectedPeriod: 'week' | 'month' | 'year';
  selectedMonth: string;
  selectedYear: string;
}

const initialState: DashboardState = {
  data: null,
  charts: [],
  loading: false,
  error: null,
  selectedPeriod: 'month',
  selectedMonth: new Date().toISOString().slice(0, 7), // Mês atual como padrão
  selectedYear: new Date().getFullYear().toString(), // Ano atual como padrão
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (period: 'week' | 'month' | 'year' = 'month', { getState }) => {
    
    
    const state = getState() as { auth: { user: any; token: string | null; isAuthenticated: boolean }; dashboard: { selectedMonth: string; selectedYear: string } };
    let userId = state.auth.user?.id;
    const selectedMonth = state.dashboard.selectedMonth;
    const selectedYear = state.dashboard.selectedYear;
    
    // Fallback: se user não estiver disponível mas token existe, tentar obter userId do SessionManager
    if (!userId && state.auth.token && state.auth.isAuthenticated) {
      try {
        userId = await SessionManager.getCurrentUserId();
      } catch (error) {
        console.warn('⚠️ Não foi possível obter userId do SessionManager:', error);
      }
    }
    
    if (!userId) {
      console.error('❌ Redux: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const response = await dashboardUseCases.getDashboardData(userId, period, selectedMonth, selectedYear);
    
    
    return response;
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async (period: 'week' | 'month' | 'year' = 'month', { getState }) => {
    
    
    const state = getState() as { auth: { user: any; token: string | null; isAuthenticated: boolean }; dashboard: { selectedMonth: string; selectedYear: string } };
    let userId = state.auth.user?.id;
    const selectedMonth = state.dashboard.selectedMonth;
    const selectedYear = state.dashboard.selectedYear;
    
    
    if (!userId && state.auth.token && state.auth.isAuthenticated) {
      try {
        
        userId = await SessionManager.getCurrentUserId();
     
        if (!userId && auth.currentUser) {
          userId = auth.currentUser.uid;
        }
      } catch (error) {
        console.warn('⚠️ Não foi possível obter userId do SessionManager:', error);
      
        if (!userId && auth.currentUser) {
          userId = auth.currentUser.uid;
        }
      }
    }
    
    if (!userId) {
      console.error('❌ Redux: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const response = await dashboardUseCases.getChartData(userId, period, selectedMonth, selectedYear);
    
    
    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
          reducers: {
            setSelectedPeriod: (state, action: PayloadAction<'week' | 'month' | 'year'>) => {
              state.selectedPeriod = action.payload;
            },
            setSelectedMonth: (state, action: PayloadAction<string>) => {
              state.selectedMonth = action.payload;
            },
            setSelectedYear: (state, action: PayloadAction<string>) => {
              state.selectedYear = action.payload;
            },
            clearDashboardData: (state) => {
              state.data = null;
              state.charts = [];
            },
          },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar dados do dashboard';
      })
      .addCase(fetchChartData.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        
        
        state.loading = false;
        state.charts = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar dados dos gráficos';
      });
  },
});

export const { setSelectedPeriod, setSelectedMonth, setSelectedYear, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;


