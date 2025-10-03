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
          const receiptUrl = await this.uploadReceiptWithFallback((transactionData as any).file, transactionRef.id);
          newTransaction.receiptUrl = receiptUrl;
          
          // Atualizar a transação no Firestore com a URL do recibo
          await updateDoc(transactionRef, {
            receiptUrl: receiptUrl,
            updatedAt: new Date().toISOString(),
          });
        } catch (uploadError) {
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

      // Ordenar por data de criação (mais recente primeiro)
      allTransactions.sort((a, b) => {
        // Primeiro por data da transação
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) {
          return dateComparison;
        }
        // Se a data for igual, ordenar por createdAt (mais recente primeiro)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

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

  // Upload de recibo com retry automático
  async uploadReceipt(file: any, transactionId: string, retryCount: number = 0): Promise<string> {
    const maxRetries = 3;
    const retryDelay = 1000 * (retryCount + 1); // Delay progressivo: 1s, 2s, 3s
    
    try {

      // Validar arquivo antes do upload
      if (!file) {
        throw new Error('Arquivo não fornecido');
      }

      if (file.size && file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
      }

      // Verificar tipos permitidos
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (file.mimeType && !allowedTypes.includes(file.mimeType)) {
        throw new Error('Tipo de arquivo não suportado. Use PDF, JPG ou PNG');
      }
      
      // Converter o arquivo para blob se necessário
      let fileBlob: Blob;
      
      if (file.uri) {
        // Para React Native - arquivo do DocumentPicker
        const response = await fetch(file.uri);
        
        if (!response.ok) {
          throw new Error(`Erro ao acessar arquivo: ${response.status} ${response.statusText}`);
        }
        
        fileBlob = await response.blob();
      } else if (file instanceof Blob) {
        // Para web
        fileBlob = file;
      } else {
        throw new Error('Formato de arquivo não suportado');
      }

      // Verificar se o blob foi criado corretamente
      if (!fileBlob || fileBlob.size === 0) {
        throw new Error('Arquivo vazio ou inválido');
      }
      
      // Criar nome do arquivo seguro com timestamp único
      const sanitizedName = (file.name || 'receipt')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 50);
      
      const fileName = `receipts/${transactionId}_${Date.now()}_${retryCount}_${sanitizedName}`;
      const storageRef = ref(storage, fileName);
      
      // Tentar diferentes abordagens de upload
      let uploadSuccess = false;
      let lastError: any = null;
      
      // Abordagem 1: Upload com metadata
      try {
        const metadata = {
          contentType: file.mimeType || fileBlob.type || 'application/octet-stream'
        };
        
        const uploadPromise = uploadBytes(storageRef, fileBlob, metadata);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout no upload')), 30000)
        );
        
        await Promise.race([uploadPromise, timeoutPromise]);
        uploadSuccess = true;
      } catch (error: any) {
        lastError = error;
        
        // Abordagem 2: Upload sem metadata
        try {
          await uploadBytes(storageRef, fileBlob);
          uploadSuccess = true;
        } catch (error2: any) {
          lastError = error2;
          
          // Abordagem 3: Upload com blob recriado
          try {
            const newBlob = new Blob([fileBlob], { type: 'application/pdf' });
            await uploadBytes(storageRef, newBlob);
            uploadSuccess = true;
          } catch (error3: any) {
            lastError = error3;
            throw error3;
          }
        }
      }
      
      if (!uploadSuccess) {
        throw lastError;
      }
      
      const downloadURL = await getDownloadURL(storageRef);
      
      // Atualizar transação com URL do recibo
      await updateDoc(doc(db, 'transactions', transactionId), {
        receiptUrl: downloadURL,
        updatedAt: new Date().toISOString(),
      });
      
      return downloadURL;
    } catch (error: any) {
      // Se for erro storage/unknown e ainda temos tentativas, tentar novamente
      if (error.code === 'storage/unknown' && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.uploadReceipt(file, transactionId, retryCount + 1);
      }
      
      // Tratamento específico de erros do Firebase Storage
      if (error.code) {
        switch (error.code) {
          case 'storage/unauthorized':
            throw new Error('Não autorizado para fazer upload. Verifique as permissões do Firebase Storage.');
          case 'storage/canceled':
            throw new Error('Upload cancelado pelo usuário.');
          case 'storage/unknown':
            throw new Error('Erro persistente do Firebase Storage após múltiplas tentativas. Verifique a configuração e tente novamente mais tarde.');
          case 'storage/invalid-format':
            throw new Error('Formato de arquivo inválido.');
          case 'storage/invalid-checksum':
            throw new Error('Arquivo corrompido. Tente novamente.');
          case 'storage/retry-limit-exceeded':
            throw new Error('Muitas tentativas. Tente novamente mais tarde.');
          default:
            throw new Error(`Erro do Firebase Storage: ${error.code} - ${error.message}`);
        }
      }
      
      // Erros de rede ou outros
      if (error.message?.includes('Network') || error.message?.includes('Timeout')) {
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return this.uploadReceipt(file, transactionId, retryCount + 1);
        }
        throw new Error('Erro de conexão após múltiplas tentativas. Verifique sua internet e tente novamente.');
      }
      
      if (error.message?.includes('fetch')) {
        throw new Error('Erro ao processar arquivo. Verifique se o arquivo não está corrompido.');
      }
      
      throw new Error(`Erro ao fazer upload do recibo: ${error.message || 'Erro desconhecido'}`);
    }
  },

  // Método alternativo de upload usando base64
  async uploadReceiptAlternative(file: any, transactionId: string): Promise<string> {
    try {
      
      // Converter arquivo para base64
      let base64Data: string;
      
      if (file.uri) {
        // Para React Native
        const response = await fetch(file.uri);
        const blob = await response.blob();
        base64Data = await this.blobToBase64(blob);
      } else if (file instanceof Blob) {
        base64Data = await this.blobToBase64(file);
      } else {
        throw new Error('Formato de arquivo não suportado');
      }
      
      // Criar blob a partir do base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const newBlob = new Blob([bytes], { type: file.mimeType || 'application/pdf' });
      
      // Tentar upload com o novo blob
      const sanitizedName = (file.name || 'receipt')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 50);
      
      const fileName = `receipts/alt_${transactionId}_${Date.now()}_${sanitizedName}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, newBlob);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error: any) {
      throw new Error('Método alternativo de upload também falhou');
    }
  },

  // Converter blob para base64
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove o prefixo data:type;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  // Upload com fallback automático
  async uploadReceiptWithFallback(file: any, transactionId: string): Promise<string> {
    try {
      // Primeiro, tentar o método normal
      return await this.uploadReceipt(file, transactionId);
    } catch (error: any) {
      // Se for erro storage/unknown, tentar método alternativo
      if (error.message?.includes('storage/unknown') || error.message?.includes('Erro persistente')) {
        try {
          return await this.uploadReceiptAlternative(file, transactionId);
        } catch (altError: any) {
          // Se ambos falharam, tentar método de emergência
          try {
            return await this.uploadReceiptEmergency(file, transactionId);
          } catch (emergencyError: any) {
            throw new Error('Todos os métodos de upload falharam. O Firebase Storage pode estar com problemas. Tente novamente mais tarde.');
          }
        }
      }
      
      // Para outros erros, re-throw
      throw error;
    }
  },

  // Método de emergência - upload direto sem metadata
  async uploadReceiptEmergency(file: any, transactionId: string): Promise<string> {
    try {
      // Converter arquivo para blob
      let fileBlob: Blob;
      
      if (file.uri) {
        const response = await fetch(file.uri);
        if (!response.ok) {
          throw new Error(`Erro ao acessar arquivo: ${response.status}`);
        }
        fileBlob = await response.blob();
      } else if (file instanceof Blob) {
        fileBlob = file;
      } else {
        throw new Error('Formato de arquivo não suportado');
      }

      // Criar nome simples sem caracteres especiais
      const simpleName = `receipt_${transactionId}_${Date.now()}.pdf`;
      const fileName = `receipts/${simpleName}`;
      const storageRef = ref(storage, fileName);
      
      // Upload sem metadata - apenas o blob
      await uploadBytes(storageRef, fileBlob);
      
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error: any) {
      // Se ainda falhar, tentar método de último recurso
      if (error.code === 'storage/unknown') {
        return await this.uploadReceiptLastResort(file, transactionId);
      }
      
      throw error;
    }
  },

  // Método de último recurso - salvar como base64 no Firestore
  async uploadReceiptLastResort(file: any, transactionId: string): Promise<string> {
    try {
      // Converter para base64
      let base64Data: string;
      
      if (file.uri) {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        base64Data = await this.blobToBase64(blob);
      } else if (file instanceof Blob) {
        base64Data = await this.blobToBase64(file);
      } else {
        throw new Error('Formato de arquivo não suportado');
      }
      
      // Salvar base64 diretamente no Firestore como string
      const base64Url = `data:application/pdf;base64,${base64Data}`;
      
      return base64Url;
    } catch (error: any) {
      throw new Error('Todos os métodos de upload falharam. O arquivo será salvo localmente.');
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
