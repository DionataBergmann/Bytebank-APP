import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import { loggerMiddleware, errorMiddleware } from './middleware';
import type { RootState } from './types';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loggerMiddleware, errorMiddleware),
});

export type { RootState } from './types';
export type AppDispatch = typeof store.dispatch;

