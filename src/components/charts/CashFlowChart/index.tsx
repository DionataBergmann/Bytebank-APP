import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface CashFlowData {
  income: number;
  expense: number;
}

interface CashFlowChartProps {
  data: CashFlowData;
  title?: string;
  style?: any;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({
  data,
  title = 'Distribuição por Tipo',
  style,
}) => {
  const total = data.income + data.expense;
  const incomePercentage = total > 0 ? Math.round((data.income / total) * 100) : 0;
  const expensePercentage = total > 0 ? Math.round((data.expense / total) * 100) : 0;

  // Preparar dados para o gráfico
  const chartData = [
    {
      value: data.income,
      color: colors.success,
      text: `${incomePercentage}%`,
      textColor: colors.white,
      textSize: 14,
    },
    {
      value: data.expense,
      color: colors.error,
      text: `${expensePercentage}%`,
      textColor: colors.white,
      textSize: 14,
    },
  ];

  if (total === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          radius={100}
          innerRadius={60}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelText}>Total</Text>
              <Text style={styles.centerLabelAmount}>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          )}
        />

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendName}>Entrada</Text>
              <Text style={styles.legendDetails}>
                {incomePercentage}% • R$ {data.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendName}>Saída</Text>
              <Text style={styles.legendDetails}>
                {expensePercentage}% • R$ {data.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  centerLabelAmount: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  legendDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default CashFlowChart;






