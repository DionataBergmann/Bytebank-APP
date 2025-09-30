import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
  style?: any;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthSelect,
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const months = [
    { key: '2025-01', label: 'Janeiro 2025' },
    { key: '2025-02', label: 'Fevereiro 2025' },
    { key: '2025-03', label: 'Março 2025' },
    { key: '2025-04', label: 'Abril 2025' },
    { key: '2025-05', label: 'Maio 2025' },
    { key: '2025-06', label: 'Junho 2025' },
    { key: '2025-07', label: 'Julho 2025' },
    { key: '2025-08', label: 'Agosto 2025' },
    { key: '2025-09', label: 'Setembro 2025' },
    { key: '2025-10', label: 'Outubro 2025' },
    { key: '2025-11', label: 'Novembro 2025' },
    { key: '2025-12', label: 'Dezembro 2025' },
  ];

  const getCurrentMonthLabel = () => {
    const month = months.find(m => m.key === selectedMonth);
    return month ? month.label : 'Selecionar mês';
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Scroll para o mês selecionado quando o modal abrir
  useEffect(() => {
    if (isVisible && scrollViewRef.current) {
      const selectedIndex = months.findIndex(m => m.key === selectedMonth);
      if (selectedIndex !== -1) {
        // Calcular posição para centralizar o item
        const itemHeight = 60; // Altura aproximada de cada item
        const scrollPosition = Math.max(0, (selectedIndex * itemHeight) - (200 / 2));

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: scrollPosition,
            animated: true,
          });
        }, 100);
      }
    }
  }, [isVisible, selectedMonth]);

  const handleMonthSelect = (monthKey: string) => {
    onMonthSelect(monthKey);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, style]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.selectorText}>{getCurrentMonthLabel()}</Text>
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
              <Text style={styles.modalTitle}>Selecionar Mês - 2025</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.monthsList}
              showsVerticalScrollIndicator={false}
            >
              {months.map((month) => {
                const isCurrentMonth = month.key === getCurrentMonth();
                const isSelected = selectedMonth === month.key;

                return (
                  <TouchableOpacity
                    key={month.key}
                    style={[
                      styles.monthItem,
                      isSelected && styles.monthItemSelected,
                      isCurrentMonth && !isSelected && styles.currentMonthItem,
                    ]}
                    onPress={() => handleMonthSelect(month.key)}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        isSelected && styles.monthTextSelected,
                        isCurrentMonth && !isSelected && styles.currentMonthText,
                      ]}
                    >
                      {month.label}
                      {isCurrentMonth && !isSelected && ' (Atual)'}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                    {isCurrentMonth && !isSelected && (
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
    minWidth: 200,
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
  monthsList: {
    maxHeight: 400,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  monthItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  currentMonthItem: {
    backgroundColor: colors.lightGray,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  monthText: {
    fontSize: 16,
    color: colors.text,
  },
  monthTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  currentMonthText: {
    color: colors.primary,
    fontWeight: '500',
  },
});

export default MonthSelector;
