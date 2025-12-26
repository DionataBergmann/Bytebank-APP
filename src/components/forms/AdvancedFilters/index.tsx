import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';
import { Button, DatePicker } from '../../shared';
import { TransactionFilters } from '../../../types/transaction';

interface FilterData {
  startDate: Date | null;
  endDate: Date | null;
  category: string;
  type: 'all' | 'income' | 'expense';
  minAmount: number | null;
  maxAmount: number | null;
}

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  currentFilters: TransactionFilters;
  categories: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
  categories,
}) => {
  const [filters, setFilters] = useState<FilterData>(() => ({
    startDate: currentFilters.startDate ? new Date(currentFilters.startDate) : null,
    endDate: currentFilters.endDate ? new Date(currentFilters.endDate) : null,
    category: currentFilters.category || '',
    type: currentFilters.type || 'all',
    minAmount: currentFilters.minAmount || null,
    maxAmount: currentFilters.maxAmount || null,
  }));

  // Resetar filtros quando o modal abrir
  useEffect(() => {
    if (visible) {
      setFilters({
        startDate: currentFilters.startDate ? new Date(currentFilters.startDate) : null,
        endDate: currentFilters.endDate ? new Date(currentFilters.endDate) : null,
        category: currentFilters.category || '',
        type: currentFilters.type || 'all',
        minAmount: currentFilters.minAmount || null,
        maxAmount: currentFilters.maxAmount || null,
      });
    }
  }, [visible]); // Removido currentFilters da dependência

  const handleFilterChange = (key: keyof FilterData, value: any) => {
    
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      return newFilters;
    });
  };

  const handleApply = () => {
    

    // Converter FilterData para TransactionFilters
    const convertedFilters: TransactionFilters = {
      startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : null,
      endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : null,
      category: filters.category,
      search: currentFilters.search, // Manter o search atual da tela principal
      type: filters.type as 'income' | 'expense' | 'all',
      minAmount: filters.minAmount || undefined,
      maxAmount: filters.maxAmount || undefined,
    };

    
    onApplyFilters(convertedFilters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterData = {
      startDate: null,
      endDate: null,
      category: '',
      type: 'all',
      minAmount: null,
      maxAmount: null,
    };
    setFilters(emptyFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.category) count++;
    if (filters.type !== 'all') count++;
    if (filters.minAmount !== null && filters.minAmount !== undefined) count++;
    if (filters.maxAmount !== null && filters.maxAmount !== undefined) count++;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Filtros Avançados</Text>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo</Text>
            <View style={styles.typeContainer}>
              {[
                { key: 'all', label: 'Todos' },
                { key: 'income', label: 'Receitas' },
                { key: 'expense', label: 'Despesas' },
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    filters.type === type.key && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    
                    handleFilterChange('type', type.key);
                  }}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      filters.type === type.key && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  !filters.category && styles.categoryButtonActive,
                ]}
                onPress={() => handleFilterChange('category', '')}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    !filters.category && styles.categoryButtonTextActive,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    filters.category === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => handleFilterChange('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      filters.category === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Date Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período</Text>
            <View style={styles.dateContainer}>
              <DatePicker
                label="Data Inicial"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                placeholder="Data inicial"
                style={styles.datePicker}
              />
              <DatePicker
                label="Data Final"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                placeholder="Data final"
                style={styles.datePicker}
              />
            </View>
          </View>

          {/* Amount Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valor</Text>
            <View style={styles.amountContainer}>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Valor Mínimo</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={filters.minAmount?.toString() || ''}
                  onChangeText={(text) => handleFilterChange('minAmount', text ? parseFloat(text) : null)}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Valor Máximo</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={filters.maxAmount?.toString() || ''}
                  onChangeText={(text) => handleFilterChange('maxAmount', text ? parseFloat(text) : null)}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={`Aplicar Filtros (${getActiveFiltersCount()})`}
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  datePicker: {
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
});

export default React.memo(AdvancedFilters);
