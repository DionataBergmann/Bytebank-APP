import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { addTransaction, updateTransaction } from '../../store/slices/transactionsSlice';
import { Transaction, TransactionFormData } from '../../types/transaction';
import { colors } from '../../utils/colors';
import { Button, Input, DatePicker, Toast, Logo } from '../../components/shared';
import { TypeSelector, CategorySelector, FileUploader } from '../../components/forms';
import { useFormValidation, commonValidationRules } from '../../hooks';

interface AddTransactionScreenProps {
  route?: {
    params?: {
      transaction?: Transaction;
      isEditing?: boolean;
    };
  };
}

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading: transactionsLoading } = useSelector((state: RootState) => state.transactions);
  const { user } = useSelector((state: RootState) => state.auth);

  const isEditing = route?.params?.isEditing || false;
  const transaction = route?.params?.transaction;

  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    receiptUrl: '',
    tags: [],
    notes: '',
  });

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Hook de validação
  const { validate, hasError, getError, clearError } = useFormValidation({
    description: commonValidationRules.required,
    amount: commonValidationRules.amount,
    category: commonValidationRules.required,
    date: commonValidationRules.required,
  });

  useEffect(() => {
    if (transaction && isEditing) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        receiptUrl: transaction.receiptUrl || '',
        tags: transaction.tags || [],
        notes: transaction.notes || '',
      });
    }
  }, [transaction, isEditing]);

  const validateForm = (): boolean => {
    return validate(formData);
  };

  const handleInputChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (hasError(field)) {
      clearError(field);
    }
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', shouldRedirect = false) => {
    setToast({
      visible: true,
      message,
      type,
    });

    // Se for sucesso e deve redirecionar, navegar após 1.5 segundos
    if (type === 'success' && shouldRedirect) {
      setTimeout(() => {
        (navigation as any).navigate('Transações');
      }, 1500);
    }
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        ...formData,
        // Se há arquivo selecionado, incluir na transação
        ...(selectedFile && { file: selectedFile }),
      };

      if (isEditing && transaction) {
        await dispatch(updateTransaction({
          ...transaction,
          ...transactionData,
        }) as any);
        showToast('Transação atualizada! Redirecionando...', 'success', true);
      } else {
        await dispatch(addTransaction(transactionData) as any);
        showToast('Transação adicionada! Redirecionando...', 'success', true);
        setFormData({
          description: '',
          amount: 0,
          type: 'expense',
          category: '',
          date: new Date().toISOString().split('T')[0],
          receiptUrl: '',
          tags: [],
          notes: '',
        });
        setSelectedFile(null);
      }
    } catch (error) {
      showToast('Não foi possível salvar a transação', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Logo size={40} type="real" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Editar Transação' : 'Nova Transação'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          {/* Tipo de Transação */}
          <TypeSelector
            value={formData.type}
            onChange={(type) => handleInputChange('type', type)}
            error={getError('type')}
          />

          {/* Descrição */}
          <Input
            label="Descrição"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            placeholder="Descrição da transação..."
            error={getError('description')}
            required
          />

          {/* Valor */}
          <Input
            label="Valor"
            value={formData.amount.toString()}
            onChangeText={(text) => handleInputChange('amount', parseFloat(text) || 0)}
            placeholder="0.00"
            keyboardType="numeric"
            error={getError('amount')}
            required
          />

          {/* Categoria */}
          <CategorySelector
            value={formData.category}
            onChange={(category) => handleInputChange('category', category)}
            error={getError('category')}
          />

          {/* Data */}
          <DatePicker
            label="Data"
            value={new Date(formData.date)}
            onChange={(date) => {
              if (date) {
                handleInputChange('date', date.toISOString().split('T')[0]);
              }
            }}
            error={getError('date')}
            required
          />

          {/* Anexo de Arquivo */}
          <FileUploader
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />

          {/* Notas */}
          <Input
            label="Notas"
            value={formData.notes}
            onChangeText={(text) => handleInputChange('notes', text)}
            placeholder="Observações adicionais..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            inputStyle={styles.textArea}
          />

          {/* Botão Salvar */}
          <Button
            title={isEditing ? 'Atualizar Transação' : 'Salvar Transação'}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
            size="large"
          />
        </View>

      </ScrollView>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 60,
    marginRight: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default AddTransactionScreen;
