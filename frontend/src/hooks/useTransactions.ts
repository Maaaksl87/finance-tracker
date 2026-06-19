import { createTransaction, deleteTransaction, getTransactions, getTransactionStats } from "@/api/transactions";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { sourcesKeys } from "./useSources";
import type { Transaction } from "@/types";
import { useMemo, useState } from 'react'

type DateRange = { startDate?: string; endDate?: string }
export type TypeFilter = "all" | "expense" | "income" | "transfer";


export const transactionsKey = {
  all: ["transactions"] as const,
  stats: (range?: DateRange) =>
    [...transactionsKey.all, "stats", range?.startDate, range?.endDate],
  list: (range?: DateRange, limit?: number) =>
    [...transactionsKey.all, "list", range?.startDate, range?.endDate, limit],
};

export const transactionsQuery = {
  stats: (range?: DateRange) => ({
    queryKey: transactionsKey.stats(range),
    queryFn: () => getTransactionStats(range),
  }),
  list: (range?: DateRange, limit?: number) => ({
    queryKey: transactionsKey.list(range, limit),
    queryFn: () => getTransactions({ startDate: range?.startDate, endDate: range?.endDate, limit }),

  }),
};

export function useTransactions(startDate?: string, endDate?: string, limit?: number) {
  const { data, isLoading, error } = useQuery(transactionsQuery.list({ startDate, endDate }, limit));
  return {
    transactions: data?.transactions ?? [],
    isLoading,
    error,
  };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKey.all });
      queryClient.invalidateQueries({ queryKey: sourcesKeys.lists() });

    },
    onError: (error) => {
      console.error("Помилка створення транзакції:", error);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKey.all });
      queryClient.invalidateQueries({ queryKey: sourcesKeys.lists() });

    },
    onError: (error) => {
      console.error("Помилка видалення транзакції:", error);
    },
  });
}

export function useTransactionStats(range?: { startDate?: string; endDate?: string }) {
  const statsQuery = useQuery(transactionsQuery.stats(range));
  const listQuery = useQuery(transactionsQuery.list(range));

  return {
    stats: statsQuery.data,
    transactions: listQuery.data?.transactions ?? [],
    isLoading: statsQuery.isLoading || listQuery.isLoading,
  };
}


export function useTypeFilter(transactions: Transaction[]) {
  const [filter, setFilter] = useState<TypeFilter>("all");
  const filtered = useMemo(() => (filter === "all" ? transactions : transactions.filter((t) => t.type === filter)), [transactions, filter]);
  return { filter, setFilter, filtered };
}