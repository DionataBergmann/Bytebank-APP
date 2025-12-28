import { Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TransactionObservable } from './TransactionObservable';
import { Transaction } from '../../domain/entities/Transaction';
import { DashboardData } from '../../domain/entities/Dashboard';

/**
 * Observable reativo para dados do dashboard
 * Reage automaticamente a mudanças nas transações
 */
export class DashboardObservable {
  private static instance: DashboardObservable;
  private transactionObservable: TransactionObservable;

  private constructor() {
    this.transactionObservable = TransactionObservable.getInstance();
  }

  static getInstance(): DashboardObservable {
    if (!DashboardObservable.instance) {
      DashboardObservable.instance = new DashboardObservable();
    }
    return DashboardObservable.instance;
  }

  /**
   * Cria um Observable que calcula dados do dashboard em tempo real
   * @param userId ID do usuário
   * @param period Período (week, month, year)
   * @param selectedMonth Mês selecionado (formato YYYY-MM)
   */
  getDashboardData$(
    userId: string,
    period: 'week' | 'month' | 'year' = 'month',
    selectedMonth: string = new Date().toISOString().slice(0, 7)
  ): Observable<DashboardData> {
    // Observable de transações filtradas por período
    const transactions$ = this.transactionObservable.getTransactions$(userId);

    return transactions$.pipe(
      map((transactions) => {
        // Filtrar transações pelo período selecionado
        const filteredTransactions = this.filterByPeriod(transactions, period, selectedMonth);

        // Calcular métricas
        const totalIncome = filteredTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = filteredTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0;

        // Calcular top categorias
        const categoryMap = new Map<string, number>();
        filteredTransactions
          .filter((t) => t.type === 'expense')
          .forEach((t) => {
            const current = categoryMap.get(t.category) || 0;
            categoryMap.set(t.category, current + t.amount);
          });

        const topCategories = Array.from(categoryMap.entries())
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        // Transações recentes
        const recentTransactions = filteredTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
          .map((t) => ({
            id: t.id,
            description: t.description,
            amount: t.amount,
            type: t.type,
            category: t.category,
            date: t.date,
          }));

        // Dados do dashboard
        const dashboardData: DashboardData = {
          totalBalance,
          monthlyIncome: totalIncome,
          monthlyExpense: totalExpense,
          savingsRate,
          topCategories: topCategories.map((c) => ({
            category: c.category,
            amount: c.amount,
            percentage: totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0,
          })),
          recentTransactions,
          monthlyTrend: this.calculateMonthlyTrend(filteredTransactions),
          expenseDistribution: this.calculateExpenseDistribution(filteredTransactions),
          investmentEvolution: [],
          categoryBreakdown: topCategories.map((c) => ({
            category: c.category,
            amount: c.amount,
            percentage: totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0,
          })),
          cashFlow: {
            income: totalIncome,
            expense: totalExpense,
          },
        };

        return dashboardData;
      }),
      distinctUntilChanged((prev, curr) => {
        // Só emite se os valores principais mudaram
        return (
          prev.totalBalance === curr.totalBalance &&
          prev.monthlyIncome === curr.monthlyIncome &&
          prev.monthlyExpense === curr.monthlyExpense
        );
      })
    );
  }

  /**
   * Filtra transações por período
   */
  private filterByPeriod(
    transactions: Transaction[],
    period: 'week' | 'month' | 'year',
    selectedMonth: string
  ): Transaction[] {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        const [year, month] = selectedMonth.split('-').map(Number);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59);
        break;
      case 'year':
        const yearNum = parseInt(selectedMonth.split('-')[0]);
        startDate = new Date(yearNum, 0, 1);
        endDate = new Date(yearNum, 11, 31, 23, 59, 59);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  /**
   * Calcula tendência mensal
   */
  private calculateMonthlyTrend(transactions: Transaction[]): any[] {
    const trendMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // YYYY-MM
      const current = trendMap.get(month) || { income: 0, expense: 0 };
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      trendMap.set(month, current);
    });

    return Array.from(trendMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Calcula distribuição de despesas
   */
  private calculateExpenseDistribution(transactions: Transaction[]): any[] {
    const categoryMap = new Map<string, number>();

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  }
}

