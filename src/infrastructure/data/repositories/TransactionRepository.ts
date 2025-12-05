import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { Transaction, TransactionFilters, TransactionFormData } from '../../../domain/entities/Transaction';
import { firebaseTransactionService } from '../../../../services/firebaseTransactionService';

export class TransactionRepository implements ITransactionRepository {
  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    pageSize?: number,
    lastDoc?: any
  ) {
    return firebaseTransactionService.getTransactions(userId, filters, pageSize, lastDoc);
  }

  async getTransactionById(id: string) {
    return firebaseTransactionService.getTransactionById(id);
  }

  async createTransaction(transaction: TransactionFormData, userId: string) {
    return firebaseTransactionService.createTransaction(transaction, userId);
  }

  async updateTransaction(id: string, transaction: Partial<TransactionFormData>) {
    return firebaseTransactionService.updateTransaction(id, transaction);
  }

  async deleteTransaction(id: string) {
    return firebaseTransactionService.deleteTransaction(id);
  }

  async uploadReceipt(file: any, transactionId: string) {
    return firebaseTransactionService.uploadReceipt(file, transactionId);
  }

  async getCategories(userId: string) {
    return firebaseTransactionService.getCategories(userId);
  }
}

