import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionFilters, TransactionFormData } from '../../../domain/entities/Transaction';
import { transactionUseCases } from '../../../infrastructure/di/container';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
  hasMore: boolean;
  currentPage: number;
  lastDoc: any; // DocumentSnapshot do Firestore para paginação
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    category: '',
    search: '',
    type: 'all',
  },
  hasMore: true,
  currentPage: 1,
  lastDoc: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (page: number = 1, { getState }) => {
    
    
    const state = getState() as { transactions: TransactionsState; auth: { user: any } };
    const userId = state.auth.user?.id;
    
    
    
    
    if (!userId) {
      console.error('❌ Redux: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const isFirstPage = page === 1;
    const lastDoc = isFirstPage ? null : state.transactions.lastDoc;
    
    
    
    // Se não é primeira página mas não tem lastDoc, forçar primeira página
    if (!isFirstPage && !lastDoc) {
      
      const response = await transactionUseCases.getTransactions(
        userId,
        state.transactions.filters,
        20,
        undefined
      );
      
      return {
        transactions: response.transactions,
        hasMore: response.hasMore,
        lastDoc: response.lastDoc,
        page: 1,
      };
    }
    
    const response = await transactionUseCases.getTransactions(
      userId,
      state.transactions.filters,
      20,
      lastDoc
    );
    
    
    
    return {
      transactions: response.transactions,
      hasMore: response.hasMore,
      lastDoc: response.lastDoc,
      page,
    };
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: TransactionFormData, { getState }) => {
    
    
    const state = getState() as { auth: { user: any } };
    const userId = state.auth.user?.id;
    
    
    
    if (!userId) {
      console.error('❌ Redux: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    
    const response = await transactionUseCases.createTransaction(transaction, userId);
    
    
    return response;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction) => {
    const { id, ...transactionData } = transaction;
    const response = await transactionUseCases.updateTransaction(id, transactionData);
    return response;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string) => {
    await transactionUseCases.deleteTransaction(id);
    return id;
  }
);

export const uploadReceipt = createAsyncThunk(
  'transactions/uploadReceipt',
  async ({ file, transactionId }: { file: any; transactionId: string }) => {
    const response = await transactionUseCases.uploadReceipt(file, transactionId);
    return { transactionId, receiptUrl: response };
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      
      
      
      const newFilters = { ...state.filters, ...action.payload };
      
      
      
      // Comparação mais simples
      const filtersChanged = (
        newFilters.startDate !== state.filters.startDate ||
        newFilters.endDate !== state.filters.endDate ||
        newFilters.category !== state.filters.category ||
        newFilters.search !== state.filters.search ||
        newFilters.type !== state.filters.type ||
        newFilters.minAmount !== state.filters.minAmount ||
        newFilters.maxAmount !== state.filters.maxAmount
      );
      
      
      
      state.filters = newFilters;
      
      // Só limpar transações se os filtros realmente mudaram
      if (filtersChanged) {
        
        state.currentPage = 1;
        state.transactions = [];
        state.hasMore = true;
        state.lastDoc = null;
      } else {
        
      }
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: null,
        endDate: null,
        category: '',
        search: '',
        type: 'all',
      };
      state.currentPage = 1;
      state.transactions = [];
      state.hasMore = true;
      state.lastDoc = null;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.transactions = [];
      state.hasMore = true;
      state.lastDoc = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        
        state.loading = false;
        if (action.payload.page === 1) {
          state.transactions = action.payload.transactions;
          
        } else {
          state.transactions = [...state.transactions, ...action.payload.transactions];
          
        }
        state.hasMore = action.payload.hasMore;
        state.lastDoc = action.payload.lastDoc;
        state.currentPage = action.payload.page;
        
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar transações';
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        
        // Adicionar nova transação e reordenar
        state.transactions.unshift(action.payload);
        state.transactions.sort((a, b) => {
          // Primeiro por data da transação
          const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // Se a data for igual, ordenar por createdAt (mais recente primeiro)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      })
      .addCase(uploadReceipt.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.transactionId);
        if (index !== -1) {
          state.transactions[index].receiptUrl = action.payload.receiptUrl;
        }
      });
  },
});

export const { setFilters, clearFilters, resetPagination } = transactionsSlice.actions;
export default transactionsSlice.reducer;
