import { createSelector } from 'reselect';
import { RootState } from '../types';
import { Transaction } from '../../domain/entities/Transaction';

// Base selectors
const selectTransactionsState = (state: RootState) => state.transactions;
const selectTransactions = (state: RootState) => state.transactions.transactions;
const selectFilters = (state: RootState) => state.transactions.filters;
const selectLoading = (state: RootState) => state.transactions.loading;
const selectError = (state: RootState) => state.transactions.error;

// Memoized selectors
export const selectTransactionsList = createSelector(
  [selectTransactions],
  (transactions) => transactions
);

export const selectTransactionsByType = createSelector(
  [selectTransactions, (state: RootState, type: 'income' | 'expense') => type],
  (transactions, type) => transactions.filter(t => t.type === type)
);

export const selectTransactionsByCategory = createSelector(
  [selectTransactions, (state: RootState, category: string) => category],
  (transactions, category) => transactions.filter(t => t.category === category)
);

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (transactions, filters) => {
    let filtered = [...transactions];

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate >= startDate;
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate <= endDate;
      });
    }

    if (filters.minAmount !== undefined && filters.minAmount !== null) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== null) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }

    return filtered;
  }
);

export const selectTransactionsStats = createSelector(
  [selectTransactions],
  (transactions) => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactions.length,
    };
  }
);

export const selectTransactionsLoading = createSelector(
  [selectLoading],
  (loading) => loading
);

export const selectTransactionsError = createSelector(
  [selectError],
  (error) => error
);

export const selectTransactionsFilters = createSelector(
  [selectFilters],
  (filters) => filters
);

export const selectHasMoreTransactions = createSelector(
  [selectTransactionsState],
  (state) => state.hasMore
);

export const selectCurrentPage = createSelector(
  [selectTransactionsState],
  (state) => state.currentPage
);

