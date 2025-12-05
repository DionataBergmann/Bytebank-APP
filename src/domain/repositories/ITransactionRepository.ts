import { Transaction, TransactionFilters, TransactionFormData } from '../entities/Transaction';

export interface ITransactionRepository {
  getTransactions(
    userId: string,
    filters?: TransactionFilters,
    pageSize?: number,
    lastDoc?: any
  ): Promise<{ transactions: Transaction[]; lastDoc?: any; hasMore: boolean }>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(transaction: TransactionFormData, userId: string): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<TransactionFormData>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  uploadReceipt(file: any, transactionId: string): Promise<string>;
  getCategories(userId: string): Promise<string[]>;
}

