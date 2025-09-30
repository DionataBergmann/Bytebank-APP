import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { Transaction, TransactionFormData, TransactionFilters } from '../../types/transaction';

export const firebaseTransactionService = {
  // Criar nova transação
  async createTransaction(transactionData: TransactionFormData, userId: string): Promise<Transaction> {
    try {
      
      
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      

      const newTransaction: Transaction = {
        id: transactionRef.id,
        ...transactionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Se há arquivo para upload, fazer upload e atualizar a transação
      if ((transactionData as any).file) {
        try {
          const receiptUrl = await this.uploadReceipt((transactionData as any).file, transactionRef.id);
          newTransaction.receiptUrl = receiptUrl;
          
          // Atualizar a transação no Firestore com a URL do recibo
          await updateDoc(transactionRef, {
            receiptUrl: receiptUrl,
            updatedAt: new Date().toISOString(),
          });
        } catch (uploadError) {
          console.warn('⚠️ Erro ao fazer upload do recibo:', uploadError);
          // Não vamos falhar a criação da transação se o upload falhar
        }
      }
      
      return newTransaction;
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error);
      throw new Error('Erro ao criar transação');
    }
  },

  // Atualizar transação
  async updateTransaction(transactionId: string, transactionData: Partial<TransactionFormData>): Promise<Transaction> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      
      // Se há arquivo para upload, fazer upload primeiro
      if ((transactionData as any).file) {
        try {
          const receiptUrl = await this.uploadReceipt((transactionData as any).file, transactionId);
          transactionData.receiptUrl = receiptUrl;
        } catch (uploadError) {
          console.warn('⚠️ Erro ao fazer upload do recibo:', uploadError);
          // Não vamos falhar a atualização se o upload falhar
        }
      }
      
      await updateDoc(transactionRef, {
        ...transactionData,
        updatedAt: new Date().toISOString(),
      });

      // Buscar transação atualizada
      const updatedDoc = await getDoc(transactionRef);
      if (!updatedDoc.exists()) {
        throw new Error('Transação não encontrada');
      }

      return {
        id: transactionId,
        ...updatedDoc.data(),
      } as Transaction;
    } catch (error) {
      throw new Error('Erro ao atualizar transação');
    }
  },

  // Deletar transação
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      // Buscar transação para verificar se tem recibo
      const transactionDoc = await getDoc(doc(db, 'transactions', transactionId));
      if (transactionDoc.exists()) {
        const transaction = transactionDoc.data();
        
        // Deletar recibo do Storage se existir
        if (transaction.receiptUrl) {
          try {
            const receiptRef = ref(storage, transaction.receiptUrl);
            await deleteObject(receiptRef);
          } catch (storageError) {
            console.warn('Erro ao deletar recibo do storage:', storageError);
          }
        }
      }

      // Deletar transação do Firestore
      await deleteDoc(doc(db, 'transactions', transactionId));
    } catch (error) {
      throw new Error('Erro ao deletar transação');
    }
  },

  // Buscar transações do usuário
  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{ transactions: Transaction[]; lastDoc?: DocumentSnapshot; hasMore: boolean }> {
    try {
      
      
      // Buscar todas as transações do usuário (sem filtros para evitar índices compostos)
      let q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      
      
      let allTransactions: Transaction[] = [];
      
      // Converter todos os documentos para transações
      querySnapshot.forEach((doc) => {
        const transactionData = {
          id: doc.id,
          ...doc.data(),
        } as Transaction;
        allTransactions.push(transactionData);
      });

      // Aplicar filtros no código (não na query)
      if (filters) {
        
        allTransactions = allTransactions.filter(transaction => {
          if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
            
            return false;
          }
          if (filters.category && transaction.category !== filters.category) {
            
            return false;
          }
          if (filters.startDate && transaction.date < filters.startDate) {
            
            return false;
          }
          if (filters.endDate && transaction.date > filters.endDate) {
            
            return false;
          }
          if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
            
            return false;
          }
          if (filters.search) {
            
          }
          if (filters.minAmount !== null && filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
            
            return false;
          }
          if (filters.maxAmount !== null && filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
            
            return false;
          }
          
          return true;
        });
      }

      // Ordenar por data (mais recente primeiro)
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Aplicar paginação
      const startIndex = lastDoc ? 0 : 0; // Simplificado para sempre começar do início
      const endIndex = startIndex + pageSize;
      const transactions = allTransactions.slice(startIndex, endIndex);
      const hasMore = allTransactions.length > endIndex;


      return {
        transactions,
        lastDoc: undefined, // Simplificado - sem paginação real por enquanto
        hasMore,
      };
    } catch (error) {
      throw new Error('Erro ao buscar transações');
    }
  },

  // Buscar transação por ID
  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    try {
      const transactionDoc = await getDoc(doc(db, 'transactions', transactionId));
      
      if (!transactionDoc.exists()) {
        return null;
      }

      return {
        id: transactionDoc.id,
        ...transactionDoc.data(),
      } as Transaction;
    } catch (error) {
      throw new Error('Erro ao buscar transação');
    }
  },

  // Upload de recibo
  async uploadReceipt(file: any, transactionId: string): Promise<string> {
    try {
      
      
      // Converter o arquivo para blob se necessário
      let fileBlob: Blob;
      
      if (file.uri) {
        // Para React Native - arquivo do DocumentPicker
        const response = await fetch(file.uri);
        fileBlob = await response.blob();
      } else if (file instanceof Blob) {
        // Para web
        fileBlob = file;
      } else {
        throw new Error('Formato de arquivo não suportado');
      }
      
      const fileName = `receipts/${transactionId}_${Date.now()}_${file.name || 'receipt'}`;
      const storageRef = ref(storage, fileName);
      
      
      await uploadBytes(storageRef, fileBlob);
      const downloadURL = await getDownloadURL(storageRef);
      
      
      
      // Atualizar transação com URL do recibo
      await updateDoc(doc(db, 'transactions', transactionId), {
        receiptUrl: downloadURL,
        updatedAt: new Date().toISOString(),
      });
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading receipt:', error);
      throw new Error('Erro ao fazer upload do recibo');
    }
  },

  // Buscar categorias únicas do usuário
  async getCategories(userId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const categories = new Set<string>();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          categories.add(data.category);
        }
      });
      
      return Array.from(categories).sort();
    } catch (error) {
      throw new Error('Erro ao buscar categorias');
    }
  },

  // Buscar estatísticas do usuário
  async getTransactionStats(userId: string, startDate?: string, endDate?: string) {
    try {
      
      
      // Buscar todas as transações do usuário (sem filtros de data para evitar índice composto)
      let q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      
      
      let totalIncome = 0;
      let totalExpense = 0;
      const categoryStats: { [key: string]: number } = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const amount = data.amount || 0;
        const transactionDate = data.date;
        
        // Filtrar por data no código (não na query)
        if (startDate && transactionDate < startDate) return;
        if (endDate && transactionDate > endDate) return;
        
        if (data.type === 'income') {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
        
        // Estatísticas por categoria
        const category = data.category || 'Outros';
        categoryStats[category] = (categoryStats[category] || 0) + amount;
      });
      
      const totalBalance = totalIncome - totalExpense;
      const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100) : 0;
      
      
      
      return {
        totalIncome,
        totalExpense,
        totalBalance,
        savingsRate,
        categoryStats,
        transactionCount: querySnapshot.size,
      };
    } catch (error) {
      console.error('❌ TransactionService: Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao buscar estatísticas');
    }
  },

  // Buscar transações recentes
  async getRecentTransactions(userId: string, limitCount: number = 5, startDate?: string, endDate?: string): Promise<Transaction[]> {
    try {
      // Query simples apenas com userId (sem filtros de data para evitar índice composto)
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          ...data,
        } as Transaction);
      });
      
      // Filtrar por data no código se fornecidos
      let filteredTransactions = transactions;
      if (startDate && endDate) {
        filteredTransactions = transactions.filter(transaction => {
          const transactionDate = transaction.date;
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      }
      
      // Ordenar por data no código (mais recente primeiro)
      filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Limitar o número de transações
      const recentTransactions = filteredTransactions.slice(0, limitCount);
      
      return recentTransactions;
    } catch (error) {
      console.error('❌ TransactionService: Erro ao buscar transações recentes:', error);
      console.error('❌ TransactionService: Detalhes do erro:', error);
      throw new Error('Erro ao buscar transações recentes');
    }
  },

  // Buscar principais categorias
  async getTopCategories(userId: string, limitCount: number = 5, startDate?: string, endDate?: string): Promise<{ category: string; amount: number; type: string }[]> {
    try {
      
      
      // Buscar todas as transações do usuário para obter tipo e categoria
      let q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      
      
      const categoryStats: { [key: string]: { amount: number; type: string } } = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const amount = data.amount || 0;
        const transactionDate = data.date;
        const type = data.type || 'expense';
        
        // Filtrar por data no código (não na query)
        if (startDate && transactionDate < startDate) return;
        if (endDate && transactionDate > endDate) return;
        
        const category = data.category || 'Outros';
        
        if (!categoryStats[category]) {
          categoryStats[category] = { amount: 0, type };
        }
        categoryStats[category].amount += amount;
      });
      
      const topCategories = Object.entries(categoryStats)
        .map(([category, data]) => ({ category, amount: data.amount, type: data.type }))
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, limitCount);
      
      
      
      return topCategories;
    } catch (error) {
      console.error('❌ TransactionService: Erro ao buscar principais categorias:', error);
      throw new Error('Erro ao buscar principais categorias');
    }
  },
};
