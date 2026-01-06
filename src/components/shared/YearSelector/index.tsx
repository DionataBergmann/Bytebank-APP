import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';

interface YearSelectorProps {
  selectedYear: string;
  onYearSelect: (year: string) => void;
  style?: any;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearSelect,
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const generateYears = () => {
    const years: { key: string; label: string }[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i <= 5; i++) {
      const year = currentYear - i;
      years.push({ key: year.toString(), label: year.toString() });
    }

    return years;
  };

  const years = generateYears();

  const getCurrentYearLabel = () => {
    const year = years.find(y => y.key === selectedYear);
    return year ? year.label : 'Selecionar ano';
  };

  const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear().toString();
  };

  useEffect(() => {
    if (isVisible && scrollViewRef.current) {
      const selectedIndex = years.findIndex(y => y.key === selectedYear);
      if (selectedIndex !== -1) {
        const itemHeight = 60;
        const scrollPosition = Math.max(0, (selectedIndex * itemHeight) - (200 / 2));

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: scrollPosition,
            animated: true,
          });
        }, 100);
      }
    }
  }, [isVisible, selectedYear]);

  const handleYearSelect = (yearKey: string) => {
    onYearSelect(yearKey);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, style]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.selectorText}>{getCurrentYearLabel()}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Ano</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.yearsList}
              showsVerticalScrollIndicator={false}
            >
              {years.map((year) => {
                const isCurrentYear = year.key === getCurrentYear();
                const isSelected = selectedYear === year.key;

                return (
                  <TouchableOpacity
                    key={year.key}
                    style={[
                      styles.yearItem,
                      isSelected && styles.yearItemSelected,
                      isCurrentYear && !isSelected && styles.currentYearItem,
                    ]}
                    onPress={() => handleYearSelect(year.key)}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        isSelected && styles.yearTextSelected,
                        isCurrentYear && !isSelected && styles.currentYearText,
                      ]}
                    >
                      {year.label}
                      {isCurrentYear && !isSelected && ' (Atual)'}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                    {isCurrentYear && !isSelected && (
                      <Ionicons name="today" size={20} color={colors.text} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 150,
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  yearsList: {
    maxHeight: 400,
  },
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  yearItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  currentYearItem: {
    backgroundColor: colors.lightGray,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  yearText: {
    fontSize: 16,
    color: colors.text,
  },
  yearTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  currentYearText: {
    color: colors.primary,
    fontWeight: '500',
  },
});

export default YearSelector;

