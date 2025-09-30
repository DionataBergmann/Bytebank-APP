import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchDashboardData, fetchChartData, setSelectedPeriod, setSelectedMonth } from '../../store/slices/dashboardSlice';
import { formatCurrency } from '../../utils/formatters';
import { colors } from '../../utils/colors';
import {
  LineChart,
  PieChart,
  BarChart,
  ExpenseDistributionChart,
  InvestmentEvolutionChart,
  CategoryBreakdownChart,
  CashFlowChart
} from '../../components/charts';
import { AnimatedCard, MonthSelector, Logo } from '../../components/shared';

const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { data, charts, loading, error, selectedPeriod, selectedMonth } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const loadDashboardData = useCallback(async () => {
    try {

      // Verificar se o usuário está autenticado antes de carregar
      if (!user) {
        return;
      }

      await Promise.all([
        dispatch(fetchDashboardData(selectedPeriod) as any),
        dispatch(fetchChartData(selectedPeriod) as any),
      ]);
    } catch (error) {
      console.error('❌ DashboardScreen: Erro ao carregar dados do dashboard:', error);
    }
  }, [dispatch, selectedPeriod, user]);

  useEffect(() => {
    // Só carregar se o usuário estiver autenticado
    if (user) {

      loadDashboardData();
    } else {

    }
  }, [loadDashboardData, user]); // Dependência do usuário

  const handleRefresh = () => {
    if (user) {
      loadDashboardData();
    } else {

    }
  };

  const handlePeriodChange = (period: 'month' | 'year') => {
    dispatch(setSelectedPeriod(period));
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'month': return 'Mês';
      case 'year': return 'Ano';
      default: return 'Mês';
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Logo size={40} type="real" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Visão geral das suas finanças</Text>
          </View>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['month', 'year'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}
            >
              {getPeriodLabel(period)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Month Selector */}
      {selectedPeriod === 'month' && (
        <View style={styles.monthSelectorContainer}>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthSelect={async (month) => {

              dispatch(setSelectedMonth(month));
              // Recarregar dados e gráficos com o novo mês
              await loadDashboardData();
              dispatch(fetchChartData(selectedPeriod) as any);
            }}
            style={styles.monthSelector}
          />
        </View>
      )}

      {/* Balance Card */}
      <AnimatedCard delay={100} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Total</Text>
        <Text style={styles.balanceValue}>
          {data ? formatCurrency(data.totalBalance) : 'R$ 0,00'}
        </Text>
      </AnimatedCard>

      {/* Metrics Cards */}
      <View style={styles.metricsContainer}>
        <AnimatedCard delay={200} style={styles.metricCard}>
          <Text style={styles.metricLabel}>Receitas</Text>
          <Text style={[styles.metricValue, styles.incomeValue]}>
            {data ? formatCurrency(data.monthlyIncome) : 'R$ 0,00'}
          </Text>
        </AnimatedCard>
        <AnimatedCard delay={300} style={styles.metricCard}>
          <Text style={styles.metricLabel}>Despesas</Text>
          <Text style={[styles.metricValue, styles.expenseValue]}>
            {data ? formatCurrency(data.monthlyExpense) : 'R$ 0,00'}
          </Text>
        </AnimatedCard>
      </View>

      {/* Savings Rate */}
      <AnimatedCard delay={400} style={styles.savingsCard}>
        <Text style={styles.savingsLabel}>Taxa de Poupança</Text>
        <Text style={styles.savingsValue}>
          {data ? `${data.savingsRate.toFixed(1)}%` : '0%'}
        </Text>
      </AnimatedCard>

      {/* Charts Section */}
      <View style={styles.chartsSection}>
        {/* Distribuição de Despesas */}
        {data && data.expenseDistribution && data.expenseDistribution.length > 0 && (
          <AnimatedCard delay={500}>
            <ExpenseDistributionChart
              data={data.expenseDistribution}
              title="Distribuição das Despesas"
            />
          </AnimatedCard>
        )}

        {/* Evolução dos Investimentos */}
        {data && data.investmentEvolution && data.investmentEvolution.length > 0 && (
          <AnimatedCard delay={600}>
            <InvestmentEvolutionChart
              data={data.investmentEvolution}
              title="Evolução dos Investimentos"
            />
          </AnimatedCard>
        )}


        {/* Fluxo de Caixa */}
        {data && data.cashFlow && (
          <AnimatedCard delay={800}>
            <CashFlowChart
              data={data.cashFlow}
              title="Distribuição por Tipo"
            />
          </AnimatedCard>
        )}

        {/* Gráficos Principais */}
        {charts && charts.length > 0 && (
          <>
            {/* Line Chart - Saldo Líquido Mensal */}
            {(() => {
              const lineChart = charts.find(chart => chart.type === 'line');
              return lineChart && (
                <AnimatedCard delay={900}>
                  <LineChart
                    data={lineChart.data || []}
                    title="Saldo Líquido Mensal"
                    color={colors.primary}
                  />
                </AnimatedCard>
              );
            })()}
          </>
        )}

        {/* Mensagem quando não há gráficos */}
        {(!charts || charts.length === 0) && (
          <AnimatedCard delay={900}>
            <View style={styles.emptyChartsContainer}>
              <Text style={styles.emptyChartsTitle}>Nenhum Dado Disponível</Text>
              <Text style={styles.emptyChartsText}>
                Não há transações para o período selecionado.
              </Text>
            </View>
          </AnimatedCard>
        )}

        {/* Receitas vs Despesas Mensais */}
        {data && (data.monthlyIncome > 0 || data.monthlyExpense < 0) && (
          (() => {
            const chartData = [
              {
                value: data.monthlyIncome,
                label: 'Receitas',
                frontColor: colors.success,
                gradientColor: colors.success,
              },
              {
                value: Math.abs(data.monthlyExpense),
                label: 'Despesas',
                frontColor: colors.error,
                gradientColor: colors.error,
              }
            ];

            return (
              <AnimatedCard delay={1000}>
                <BarChart
                  data={chartData}
                  title="Receitas vs Despesas"
                  height={200}
                  showGradient={true}
                />
              </AnimatedCard>
            );
          })()
        )}

        {/* Top 5 Categorias de Despesas */}
        {data && data.topCategories && data.topCategories.length > 0 && (
          (() => {
            const expenseCategories = data.topCategories.filter(cat => cat.type === 'expense');
            const chartData = expenseCategories
              .slice(0, 5) // Top 5
              .map((category, index) => ({
                value: Math.abs(category.amount),
                label: category.category,
                frontColor: colors.redExitHover,
                gradientColor: colors.redExitHover,
              }));

            // Só mostrar se há dados reais
            if (chartData.length === 0) {
              return null;
            }

            return (
              <AnimatedCard delay={1100}>
                <BarChart
                  data={chartData}
                  title="Top 5 Categorias de Despesas"
                  height={200}
                  showGradient={true}
                />
              </AnimatedCard>
            );
          })()
        )}
      </View>

      {/* Recent Transactions */}
      {data && data.recentTransactions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          {data.recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'income' ? colors.success : colors.error }
                ]}>
                  <Text style={styles.transactionIconText}>
                    {transaction.type === 'income' ? '↑' : '↓'}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? colors.success : colors.error }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Top Categories */}
      {data && data.topCategories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Principais Categorias</Text>
          {data.topCategories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category.category}</Text>
              <Text style={styles.categoryAmount}>
                {formatCurrency(category.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {data && data.recentTransactions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhuma transação encontrada para o período selecionado.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 60, // Espaço para a logo (40px + 20px de gap)
    marginRight: 60, // Compensar o espaço da logo para centralizar melhor
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 15,
    justifyContent: 'center',
  },
  periodButton: {
    flex: 0.4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  monthSelectorContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  monthSelector: {
    width: '100%',
    maxWidth: 300,
  },
  balanceCard: {
    margin: 20,
    marginTop: 10,
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  incomeValue: {
    color: colors.success,
  },
  expenseValue: {
    color: colors.error,
  },
  savingsCard: {
    margin: 20,
    marginTop: 12,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savingsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  savingsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  chartsSection: {
    margin: 20,
    marginTop: 0,
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyChartsContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyChartsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyChartsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DashboardScreen;
