import { Observable, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { collection, query, where, orderBy, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
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
        // Nota: Firestore requer índice composto para múltiplos orderBy
        // Usando apenas orderBy por date, que é o mais importante
        let q = query(
          collection(db, 'transactions'),
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );

        // Aplicar filtros se fornecidos
        if (filters?.type && filters.type !== 'all') {
          q = query(q, where('type', '==', filters.type));
        }

        if (filters?.category) {
          q = query(q, where('category', '==', filters.category));
        }

        // Listener em tempo real do Firestore
        const unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const transactions: Transaction[] = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                description: data.description || '',
                amount: data.amount || 0,
                type: data.type || 'expense',
                category: data.category || '',
                date: data.date || new Date().toISOString(),
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
                receiptUrl: data.receiptUrl,
                tags: data.tags || [],
                notes: data.notes,
              } as Transaction;
            });

            // Aplicar filtros adicionais no cliente (data, busca, valor)
            let filteredTransactions = transactions;

            if (filters?.startDate) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.date >= filters.startDate!
              );
            }

            if (filters?.endDate) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.date <= filters.endDate!
              );
            }

            if (filters?.search) {
              const searchLower = filters.search.toLowerCase();
              filteredTransactions = filteredTransactions.filter((t) =>
                t.description.toLowerCase().includes(searchLower)
              );
            }

            if (filters?.minAmount !== undefined && filters.minAmount !== null) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.amount >= filters.minAmount!
              );
            }

            if (filters?.maxAmount !== undefined && filters.maxAmount !== null) {
              filteredTransactions = filteredTransactions.filter(
                (t) => t.amount <= filters.maxAmount!
              );
            }

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

