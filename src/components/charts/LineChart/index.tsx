import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface LineChartData {
  value: number;
  label: string;
  dataPointText?: string;
}

interface LineChartProps {
  data: LineChartData[];
  title: string;
  height?: number;
  showDataPoints?: boolean;
  showYAxisIndices?: boolean;
  showVerticalLines?: boolean;
  color?: string;
}

const { width } = Dimensions.get('window');

const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 200,
  showDataPoints = true,
  showYAxisIndices = true,
  showVerticalLines = true,
  color = colors.primary,
}) => {
  // Ordenar dados por mês (cronologicamente) se os dados contêm meses
  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0) return data;

    // Verificar se os dados contêm meses (labels que parecem meses)
    const monthOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const hasMonthLabels = data.some(item =>
      monthOrder.some(month => item.label?.toLowerCase().includes(month))
    );

    if (!hasMonthLabels) return data;

    return [...data].sort((a, b) => {
      const aMonth = a.label?.toLowerCase().replace('.', '') || '';
      const bMonth = b.label?.toLowerCase().replace('.', '') || '';

      const aIndex = monthOrder.indexOf(aMonth);
      const bIndex = monthOrder.indexOf(bMonth);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      return a.label?.localeCompare(b.label || '') || 0;
    });
  }, [data]);

  // Função para calcular valores inteiros do eixo Y
  const calculateYAxisValues = (data: LineChartData[]) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

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

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum dado disponível</Text>
        </View>
      </View>
    );
  }

  const { values: yAxisValues, maxValue } = calculateYAxisValues(sortedData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={sortedData}
          width={width - 160}
          height={height}
          color={color}
          thickness={3}
          dataPointsColor={color}
          dataPointsRadius={6}
          showYAxisIndices={true}
          showVerticalLines={true}
          verticalLinesColor={colors.lightGray}
          yAxisColor={colors.lightGray}
          xAxisColor={colors.lightGray}
          textShiftY={18}
          curved
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.1}
          endOpacity={0.1}
          areaChart
          spacing={(width - 160) / (sortedData.length + 1)}
          initialSpacing={30}
          endSpacing={30}
          noOfSections={4}
          maxValue={maxValue}
          yAxisLabelSuffix=""
          yAxisLabelWidth={50}
          yAxisTextStyle={[styles.axisText, { textAlign: 'right', fontSize: 10 }]}
          xAxisLabelTextStyle={[styles.axisText, { textAlign: 'center', fontSize: 10 }]}
        />
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textDisabled,
    textAlign: 'center',
  },
  axisText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default CustomLineChart;

