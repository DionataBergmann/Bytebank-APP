import { firebaseTransactionService } from '../firebaseTransactionService';
import { 
  DashboardData, 
  ChartData, 
  ExpenseDistributionData, 
  InvestmentEvolutionData, 
  CategoryBreakdownData, 
  CashFlowData 
} from '../../types/dashboard';

export const firebaseDashboardService = {
  // Buscar dados do dashboard
  async getDashboardData(userId: string, period: 'week' | 'month' | 'year' = 'month', selectedMonth?: string): Promise<DashboardData> {
    try {
      const { startDate, endDate } = selectedMonth && period === 'month' 
        ? this.getDateRangeForMonth(selectedMonth)
        : this.getDateRange(period);
      
      // Buscar estatísticas
      const stats = await firebaseTransactionService.getTransactionStats(userId, startDate, endDate);
      
      // Buscar transações recentes do período selecionado
      const recentTransactions = await firebaseTransactionService.getRecentTransactions(userId, 5, startDate, endDate);
      
      // Buscar principais categorias
      const topCategories = await firebaseTransactionService.getTopCategories(userId, 5, startDate, endDate);
      
      // Para período 'year', buscar dados de todos os meses e somar
      let aggregatedTopCategories = topCategories;
      if (period === 'year') {
        const yearStartDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        const yearEndDate = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
        
        // Buscar todas as transações do ano
        const yearTransactions = await firebaseTransactionService.getTransactions(userId, {
          startDate: yearStartDate,
          endDate: yearEndDate,
          category: '',
          search: '',
          type: 'all'
        });
        
        // Agrupar por categoria e somar valores
        const categoryTotals = new Map();
        yearTransactions.transactions.forEach(transaction => {
          const category = transaction.category;
          if (!categoryTotals.has(category)) {
            categoryTotals.set(category, {
              category,
              amount: 0,
              type: transaction.type
            });
          }
          categoryTotals.get(category).amount += transaction.amount;
        });
        
        // Converter para array e ordenar por valor absoluto
        aggregatedTopCategories = Array.from(categoryTotals.values())
          .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
          .slice(0, 5);
      }
      
      // Gerar dados para os novos gráficos
      const expenseDistribution = this.generateExpenseDistributionData(aggregatedTopCategories);
      const investmentEvolution = await this.generateInvestmentEvolutionData(userId, period, selectedMonth);
      const categoryBreakdown = this.generateCategoryBreakdownData(aggregatedTopCategories);
      const cashFlow = this.generateCashFlowData(stats);
      
      // Gerar dados de evolução (sempre do ano inteiro)
      const lineChartData = await this.generateLineChartData(userId, 'year');

      return {
        totalBalance: stats.totalBalance,
        monthlyIncome: stats.totalIncome,
        monthlyExpense: stats.totalExpense,
        savingsRate: stats.savingsRate,
        recentTransactions: recentTransactions.map(transaction => ({
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
        })),
        topCategories: aggregatedTopCategories.map(cat => ({
          category: cat.category,
          amount: cat.amount,
          percentage: 0, // TODO: Calcular porcentagem
          type: cat.type as 'income' | 'expense'
        })),
        monthlyTrend: lineChartData, // Dados de evolução do ano inteiro
        expenseDistribution,
        investmentEvolution,
        categoryBreakdown,
        cashFlow,
      };
    } catch (error) {
      console.error('❌ DashboardService: Erro ao buscar dados do dashboard:', error);
      throw new Error('Erro ao buscar dados do dashboard');
    }
  },

  // Buscar dados para gráficos
  async getChartData(userId: string, period: 'week' | 'month' | 'year' = 'month', selectedMonth?: string): Promise<ChartData[]> {
    try {
      
      const { startDate, endDate } = selectedMonth && period === 'month' 
        ? this.getDateRangeForMonth(selectedMonth)
        : this.getDateRange(period);
      
      // Buscar estatísticas
      const stats = await firebaseTransactionService.getTransactionStats(userId, startDate, endDate);
      
      // Gerar dados para gráfico de linha (Saldo Líquido)
      const lineChartData = await this.generateLineChartData(userId, period, selectedMonth);
      
      // Gerar dados para gráfico de pizza (Categorias)
      const pieChartData = this.generatePieChartData(stats);
      
      return [
        {
          id: '1',
          type: 'line',
          title: 'Saldo Líquido Mensal',
          data: lineChartData,
        },
        {
          id: '2',
          type: 'pie',
          title: 'Categorias de Despesas',
          data: pieChartData,
        },
      ];
    } catch (error) {
      console.error('❌ DashboardService: Erro ao buscar dados dos gráficos:', error);
      throw new Error('Erro ao buscar dados dos gráficos');
    }
  },

  // Gerar dados para gráfico de linha
  async generateLineChartData(userId: string, period: 'week' | 'month' | 'year', selectedMonth?: string): Promise<any[]> {
    try {
      // Para gráfico de linha, sempre mostrar evolução de todos os meses do ano
      const { startDate, endDate } = period === 'month' 
        ? this.getDateRange('year')
        : this.getDateRange(period);
      
      // Buscar transações do período
      const transactions = await firebaseTransactionService.getTransactions(userId, {
        startDate,
        endDate,
        category: '',
        search: '',
        type: 'all'
      });

      // Agrupar por período (mês/semana)
      const periodData = new Map();
      
      transactions.transactions.forEach(transaction => {
        let periodKey: string;
        let periodLabel: string;
        
        if (period === 'month') {
          const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short' });
          periodKey = month;
          periodLabel = month;
        } else if (period === 'week') {
          const week = Math.ceil(new Date(transaction.date).getDate() / 7);
          periodKey = `Sem ${week}`;
          periodLabel = `Sem ${week}`;
        } else {
          // Para year, usar mês completo para melhor ordenação
          const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short' });
          periodKey = month;
          periodLabel = month;
        }
        
        
        if (!periodData.has(periodKey)) {
          periodData.set(periodKey, {
            period: periodLabel,
            income: 0,
            expense: 0,
            balance: 0
          });
        }
        
        const data = periodData.get(periodKey);
        if (transaction.type === 'income') {
          data.income += transaction.amount;
        } else {
          data.expense += Math.abs(transaction.amount); // Garantir valor positivo
        }
        data.balance = data.income - data.expense;
      });

      // Converter para array e ordenar
      const result = Array.from(periodData.values()).sort((a, b) => {
        const monthOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const indexA = monthOrder.indexOf(a.period.toLowerCase());
        const indexB = monthOrder.indexOf(b.period.toLowerCase());
        
        // Se ambos os meses estão no array de ordenação, usar a ordem
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        // Se apenas um está no array, priorizar o que está
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        // Se nenhum está no array, ordenar alfabeticamente
        return a.period.localeCompare(b.period);
      });

      // Para período 'year', mostrar valores mensais individuais (não acumulados)
      if (period === 'year') {
        const chartData = result.map(item => ({
          value: item.balance,
          label: item.period,
          dataPointText: `R$ ${item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
        }));
        
        return chartData;
      }

      // Criar dados para o gráfico (mostrar saldo líquido)
      const chartData = result.map(item => ({
        value: item.balance,
        label: item.period,
        dataPointText: `R$ ${item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
      }));
      
      // Se não há dados reais, retornar array vazio
      if (chartData.length === 0) {
        return [];
      }
      
      return chartData;
    } catch (error) {
      console.error('❌ Erro ao gerar dados do gráfico de linha:', error);
      return [];
    }
  },

  // Gerar dados para gráfico de pizza
  generatePieChartData(stats: any): any[] {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    
    return Object.entries(stats.categoryStats).map(([category, amount], index) => ({
      value: amount as number,
      color: colors[index % colors.length],
      text: category,
      textColor: '#FFFFFF',
    }));
  },

  // Obter labels baseado no período
  getPeriodLabels(period: 'week' | 'month' | 'year'): string[] {
    switch (period) {
      case 'week':
        return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      case 'month':
        return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      case 'year':
        return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      default:
        return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    }
  },

  // Calcular range de datas baseado no período
  getDateRange(period: 'week' | 'month' | 'year'): { startDate: string; endDate: string } {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  },

  // Obter range de datas para um mês específico
  getDateRangeForMonth(monthString: string): { startDate: string; endDate: string } {
    const [year, month] = monthString.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Último dia do mês

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  },

  // Buscar métricas específicas
  async getMetrics(userId: string, period: 'week' | 'month' | 'year' = 'month') {
    try {
      const { startDate, endDate } = this.getDateRange(period);
      const stats = await firebaseTransactionService.getTransactionStats(userId, startDate, endDate);
      
      return {
        totalTransactions: stats.transactionCount,
        averageTransaction: stats.transactionCount > 0 
          ? (stats.totalIncome + stats.totalExpense) / stats.transactionCount 
          : 0,
        largestIncome: 0, // Implementar busca da maior receita
        largestExpense: 0, // Implementar busca da maior despesa
        savingsRate: stats.savingsRate,
        totalBalance: stats.totalBalance,
      };
    } catch (error) {
      throw new Error('Erro ao buscar métricas');
    }
  },

  // Buscar tendências
  async getTrends(userId: string, year: number) {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      const monthlyTrends = [];
      for (let month = 1; month <= 12; month++) {
        const monthStart = `${year}-${month.toString().padStart(2, '0')}-01`;
        const monthEnd = `${year}-${month.toString().padStart(2, '0')}-31`;
        
        const monthStats = await firebaseTransactionService.getTransactionStats(userId, monthStart, monthEnd);
        
        monthlyTrends.push({
          month: month,
          income: monthStats.totalIncome,
          expense: monthStats.totalExpense,
          balance: monthStats.totalBalance,
        });
      }
      
      return monthlyTrends;
    } catch (error) {
      throw new Error('Erro ao buscar tendências');
    }
  },

  // Gerar dados para distribuição de despesas
  generateExpenseDistributionData(topCategories: any[]): ExpenseDistributionData[] {
    const colors = ['#F44336', '#E57373', '#EF5350', '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#FF5722', '#FF7043'];
    
    // Filtrar apenas despesas (valores negativos)
    const expenseCategories = topCategories.filter(category => category.amount < 0);
    
    const result = expenseCategories.map((category, index) => ({
      category: category.category,
      amount: Math.abs(category.amount), // Garantir valor positivo
      color: colors[index % colors.length],
    }));
    return result;
  },

  // Gerar dados para evolução dos investimentos
  async generateInvestmentEvolutionData(userId: string, period: string, selectedMonth?: string): Promise<InvestmentEvolutionData[]> {
    try {
      // Para evolução dos investimentos, sempre buscar dados do ano inteiro
      const { startDate, endDate } = this.getDateRange('year');
      
      // Buscar todas as transações do período (não apenas receitas)
      const transactions = await firebaseTransactionService.getTransactions(userId, {
        startDate,
        endDate,
        category: '',
        search: '',
        type: 'all'
      });

      // Filtrar apenas receitas
      const incomeTransactions = transactions.transactions.filter(t => t.type === 'income');

      // Se não há transações de receita, retornar array vazio
      if (incomeTransactions.length === 0) {
        return [];
      }

      // Agrupar por mês
      const monthlyData = new Map();
      
      incomeTransactions.forEach(transaction => {
        const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short' });
        const amount = transaction.amount;
        
        if (!monthlyData.has(month)) {
          monthlyData.set(month, {
            month,
            total: 0,
            fixedIncome: 0,
            variableIncome: 0,
          });
        }
        
        const data = monthlyData.get(month);
        data.total += amount;
        
        // Classificar como renda fixa ou variável baseado na categoria
        if (this.isFixedIncome(transaction.category)) {
          data.fixedIncome += amount;
        } else {
          data.variableIncome += amount;
        }
      });

      const result = Array.from(monthlyData.values()).sort((a, b) => {
        const monthOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const indexA = monthOrder.indexOf(a.month.toLowerCase().replace('.', ''));
        const indexB = monthOrder.indexOf(b.month.toLowerCase().replace('.', ''));
        
        // Se ambos os meses estão no array de ordenação, usar a ordem
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        // Se apenas um está no array, priorizar o que está
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        // Se nenhum está no array, ordenar alfabeticamente
        return a.month.localeCompare(b.month);
      });

      // Para período 'year', mostrar valores mensais individuais (não acumulados)
      if (period === 'year') {
        return result.map(item => ({
          month: item.month,
          total: item.total,
          fixedIncome: item.fixedIncome,
          variableIncome: item.variableIncome,
        }));
      }

      return result;
    } catch (error) {
      console.error('❌ Erro ao gerar dados de evolução dos investimentos:', error);
      return [];
    }
  },

  // Gerar dados para breakdown por categoria
  generateCategoryBreakdownData(topCategories: any[]): CategoryBreakdownData[] {
    
    const colors = ['#F44336', '#E57373', '#EF5350', '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#FF5722', '#FF7043'];
    
    const result = topCategories.map((category, index) => ({
      category: category.category,
      amount: Math.abs(category.amount), // Garantir valor positivo
      color: colors[index % colors.length],
    }));
    
    
    return result;
  },

  // Gerar dados para fluxo de caixa
  generateCashFlowData(stats: any): CashFlowData {
    return {
      income: stats.totalIncome,
      expense: stats.totalExpense,
    };
  },

  // Classificar se uma categoria é renda fixa
  isFixedIncome(category: string): boolean {
    const fixedIncomeCategories = [
      'Salário',
      'Renda Fixa',
      'Poupança',
      'CDB',
      'Tesouro Direto',
      'LCI',
      'LCA',
      'Debêntures',
      'Fundos de Renda Fixa'
    ];
    
    return fixedIncomeCategories.some(fixedCategory => 
      category.toLowerCase().includes(fixedCategory.toLowerCase())
    );
  },
};
