import api from "./axios";
import type {
  CreateTransactionDto,
  TransactionPagination,
  Transaction,
  TransactionStats,
  CalendarDay,
  CategoryStat,
} from "../types";

export const getTransactions = async (params?: {
  limit?: number;
  type?: string;
  sourceId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ transactions: Transaction[]; pagination: TransactionPagination }> => {
  const { data } = await api.get("/transactions", { params });
  return data;
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  const { data } = await api.get<Transaction>(`/transactions/${id}`);
  return data;
};

export const createTransaction = async (
  data: CreateTransactionDto,
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

export const getCalendar = async (params: { from: string, to: string, timezone: string }): Promise<CalendarDay[]> => {
  const { data } = await api.get<CalendarDay[]>('/transactions/calendar', { params });
  return data
}

export const getCategoryStats = async (params: { from: string, to: string }): Promise<CategoryStat[]> => {
  const { data } = await api.get<CategoryStat[]>('/transactions/stats/categories', { params });
  return data
}