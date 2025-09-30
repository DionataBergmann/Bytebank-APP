import axios from 'axios';
import { DashboardData, ChartData } from '../../types/dashboard';
import { API_BASE_URL } from '../../config/api';
import { transactionService } from '../transactionService';

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

export const dashboardService = {
  async getDashboardData(period: 'week' | 'month' | 'year' = 'month'): Promise<DashboardData> {
    try {
      // Buscar transações do backend
      const transactions = await transactionService.getTransactions();
      
      // Filtrar transações por período
      const filteredTransactions = this.filterTransactionsByPeriod(transactions, period);
      
      // Calcular métricas
      const totalBalance = this.calculateTotalBalance(filteredTransactions);
      const monthlyIncome = this.calculateIncome(filteredTransactions);
      const monthlyExpense = this.calculateExpense(filteredTransactions);
      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;
      
      // Obter top categorias
      const topCategories = this.getTopCategories(filteredTransactions);
      
      // Obter transações recentes
      const recentTransactions = this.getRecentTransactions(filteredTransactions);
      
      // Obter tendência mensal
      const monthlyTrend = this.getMonthlyTrend(transactions);

      return {
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        savingsRate,
        topCategories,
        recentTransactions,
        monthlyTrend,
        expenseDistribution: [],
        investmentEvolution: [],
        categoryBreakdown: [],
        cashFlow: { income: 0, expense: 0 },
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      // Retornar dados mockados em caso de erro
      return this.getMockDashboardData();
    }
  },

  async getChartData(period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData[]> {
    try {
      const transactions = await transactionService.getTransactions();
      const filteredTransactions = this.filterTransactionsByPeriod(transactions, period);
      
      return [
        {
          id: '1',
          type: 'line',
          title: 'Receitas vs Despesas',
          data: this.generateLineChartData(filteredTransactions),
        },
        {
          id: '2',
          type: 'pie',
          title: 'Categorias de Despesas',
          data: this.generatePieChartData(filteredTransactions),
        },
      ];
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
      return this.getMockChartData();
    }
  },

  // Métodos auxiliares
  filterTransactionsByPeriod(transactions: any[], period: 'week' | 'month' | 'year'): any[] {
    const now = new Date();
    const filterDate = new Date();
    
    switch (period) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return transactions.filter(transaction => 
      new Date(transaction.date) >= filterDate
    );
  },

  calculateTotalBalance(transactions: any[]): number {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  },

  calculateIncome(transactions: any[]): number {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  },

  calculateExpense(transactions: any[]): number {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  },

  getTopCategories(transactions: any[]): any[] {
    const categoryMap = new Map();
    
    transactions.forEach(transaction => {
      const key = `${transaction.category}_${transaction.type}`;
      if (categoryMap.has(key)) {
        categoryMap.set(key, categoryMap.get(key) + transaction.amount);
      } else {
        categoryMap.set(key, transaction.amount);
      }
    });
    
    return Array.from(categoryMap.entries())
      .map(([key, amount]) => {
        const [category, type] = key.split('_');
        return { category, amount, type, percentage: 0 };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  },

  getRecentTransactions(transactions: any[]): any[] {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        description: t.description || t.category,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date,
      }));
  },

  getMonthlyTrend(transactions: any[]): any[] {
    const monthlyData = new Map();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expense: 0 });
      }
      
      const data = monthlyData.get(monthKey);
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expense += transaction.amount;
      }
    });
    
    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  generateLineChartData(transactions: any[]): any[] {
    // Implementar geração de dados para gráfico de linha
    return [];
  },

  generatePieChartData(transactions: any[]): any[] {
    // Implementar geração de dados para gráfico de pizza
    return [];
  },

  getMockDashboardData(): DashboardData {
    return {
      totalBalance: 5000,
      monthlyIncome: 8000,
      monthlyExpense: 3000,
      savingsRate: 62.5,
      topCategories: [],
      recentTransactions: [],
      monthlyTrend: [],
      expenseDistribution: [],
      investmentEvolution: [],
      categoryBreakdown: [],
      cashFlow: { income: 0, expense: 0 },
    };
  },

  getMockChartData(): ChartData[] {
    return [
      {
        id: '1',
        type: 'line',
        title: 'Receitas vs Despesas',
        data: [],
      },
    ];
  },
};



