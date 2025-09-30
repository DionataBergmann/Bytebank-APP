import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData, ChartData } from '../../../types/dashboard';
import { firebaseDashboardService } from '../../../services/firebaseDashboardService';

interface DashboardState {
  data: DashboardData | null;
  charts: ChartData[];
  loading: boolean;
  error: string | null;
  selectedPeriod: 'week' | 'month' | 'year';
  selectedMonth: string;
}

const initialState: DashboardState = {
  data: null,
  charts: [],
  loading: false,
  error: null,
  selectedPeriod: 'month',
  selectedMonth: new Date().toISOString().slice(0, 7), // Mês atual como padrão
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (period: 'week' | 'month' | 'year' = 'month', { getState }) => {
    
    
    const state = getState() as { auth: { user: any }; dashboard: { selectedMonth: string } };
    const userId = state.auth.user?.id;
    const selectedMonth = state.dashboard.selectedMonth;
    
    
    
    
    if (!userId) {
      console.error('❌ Redux: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const response = await firebaseDashboardService.getDashboardData(userId, period, selectedMonth);
    
    
    return response;
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async (period: 'week' | 'month' | 'year' = 'month', { getState }) => {
    
    
    const state = getState() as { auth: { user: any }; dashboard: { selectedMonth: string } };
    const userId = state.auth.user?.id;
    const selectedMonth = state.dashboard.selectedMonth;
    
    
    
    
    if (!userId) {
      console.error('❌ Redux: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const response = await firebaseDashboardService.getChartData(userId, period, selectedMonth);
    
    
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

export const { setSelectedPeriod, setSelectedMonth, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;


