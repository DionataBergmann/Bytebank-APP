import transactionsReducer from './slices/transactionsSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';

// Define RootState baseado nos reducers para evitar dependência circular
export type RootState = {
  transactions: ReturnType<typeof transactionsReducer>;
  auth: ReturnType<typeof authReducer>;
  dashboard: ReturnType<typeof dashboardReducer>;
};

