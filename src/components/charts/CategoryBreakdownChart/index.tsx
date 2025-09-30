import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryBreakdownChartProps {
  data: CategoryData[];
  title?: string;
  style?: any;
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  data,
  title = 'Investimentos por Categoria',
  style,
}) => {
  // Ordenar dados por valor (maior para menor)
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  // Preparar dados para o gráfico
  const chartData = sortedData.map((item, index) => ({
    value: item.amount,
    label: item.category,
    frontColor: item.color,
    gradientColor: item.color,
    spacing: 20,
    labelWidth: 80,
    labelTextStyle: {
      color: colors.textSecondary,
      fontSize: 10,
    },
  }));

  // Função para calcular valores inteiros do eixo Y
  const calculateYAxisValues = (data: CategoryData[]) => {
    const maxValue = Math.max(...data.map(item => item.amount));
    const minValue = Math.min(...data.map(item => item.amount));

    // Calcular o range
    const range = maxValue - minValue;

    // Definir valores de referência para intervalos
    const niceNumbers = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

    // Encontrar o melhor intervalo
    let bestInterval = 1000;
    for (const num of niceNumbers) {
      if (range / num <= 6) {
        bestInterval = num;
        break;
      }
    }

    // Calcular valores do eixo Y
    const startValue = Math.floor(minValue / bestInterval) * bestInterval;
    const endValue = Math.ceil(maxValue / bestInterval) * bestInterval;
    const values = [];

    for (let i = startValue; i <= endValue; i += bestInterval) {
      values.push(i);
    }

    return { values, maxValue: endValue };
  };

  const { values: yAxisValues, maxValue: yAxisMax } = calculateYAxisValues(data);

  if (data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum investimento encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={260}
          height={200}
          barWidth={30}
          spacing={260 / (chartData.length + 1)}
          roundedTop
          roundedBottom
          hideRules
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{
            color: colors.textSecondary,
            fontSize: 10,
          }}
          xAxisLabelTextStyle={{
            color: colors.textSecondary,
            fontSize: 10,
          }}
          yAxisColor={colors.border}
          xAxisColor={colors.border}
          noOfSections={yAxisValues.length - 1}
          maxValue={yAxisMax}
          yAxisLabelSuffix=""
          yAxisLabelWidth={60}
          showGradient
          gradientColor={colors.primary}
          frontColor={colors.primary}
          isAnimated
          animationDuration={1000}
        />

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          {sortedData.map((item, index) => (
            <View key={index} style={styles.summaryItem}>
              <View style={[styles.summaryColor, { backgroundColor: item.color }]} />
              <Text style={styles.summaryText}>
                {item.category}: R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
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
    alignItems: 'center',
    overflow: 'hidden',
  },
  summaryContainer: {
    marginTop: 16,
    width: '100%',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  summaryText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
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

export default CategoryBreakdownChart;

