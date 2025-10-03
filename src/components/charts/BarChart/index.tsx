import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface BarChartData {
  value: number;
  label: string;
  frontColor?: string;
  gradientColor?: string;
  spacing?: number;
  labelWidth?: number;
  labelTextStyle?: any;
  topLabelComponent?: () => React.ReactElement;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  height?: number;
  showGradient?: boolean;
  showValuesAsTopLabel?: boolean;
  barWidth?: number;
  spacing?: number;
  color?: string;
  gradientColor?: string;
}

const { width } = Dimensions.get('window');

const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 250,
  showGradient = true,
  showValuesAsTopLabel = true,
  barWidth = 30,
  spacing,
  color = colors.primary,
  gradientColor = colors.primaryDark,
}) => {
  // Função para calcular valores inteiros do eixo Y
  const calculateYAxisValues = (data: BarChartData[]) => {
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

  const { values: yAxisValues, maxValue } = calculateYAxisValues(data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          width={width - 140}
          height={height + 50}
          barWidth={40}
          spacing={spacing || 80}
          initialSpacing={20}
          endSpacing={20}
          frontColor={color}
          gradientColor={showGradient ? gradientColor : undefined}
          showGradient={showGradient}
          showValuesAsTopLabel={true}
          topLabelTextStyle={styles.topLabelText}
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisColor={colors.lightGray}
          xAxisColor={colors.lightGray}
          yAxisTextStyle={[styles.axisText, { textAlign: 'right', fontSize: 12 }]}
          xAxisLabelTextStyle={[styles.axisText, { textAlign: 'center', fontSize: 10 }]}
          isAnimated
          animationDuration={1000}
          noOfSections={4}
          maxValue={maxValue}
          yAxisLabelSuffix=""
          yAxisLabelWidth={60}
          hideAxesAndRules={false}
          showXAxisIndices={false}
          showYAxisIndices={true}
          onPress={(item: any) => {
            // Bar pressed
          }}
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
    paddingTop: 20,
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
  topLabelText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  customLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  customLabelItem: {
    flex: 1,
    alignItems: 'center',
  },
  customLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CustomBarChart;

