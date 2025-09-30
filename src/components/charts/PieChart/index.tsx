import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../../../utils/colors';

interface PieChartData {
  value: number;
  color: string;
  text?: string;
  textColor?: string;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
  radius?: number;
  showText?: boolean;
  showTextBackground?: boolean;
  showValuesAsLabels?: boolean;
  showGradient?: boolean;
  centerLabelComponent?: () => React.ReactElement;
}

const { width } = Dimensions.get('window');

const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  title,
  radius = 80,
  showText = true,
  showTextBackground = true,
  showValuesAsLabels = true,
  showGradient = false,
  centerLabelComponent,
}) => {
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

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          radius={radius}
          textColor={colors.text}
          textSize={12}
          showText={false}
          showTextBackground={false}
          showValuesAsLabels={false}
          showGradient={showGradient}
          centerLabelComponent={centerLabelComponent}
          innerRadius={radius * 0.4}
          innerCircleColor={colors.white}
          innerCircleBorderWidth={2}
          innerCircleBorderColor={colors.lightGray}
        />
      </View>

      {/* Legenda */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.text || `Item ${index + 1}`}
            </Text>
            <Text style={styles.legendValue}>
              {((item.value / total) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
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
    marginBottom: 20,
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
  legendContainer: {
    marginTop: 16,
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
  legendText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default CustomPieChart;

