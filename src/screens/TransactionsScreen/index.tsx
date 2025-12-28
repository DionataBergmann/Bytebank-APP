import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Share,
  Platform,
  Clipboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactions, setFilters, clearFilters, deleteTransaction } from '../../store/slices/transactionsSlice';
import { Transaction, TransactionFilters } from '../../types/transaction';
import { colors } from '../../utils/colors';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { AdvancedFilters } from '../../components/forms';
import { SearchBar, Modal, Toast, Logo } from '../../components/shared';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useReactiveTransactions } from '../../hooks';
import { TransactionFilters as DomainTransactionFilters } from '../../domain/entities/Transaction';

const TransactionsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { transactions: reduxTransactions, loading: reduxLoading, error: reduxError, filters, hasMore, currentPage } = useSelector(
    (state: RootState) => state.transactions
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Observable reativo para atualizações em tempo real
  const domainFilters: DomainTransactionFilters = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    category: filters.category,
    search: filters.search,
    type: filters.type,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
  };
  
  const { transactions: reactiveTransactions, loading: reactiveLoading } = useReactiveTransactions(
    user?.id,
    domainFilters
  );
  
  // Usar dados reativos quando disponíveis, senão usar Redux
  const transactions = reactiveTransactions.length > 0 ? reactiveTransactions : reduxTransactions;
  const loading = reactiveLoading || reduxLoading;
  const error = reduxError;
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const loadTransactions = useCallback(async (page: number = 1) => {
    try {


      // Verificar se o usuário está autenticado antes de carregar
      if (!user) {

        return;
      }

      await dispatch(fetchTransactions(page) as any);
    } catch (error) {
      console.error('❌ TransactionsScreen: Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as transações');
    }
  }, [dispatch, user]);

  // Evitar loop infinito - só carregar quando necessário
  useEffect(() => {

    // Só carregar se o usuário estiver autenticado
    if (user) {

      loadTransactions(1);
      loadCategories();
    } else {

    }
  }, [user]); // Apenas dependência do usuário

  // Recarregar transações quando a tela ganhar foco (útil após editar transação)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadTransactions(1);
      }
    }, [user, loadTransactions])
  );


  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await loadTransactions(1);
      setRefreshing(false);
    } else {

    }
  };

  const loadMore = () => {

    if (hasMore && !loading && transactions.length > 0 && user) {

      loadTransactions(currentPage + 1);
    } else {

    }
  };

  const handleFilterChange = useCallback(async (key: keyof typeof filters, value: any) => {

    dispatch(setFilters({ [key]: value }));

    // Se for busca, recarregar transações imediatamente
    if (key === 'search' && user) {

      await loadTransactions(1);
    }
  }, [dispatch, user, loadTransactions]);

  const clearAllFilters = () => {
    dispatch(clearFilters());
  };

  const handleEditTransaction = (transaction: Transaction) => {
    (navigation as any).navigate('Adicionar', {
      transaction,
      isEditing: true,
    });
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await dispatch(deleteTransaction(transactionToDelete.id) as any);
        setShowDeleteModal(false);
        setTransactionToDelete(null);
        showToast('Transação excluída com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
        showToast('Erro ao excluir transação', 'error');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const showTooltipHandler = (notes: string, event: any) => {
    setTooltipText(notes);
    setTooltipPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    setShowTooltip(true);
  };

  const hideTooltip = () => {
    setShowTooltip(false);
    setTooltipText('');
  };

  const handleDownloadReceipt = async (receiptUrl: string) => {
    try {
      // Verificar se é base64 (método de último recurso)
      if (receiptUrl.startsWith('data:application/pdf;base64,')) {
        // Para base64, mostrar opções ao usuário
        Alert.alert(
          'Comprovante PDF',
          'Este comprovante foi salvo como base64. Como deseja abrir?',
          [
            {
              text: 'Compartilhar',
              onPress: async () => {
                try {
                  // Tentar compartilhar diretamente
                  await Share.share({
                    title: 'Comprovante PDF',
                    message: 'Comprovante da transação',
                    url: receiptUrl,
                  });
                } catch (error) {
                  // Se falhar, mostrar erro mais específico
                  showToast('Erro: Formato de arquivo pode estar corrompido', 'error');
                }
              }
            },
            {
              text: 'Copiar Link',
              onPress: () => {
                try {
                  Clipboard.setString(receiptUrl);
                  showToast('Link copiado! Cole na barra de endereço do navegador', 'info');
                } catch (error) {
                  showToast('Erro ao copiar link', 'error');
                }
              }
            },
            {
              text: 'Cancelar',
              style: 'cancel'
            }
          ]
        );
      } else {
        // Para URLs do Firebase Storage, abrir normalmente
        Linking.openURL(receiptUrl).catch(err => {
          console.error('Erro ao abrir arquivo:', err);
          showToast('Erro ao abrir arquivo', 'error');
        });
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      showToast('Erro ao abrir arquivo', 'error');
    }
  };

  const handleApplyFilters = async (newFilters: TransactionFilters) => {


    dispatch(setFilters(newFilters));


    // Recarregar transações com os novos filtros
    if (user) {

      await loadTransactions(1);
    }
  };

  const loadCategories = useCallback(async () => {
    // Aqui você implementaria a lógica para carregar categorias do backend
    // Por simplicidade, usando categorias fixas
    const defaultCategories = [
      'Alimentação',
      'Transporte',
      'Saúde',
      'Educação',
      'Lazer',
      'Casa',
      'Roupas',
      'Outros',
    ];
    setCategories(defaultCategories);
  }, []);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <TouchableOpacity
        style={styles.transactionContent}
        onPress={() => handleEditTransaction(item)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIcon,
            { backgroundColor: item.type === 'income' ? colors.success : colors.error }
          ]}>
            <Ionicons
              name={item.type === 'income' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={colors.white}
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: item.type === 'income' ? colors.success : colors.error }
          ]}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Tooltip para observações - posicionado no canto superior direito */}
      {item.notes && item.notes.trim() && (
        <TouchableOpacity
          onPressIn={(event) => showTooltipHandler(item.notes!, event)}
          onPressOut={hideTooltip}
          style={styles.tooltipTrigger}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      <View style={styles.actionButtons}>
        {item.receiptUrl && (
          <TouchableOpacity
            onPress={() => handleDownloadReceipt(item.receiptUrl!)}
            style={styles.receiptButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="download-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTransaction(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com filtros */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Logo size={40} type="real" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Transações</Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={24} color={colors.white} />
            {Object.values(filters).some(value => value && value !== '') && (
              <View style={styles.filterIndicator} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          onSearch={(query) => {

            handleFilterChange('search', query);
          }}
          onClear={() => {

            handleFilterChange('search', '');
          }}
          placeholder="Buscar transações..."
          debounceMs={1000}
        />
      </View>

      {/* Lista de transações */}
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={hasMore && !loading && transactions.length > 0 && user ? loadMore : undefined}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading && hasMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Carregando mais...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color={colors.textDisabled} />
              <Text style={styles.emptyStateText}>Nenhuma transação encontrada</Text>
              <Text style={styles.emptyStateSubtext}>
                Tente ajustar os filtros ou adicionar uma nova transação
              </Text>
            </View>
          ) : null
        }
      />

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={clearAllFilters}
        currentFilters={filters}
        categories={categories}
      />

      {/* Modal de Confirmação de Deleção */}
      <Modal
        visible={showDeleteModal}
        onClose={cancelDelete}
        title="Confirmar Exclusão"
      >
        <View style={styles.deleteModalContent}>
          <Ionicons name="warning" size={48} color={colors.error} />
          <Text style={styles.deleteModalTitle}>
            Tem certeza que deseja excluir esta transação?
          </Text>
          <Text style={styles.deleteModalText}>
            {transactionToDelete?.description}
          </Text>
          <Text style={styles.deleteModalAmount}>
            {transactionToDelete?.type === 'income' ? '+' : '-'}
            {formatCurrency(transactionToDelete?.amount || 0)}
          </Text>
          <Text style={styles.deleteModalWarning}>
            Esta ação não pode ser desfeita.
          </Text>

          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.cancelButton]}
              onPress={cancelDelete}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteModalButton, styles.confirmButton]}
              onPress={confirmDelete}
            >
              <Text style={styles.confirmButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tooltip */}
      {showTooltip && (
        <View style={[styles.tooltip, {
          left: tooltipPosition.x - 100,
          top: tooltipPosition.y - 60
        }]}>
          <Text style={styles.tooltipText}>{tooltipText}</Text>
        </View>
      )}

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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  filterButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
    zIndex: 2,
  },
  filterIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  tooltipTrigger: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 10,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    maxWidth: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 16,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -4,
  },
  deleteModalContent: {
    alignItems: 'center',
    padding: 20,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  deleteModalText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteModalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  deleteModalWarning: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.backgroundGray,
  },
  confirmButton: {
    backgroundColor: colors.error,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default TransactionsScreen;
