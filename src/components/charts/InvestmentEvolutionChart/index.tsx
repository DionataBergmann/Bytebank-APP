import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface InvestmentData {
  month: string;
  total: number;
  fixedIncome: number;
  variableIncome: number;
}

interface InvestmentEvolutionChartProps {
  data: InvestmentData[];
  title?: string;
  style?: any;
}

const InvestmentEvolutionChart: React.FC<InvestmentEvolutionChartProps> = ({
  data,
  title = 'Evolução dos Investimentos',
  style,
}) => {


  // Ordenar dados por mês (cronologicamente)
  const monthOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const sortedData = [...data].sort((a, b) => {
    // Converter para formato esperado (remover ponto final se existir)
    const aMonth = a.month.toLowerCase().replace('.', '');
    const bMonth = b.month.toLowerCase().replace('.', '');

    const aIndex = monthOrder.indexOf(aMonth);
    const bIndex = monthOrder.indexOf(bMonth);
    return aIndex - bIndex;
  });

  // Preparar dados para o gráfico
  const lineData = sortedData.map((item, index) => ({
    value: item.total,
    label: item.month,
    dataPointText: `R$ ${item.total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
  }));



  // Função para calcular valores inteiros do eixo Y
  const calculateYAxisValues = (data: InvestmentData[]) => {
    const maxValue = Math.max(...data.map(item => item.total));
    const minValue = Math.min(...data.map(item => item.total));

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

  const { values: yAxisValues, maxValue: yAxisMax } = calculateYAxisValues(sortedData);

  if (data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum dado de investimento encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={lineData}
          height={200}
          width={240}
          spacing={240 / (lineData.length + 1)}
          initialSpacing={30}
          endSpacing={30}
          color={colors.primary}
          thickness={3}
          startFillColor={colors.primary}
          endFillColor={colors.primary}
          startOpacity={0.3}
          endOpacity={0.1}
          textColor1={colors.text}
          textShiftY={15}
          textShiftX={-5}
          hideDataPoints={false}
          dataPointsRadius={4}
          dataPointsColor={colors.primary}
          yAxisColor={colors.border}
          xAxisColor={colors.border}
          yAxisThickness={1}
          xAxisThickness={1}
          rulesColor={colors.border}
          rulesType="solid"
          noOfSections={4}
          maxValue={yAxisMax}
          yAxisLabelSuffix=""
          yAxisLabelWidth={80}
          xAxisLabelTextStyle={{
            color: colors.textSecondary,
            fontSize: 10,
            textAlign: 'center',
          }}
          yAxisTextStyle={{
            color: colors.textSecondary,
            fontSize: 10,
            textAlign: 'right',
          }}
          curved
          areaChart
        />

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Evolução dos Investimentos</Text>
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
    alignItems: 'center',
    overflow: 'hidden',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
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

export default InvestmentEvolutionChart;

