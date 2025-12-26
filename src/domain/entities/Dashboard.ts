export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
  topCategories: CategorySummary[];
  recentTransactions: RecentTransaction[];
  monthlyTrend: MonthlyTrend[];
  expenseDistribution: ExpenseDistributionData[];
  investmentEvolution: InvestmentEvolutionData[];
  categoryBreakdown: CategoryBreakdownData[];
  cashFlow: CashFlowData;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  type: 'income' | 'expense';
}

export interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  title: string;
  data: any[];
  options?: any;
}

export interface ExpenseDistributionData {
  category: string;
  amount: number;
  color: string;
}

export interface InvestmentEvolutionData {
  month: string;
  total: number;
  fixedIncome: number;
  variableIncome: number;
}

export interface CategoryBreakdownData {
  category: string;
  amount: number;
  color: string;
}

export interface CashFlowData {
  income: number;
  expense: number;
}




