import api from "./axios";
import type { Budget, BudgetStatus, CreateBudgetDto, UpdateBudgetDto } from "@/types";

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get<Budget[]>("/budgets");
  return response.data;
};

export const getBudgetStatuses = async (month?: string): Promise<BudgetStatus[]> => {
  const response = await api.get<BudgetStatus[]>("/budgets/status", {
    params: month ? { month } : undefined,
  });
  return response.data;
};

export const createBudget = async (dto: CreateBudgetDto): Promise<Budget> => {
  const response = await api.post<Budget>("/budgets", dto);
  return response.data;
};

export const updateBudget = async (id: string, dto: UpdateBudgetDto): Promise<Budget> => {
  const response = await api.patch<Budget>(`/budgets/${id}`, dto);
  return response.data;
};

export const deleteBudget = async (id: string): Promise<Budget> => {
  const response = await api.delete<Budget>(`/budgets/${id}`);
  return response.data;
};
