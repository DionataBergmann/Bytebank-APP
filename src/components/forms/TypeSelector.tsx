import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { Button } from '../shared';

interface TypeSelectorProps {
  value: 'income' | 'expense';
  onChange: (type: 'income' | 'expense') => void;
  error?: string;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Tipo <Text style={styles.required}>*</Text>
      </Text>

      <View style={styles.selector}>
        <Button
          title="Entrada"
          onPress={() => onChange('income')}
          variant={value === 'income' ? 'primary' : 'outline'}
          size="medium"
          icon={
            <Ionicons
              name="arrow-up"
              size={20}
              color={colors.greenEntry}
            />
          }
          style={StyleSheet.flatten([
            styles.typeButton,
            value === 'income' ? styles.typeButtonActive : styles.typeButtonInactive
          ])}
        />

        <Button
          title="Saída"
          onPress={() => onChange('expense')}
          variant={value === 'expense' ? 'primary' : 'outline'}
          size="medium"
          icon={
            <Ionicons
              name="arrow-down"
              size={20}
              color={colors.redExit}
            />
          }
          style={StyleSheet.flatten([
            styles.typeButton,
            value === 'expense' ? styles.typeButtonActive : styles.typeButtonInactive
          ])}
        />
      </View>


      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
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
  selector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
  },
  typeButtonActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  typeButtonInactive: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
});
