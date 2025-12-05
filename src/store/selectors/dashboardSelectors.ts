import { createSelector } from 'reselect';
import { RootState } from '../types';

// Base selectors
const selectDashboardState = (state: RootState) => state.dashboard;

// Memoized selectors
export const selectDashboardData = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.data
);

export const selectChartData = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.charts
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.loading
);

export const selectDashboardError = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.error
);

export const selectSelectedPeriod = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.selectedPeriod
);

export const selectSelectedMonth = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.selectedMonth
);

export const selectTotalBalance = createSelector(
  [selectDashboardData],
  (data) => data?.totalBalance || 0
);

export const selectMonthlyIncome = createSelector(
  [selectDashboardData],
  (data) => data?.monthlyIncome || 0
);

export const selectMonthlyExpense = createSelector(
  [selectDashboardData],
  (data) => data?.monthlyExpense || 0
);

export const selectSavingsRate = createSelector(
  [selectDashboardData],
  (data) => data?.savingsRate || 0
);

