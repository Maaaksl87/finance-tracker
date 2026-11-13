export type BudgetAlertStatus = "normal" | "warning" | "exceeded";

export interface BudgetStatusResult {
  _id: string;
  category: string;
  limit: number;
  currency: string;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetAlertStatus;
}
