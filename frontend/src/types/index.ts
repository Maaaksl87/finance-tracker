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

export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

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

export const SavingPlanStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  PAUSED: "paused",
} as const;

export type SavingPlanStatus =
  (typeof SavingPlanStatus)[keyof typeof SavingPlanStatus];

export interface SavingPlan {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon?: string;
  deadline?: string;
  description?: string;
  status: SavingPlanStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingPlanDto {
  title: string;
  targetAmount: number;
  icon?: string;
  deadline?: string;
  description?: string;
}

export interface SavingPlanStats {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  totalSaved: number;
  totalTarget: number;
}

export interface UpdateSavingPlanDto {
  title?: string;
  targetAmount?: number;
  icon?: string;
  deadline?: Date;
  description?: string;
  currentAmount?: number;
  status?: SavingPlanStatus;
}
