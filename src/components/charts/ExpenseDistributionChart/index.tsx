import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

interface ExpenseDistributionChartProps {
  data: ExpenseData[];
  title?: string;
  style?: any;
}

const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({
  data,
  title = 'Distribuição das Despesas',
  style,
}) => {
  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Preparar dados para o gráfico
  const chartData = data.map((item, index) => ({
    value: item.amount,
    color: item.color,
    text: `${Math.round((item.amount / total) * 100)}%`,
    textColor: colors.white,
    textSize: 12,
  }));

  // Preparar dados para a legenda
  const legendData = data.map((item, index) => ({
    name: item.category,
    color: item.color,
    percentage: Math.round((item.amount / total) * 100),
    amount: item.amount,
  }));

  if (data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma despesa encontrada</Text>
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
          radius={80}
          innerRadius={40}
          showText={false}
          showTextBackground={false}
          showValuesAsLabels={false}
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
          {legendData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendName}>{item.name}</Text>
                <Text style={styles.legendDetails}>
                  {item.percentage}% • R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ))}
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
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  legendDetails: {
    fontSize: 12,
    color: colors.textSecondary,
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

export default ExpenseDistributionChart;

