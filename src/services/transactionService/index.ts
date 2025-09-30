import axios from 'axios';
import { Transaction, TransactionFilters, TransactionFormData, TransactionResponse } from '../../types/transaction';
import { API_BASE_URL } from '../../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const transactionService = {
  // GET /transactions - busca todas as transações
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get('/transactions');
    return response.data;
  },

  // POST /transactions - cria nova transação
  async createTransaction(transaction: TransactionFormData): Promise<Transaction> {
    const formData = new FormData();
    formData.append('type', transaction.type);
    formData.append('value', transaction.amount.toString());
    formData.append('date', transaction.date);
    formData.append('category', transaction.category);
    
    if (transaction.receiptUrl) {
      // Se houver uma URL de recibo, podemos enviar como string
      formData.append('file', transaction.receiptUrl);
    }

    const response = await api.post('/transactions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PUT /transactions/:id - atualiza transação
  async updateTransaction(id: number, transaction: Partial<TransactionFormData>): Promise<Transaction> {
    const formData = new FormData();
    
    if (transaction.type) formData.append('type', transaction.type);
    if (transaction.amount) formData.append('value', transaction.amount.toString());
    if (transaction.date) formData.append('date', transaction.date);
    if (transaction.category) formData.append('category', transaction.category);
    if (transaction.receiptUrl) {
      formData.append('file', transaction.receiptUrl);
    }

    const response = await api.put(`/transactions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // DELETE /transactions/:id - deleta transação
  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  // POST /transactions/upload - upload de arquivo
  async uploadFile(file: File): Promise<{ file: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/transactions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Métodos auxiliares para filtros (implementação local)
  async getTransactionsWithFilters(filters: TransactionFilters): Promise<Transaction[]> {
    const allTransactions = await this.getTransactions();
    
    return allTransactions.filter(transaction => {
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false;
      }
      if (filters.minAmount && transaction.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount && transaction.amount > filters.maxAmount) {
        return false;
      }
      if (filters.search && !transaction.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  },

  // Método para obter categorias únicas
  async getCategories(): Promise<string[]> {
    const transactions = await this.getTransactions();
    const categories = [...new Set(transactions.map(t => t.category))];
    return categories;
  },
};






