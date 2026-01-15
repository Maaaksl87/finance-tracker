export interface Source {
  _id: string;
  name: string;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSourceDto {
  name: string;
  balance: number;
}

export interface UpdateSourceDto {
  name?: string;
  balance?: number;
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export interface Transaction {
  _id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
  sourceId: Source | string;
  destinationSourceId?: Source | string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date?: Date;
  sourceId: string;
  destinationSourceId?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  totalTransfers: number;
  transactionCounts: {
    income: number;
    expense: number;
    transfer: number;
  };
}

export interface Pagination {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}
