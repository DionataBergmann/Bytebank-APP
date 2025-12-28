import { useEffect, useState, useRef } from 'react';
import { Observable, Subscription } from 'rxjs';
import { TransactionObservable, DashboardObservable } from '../infrastructure/reactive';
import { Transaction } from '../domain/entities/Transaction';
import { DashboardData } from '../domain/entities/Dashboard';
import { TransactionFilters } from '../domain/entities/Transaction';

/**
 * Hook para consumir observables de transações de forma reativa
 */
export function useReactiveTransactions(
  userId: string | undefined,
  filters?: TransactionFilters
): {
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
} {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const transactionObservable = TransactionObservable.getInstance();
    const transactions$ = transactionObservable.getTransactions$(userId, filters);

    const subscription = transactions$.subscribe({
      next: (data) => {
        setTransactions(data);
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        console.error('[useReactiveTransactions] Erro:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      },
    });

    subscriptionRef.current = subscription;

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [userId, JSON.stringify(filters)]);

  return { transactions, loading, error };
}

/**
 * Hook para consumir observables de dashboard de forma reativa
 */
export function useReactiveDashboard(
  userId: string | undefined,
  period: 'week' | 'month' | 'year' = 'month',
  selectedMonth: string = new Date().toISOString().slice(0, 7)
): {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const dashboardObservable = DashboardObservable.getInstance();
    const dashboard$ = dashboardObservable.getDashboardData$(userId, period, selectedMonth);

    const subscription = dashboard$.subscribe({
      next: (dashboardData) => {
        setData(dashboardData);
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        console.error('[useReactiveDashboard] Erro:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      },
    });

    subscriptionRef.current = subscription;

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [userId, period, selectedMonth]);

  return { data, loading, error };
}

/**
 * Hook genérico para consumir qualquer Observable
 */
export function useObservable<T>(
  observable$: Observable<T> | null,
  initialValue: T
): {
  value: T;
  loading: boolean;
  error: Error | null;
} {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!observable$) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const subscription = observable$.subscribe({
      next: (data) => {
        setValue(data);
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        console.error('[useObservable] Erro:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      },
    });

    subscriptionRef.current = subscription;

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [observable$]);

  return { value, loading, error };
}

