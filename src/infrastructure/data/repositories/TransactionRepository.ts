import AsyncStorage from '@react-native-async-storage/async-storage';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { Transaction, TransactionFilters, TransactionFormData } from '../../../domain/entities/Transaction';
import { firebaseTransactionService } from '../../../../services/firebaseTransactionService';
import { CacheService } from '../../cache/CacheService';
import { CacheKeys, CacheTTL } from '../../cache/CacheKeys';

export class TransactionRepository implements ITransactionRepository {
  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    pageSize?: number,
    lastDoc?: any
  ) {
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

    // Se não estiver em cache, buscar do serviço
    const data = await firebaseTransactionService.getTransactions(userId, filters, pageSize, lastDoc);
    
    // Salvar no cache (TTL de 5 minutos)
    await CacheService.set(cacheKey, data, CacheTTL.MEDIUM);
    
    return data;
  }

  async getTransactionById(id: string) {
    return firebaseTransactionService.getTransactionById(id);
  }

  async createTransaction(transaction: TransactionFormData, userId: string) {
    const result = await firebaseTransactionService.createTransaction(transaction, userId);
    
    // Invalidar cache de transações do usuário
    await this.invalidateUserCache(userId);
    
    return result;
  }

  async updateTransaction(id: string, transaction: Partial<TransactionFormData>) {
    const result = await firebaseTransactionService.updateTransaction(id, transaction);
    
    // Invalidar cache (não temos userId aqui, então invalidamos tudo relacionado a transações)
    await CacheService.clear();
    
    return result;
  }

  async deleteTransaction(id: string) {
    await firebaseTransactionService.deleteTransaction(id);
    
    // Invalidar cache
    await CacheService.clear();
  }

  async uploadReceipt(file: any, transactionId: string) {
    return firebaseTransactionService.uploadReceipt(file, transactionId);
  }

  async getCategories(userId: string) {
    const cacheKey = CacheKeys.TRANSACTION_CATEGORIES(userId);
    
    // Tentar recuperar do cache
    const cached = await CacheService.get<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não estiver em cache, buscar do serviço
    const categories = await firebaseTransactionService.getCategories(userId);
    
    // Salvar no cache (TTL de 15 minutos)
    await CacheService.set(cacheKey, categories, CacheTTL.LONG);
    
    return categories;
  }

  /**
   * Invalida cache de transações de um usuário
   */
  private async invalidateUserCache(userId: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.includes(`@bytebank_cache:transactions:${userId}`) || 
        key.includes(`@bytebank_cache:transaction_categories:${userId}`)
      );
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('[Cache] Erro ao invalidar cache:', error);
    }
  }
}

