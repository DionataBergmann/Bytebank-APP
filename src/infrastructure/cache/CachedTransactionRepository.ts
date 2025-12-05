import AsyncStorage from '@react-native-async-storage/async-storage';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Transaction, TransactionFilters, TransactionFormData } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../data/repositories/TransactionRepository';
import { CacheService } from './CacheService';
import { CacheKeys, CacheTTL } from './CacheKeys';

export class CachedTransactionRepository implements ITransactionRepository {
  private repository: TransactionRepository;

  constructor() {
    this.repository = new TransactionRepository();
  }

  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    pageSize?: number,
    lastDoc?: any
  ): Promise<{ transactions: Transaction[]; lastDoc?: any; hasMore: boolean }> {
    // Criar chave de cache baseada nos filtros
    const filtersKey = filters 
      ? JSON.stringify({ ...filters, pageSize, lastDoc: lastDoc ? 'hasDoc' : null })
      : 'no-filters';
    
    const cacheKey = CacheKeys.TRANSACTIONS(userId, filtersKey);
    
    // Tentar recuperar do cache
    const cached = await CacheService.get<{ transactions: Transaction[]; lastDoc?: any; hasMore: boolean }>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, buscar do repositório
    const data = await this.repository.getTransactions(userId, filters, pageSize, lastDoc);
    
    // Salvar no cache (TTL de 5 minutos para transações)
    await CacheService.set(cacheKey, data, CacheTTL.MEDIUM);
    
    return data;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    // Para buscar por ID, precisamos do userId, mas não temos aqui
    // Então não vamos cachear por enquanto ou precisamos ajustar a interface
    return this.repository.getTransactionById(id);
  }

  async createTransaction(transaction: TransactionFormData, userId: string): Promise<Transaction> {
    const result = await this.repository.createTransaction(transaction, userId);
    
    // Invalidar cache de transações do usuário
    await this.invalidateUserTransactionsCache(userId);
    
    return result;
  }

  async updateTransaction(id: string, transaction: Partial<TransactionFormData>): Promise<Transaction> {
    const result = await this.repository.updateTransaction(id, transaction);
    
    // Invalidar cache relacionado
    // Nota: Precisaríamos do userId aqui também, mas por enquanto invalidamos tudo
    await CacheService.clear();
    
    return result;
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.repository.deleteTransaction(id);
    
    // Invalidar cache
    await CacheService.clear();
  }

  async uploadReceipt(file: any, transactionId: string): Promise<string> {
    return this.repository.uploadReceipt(file, transactionId);
  }

  async getCategories(userId: string): Promise<string[]> {
    const cacheKey = CacheKeys.TRANSACTION_CATEGORIES(userId);
    
    // Tentar recuperar do cache
    const cached = await CacheService.get<string[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, buscar do repositório
    const categories = await this.repository.getCategories(userId);
    
    // Salvar no cache (TTL de 15 minutos para categorias)
    await CacheService.set(cacheKey, categories, CacheTTL.LONG);
    
    return categories;
  }

  /**
   * Invalida todo o cache de transações de um usuário
   */
  private async invalidateUserTransactionsCache(userId: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.includes(`transactions:${userId}`) || 
        key.includes(`transaction_categories:${userId}`)
      );
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('[Cache] Erro ao invalidar cache de transações:', error);
    }
  }
}

