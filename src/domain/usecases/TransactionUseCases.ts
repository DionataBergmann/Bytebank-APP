import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { Transaction, TransactionFilters, TransactionFormData } from '../entities/Transaction';

export class TransactionUseCases {
  constructor(private repository: ITransactionRepository) {}

  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    pageSize?: number,
    lastDoc?: any
  ) {
    return this.repository.getTransactions(userId, filters, pageSize, lastDoc);
  }

  async getTransactionById(id: string) {
    return this.repository.getTransactionById(id);
  }

  async createTransaction(transaction: TransactionFormData, userId: string) {
    // Regras de negócio
    if (transaction.amount <= 0) {
      throw new Error('O valor da transação deve ser maior que zero');
    }
    if (!transaction.description?.trim()) {
      throw new Error('A descrição é obrigatória');
    }
    if (!transaction.category) {
      throw new Error('A categoria é obrigatória');
    }
    if (!transaction.date) {
      throw new Error('A data é obrigatória');
    }

    return this.repository.createTransaction(transaction, userId);
  }

  async updateTransaction(id: string, transaction: Partial<TransactionFormData>) {
    if (transaction.amount !== undefined && transaction.amount <= 0) {
      throw new Error('O valor da transação deve ser maior que zero');
    }
    if (transaction.description !== undefined && !transaction.description.trim()) {
      throw new Error('A descrição não pode estar vazia');
    }

    return this.repository.updateTransaction(id, transaction);
  }

  async deleteTransaction(id: string) {
    if (!id) {
      throw new Error('ID da transação é obrigatório');
    }
    return this.repository.deleteTransaction(id);
  }

  async uploadReceipt(file: any, transactionId: string) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    if (!transactionId) {
      throw new Error('ID da transação é obrigatório');
    }
    return this.repository.uploadReceipt(file, transactionId);
  }

  async getCategories(userId: string) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    return this.repository.getCategories(userId);
  }
}



