import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { Modal } from '../shared';
import { CATEGORY_OPTIONS, getCategoriesByGroup, getCategoryGroups } from '../../constants';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSelectCategory = (category: string) => {
    onChange(category);
    setShowModal(false);
  };

  const selectedCategory = CATEGORY_OPTIONS.find(option => option.label === value);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          Categoria <Text style={styles.required}>*</Text>
        </Text>

        <TouchableOpacity
          style={[styles.input, error && styles.inputError]}
          onPress={() => setShowModal(true)}
        >
          <Text style={[styles.inputText, !value && styles.placeholderText]}>
            {value || 'Escolha uma categoria'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <Modal
        visible={showModal}
        title="Escolher Categoria"
        onClose={() => setShowModal(false)}
      >
        <ScrollView style={styles.modalContent}>
          {getCategoryGroups().map((group) => (
            <View key={group} style={styles.categoryGroup}>
              <Text style={styles.groupTitle}>{group}</Text>
              {getCategoriesByGroup(group).map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.categoryOption,
                    value === option.label && styles.categoryOptionSelected,
                  ]}
                  onPress={() => handleSelectCategory(option.label)}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      value === option.label && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.label && (
                    <Ionicons name="checkmark" size={20} color={colors.primaryBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: colors.textDisabled,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  modalContent: {
    flex: 1,
  },
  categoryGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  categoryOptionSelected: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.primaryBlue + '10',
  },
  categoryOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  categoryOptionTextSelected: {
    color: colors.primaryBlue,
    fontWeight: '500',
  },
});
