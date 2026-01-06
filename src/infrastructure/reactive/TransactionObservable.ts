import { Observable, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Transaction, TransactionFilters } from '../../domain/entities/Transaction';

/**
 * Observable reativo para transações em tempo real
 * Utiliza Firestore onSnapshot para atualizações automáticas
 */
export class TransactionObservable {
  private static instance: TransactionObservable;
  private transactionsSubject = new Subject<Transaction[]>();
  private filtersSubject = new Subject<TransactionFilters>();
  private unsubscribeFn: (() => void) | null = null;

  private constructor() {}

  static getInstance(): TransactionObservable {
    if (!TransactionObservable.instance) {
      TransactionObservable.instance = new TransactionObservable();
    }
    return TransactionObservable.instance;
  }

  /**
   * Cria um Observable que emite transações em tempo real
   * @param userId ID do usuário
   * @param filters Filtros opcionais
   */
  getTransactions$(userId: string, filters?: TransactionFilters): Observable<Transaction[]> {
    return new Observable<Transaction[]>((subscriber) => {
      try {
        // Construir query base
        // Nota: Firestore requer índice composto quando combina where + orderBy
        // Para evitar necessidade de índices, fazemos apenas o filtro por userId
        // e aplicamos ordenação e outros filtros no cliente
        let q = query(
          collection(db, 'transactions'),
          where('userId', '==', userId)
        );

        // Não aplicamos filtros adicionais na query para evitar índices compostos
        // Todos os filtros serão aplicados no cliente após receber os dados

        // Listener em tempo real do Firestore
        const unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const transactions: Transaction[] = snapshot.docs.map((doc) => {
              const data = doc.data();
              const transactionType = data.type || (data.tags && typeof data.tags === 'object' && data.tags.type) || 'expense';
              return {
                id: doc.id,
                description: data.description || '',
                amount: data.amount || 0,
                type: transactionType,
                category: data.category || '',
                date: data.date || new Date().toISOString(),
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
                receiptUrl: data.receiptUrl,
                tags: data.tags || [],
                notes: data.notes,
              } as Transaction;
            });

            // Aplicar todos os filtros no cliente (evita necessidade de índices compostos)
            let filteredTransactions = transactions;

            // Filtrar por tipo
            if (filters?.type && filters.type !== 'all') {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.type === filters.type
              );
            }

            // Filtrar por categoria
            if (filters?.category) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.category === filters.category
              );
            }

            // Filtrar por data inicial
            if (filters?.startDate) {
              const startDate = new Date(filters.startDate);
              startDate.setHours(0, 0, 0, 0);
              filteredTransactions = filteredTransactions.filter((t) => {
                const transactionDate = new Date(t.date);
                transactionDate.setHours(0, 0, 0, 0);
                return transactionDate >= startDate;
              });
            }

            // Filtrar por data final
            if (filters?.endDate) {
              const endDate = new Date(filters.endDate);
              endDate.setHours(23, 59, 59, 999);
              filteredTransactions = filteredTransactions.filter((t) => {
                const transactionDate = new Date(t.date);
                transactionDate.setHours(0, 0, 0, 0);
                return transactionDate <= endDate;
              });
            }

            // Filtrar por busca (descrição)
            if (filters?.search) {
              const searchLower = filters.search.toLowerCase();
              filteredTransactions = filteredTransactions.filter((t) =>
                t.description.toLowerCase().includes(searchLower)
              );
            }

            // Filtrar por valor mínimo
            if (filters?.minAmount !== undefined && filters.minAmount !== null) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.amount >= filters.minAmount!
              );
            }

            // Filtrar por valor máximo
            if (filters?.maxAmount !== undefined && filters.maxAmount !== null) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.amount <= filters.maxAmount!
              );
            }

            // Ordenar por data (mais recente primeiro)
            filteredTransactions.sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA; // Descendente
            });

            subscriber.next(filteredTransactions);
          },
          (error) => {
            console.error('[TransactionObservable] Erro ao observar transações:', error);
            subscriber.error(error);
          }
        );

        // Retornar função de cleanup
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('[TransactionObservable] Erro ao criar observable:', error);
        subscriber.error(error);
        return () => {};
      }
    });
  }

  /**
   * Observable com debounce para busca (otimização de performance)
   * @param userId ID do usuário
   * @param searchTerm$ Observable do termo de busca
   */
  getTransactionsWithSearch$(
    userId: string,
    searchTerm$: Observable<string>
  ): Observable<Transaction[]> {
    return searchTerm$.pipe(
      debounceTime(300), // Aguarda 300ms após última digitação
      distinctUntilChanged(), // Só emite se o valor mudou
      switchMap((searchTerm) => {
        const filters: TransactionFilters = { search: searchTerm } as TransactionFilters;
        return this.getTransactions$(userId, filters);
      })
    );
  }

  /**
   * Observable que emite apenas quando há mudanças significativas
   * Útil para evitar re-renders desnecessários
   */
  getTransactionsDistinct$(userId: string, filters?: TransactionFilters): Observable<Transaction[]> {
    return this.getTransactions$(userId, filters).pipe(
      distinctUntilChanged((prev, curr) => {
        // Compara arrays por IDs e tamanho
        if (prev.length !== curr.length) return false;
        return prev.every((t, i) => t.id === curr[i]?.id);
      })
    );
  }

  /**
   * Limpa subscriptions ativas
   */
  cleanup(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
    }
  }
}

