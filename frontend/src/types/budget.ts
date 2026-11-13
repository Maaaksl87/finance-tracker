export type BudgetAlertStatus = "normal" | "warning" | "exceeded";

export interface BudgetStatus {
  _id: string;
  category: string;
  limit: number;
  currency: string;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetAlertStatus;
}

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  limit: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBudgetDto {
  category: string;
  limit: number;
  currency?: string;
}

export interface UpdateBudgetDto {
  limit: number;
}
