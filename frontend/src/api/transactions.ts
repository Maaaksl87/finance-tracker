import api from "./axios";
import type {
  CreateTransactionDto,
  Pagination,
  Transaction,
  TransactionStats,
} from "../types";

// Отримати список (з пагінацією та фільтрами)
export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  sourceId?: string;
}): Promise<{ transactions: Transaction[]; pagination: Pagination }> => {
  // axios автоматично перетворить об'єкт params у query string (?page=1&limit=10...)
  const { data } = await api.get("/transactions", { params });
  return data;
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  const { data } = await api.get<Transaction>(`/transactions/${id}`);
  return data;
};

export const createTransaction = async (
  data: CreateTransactionDto
): Promise<Transaction> => {
  const { data: response } = await api.post("/transactions", data);
  return response;
};

export const getTransactionStats = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<TransactionStats> => {
  const { data } = await api.get("/transactions/stats", { params });
  return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
