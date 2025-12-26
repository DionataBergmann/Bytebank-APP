export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  receiptUrl?: string;
  tags?: string[];
  notes?: string;
}

export interface TransactionFilters {
  startDate: string | null;
  endDate: string | null;
  category: string;
  search: string;
  type: 'income' | 'expense' | 'all';
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  receiptUrl?: string;
  tags?: string[];
  notes?: string;
  file?: any;
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}



