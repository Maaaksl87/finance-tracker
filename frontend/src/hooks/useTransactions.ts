import { createTransaction, deleteTransaction, getTransactions, getTransactionStats } from "@/api/transactions";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { sourcesKeys } from "./useSources";

export const transactionsKey = {
  all: ["transactions"] as const,
  stats: (startDate?: string, endDate?: string) =>
    [...transactionsKey.all, "stats", startDate, endDate],
  list: (startDate?: string, endDate?: string, limit?: number) =>
    [...transactionsKey.all, "list", startDate, endDate, limit],
};

export const transactionsQuery = {
  stats: ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}) => ({
    queryKey: transactionsKey.stats(startDate, endDate),
    queryFn: () => getTransactionStats({ startDate, endDate }),
  }),
  list: (
    { startDate, endDate, limit }: { startDate?: string; endDate?: string; limit?: number } = {},
  ) => ({
    queryKey: transactionsKey.list(startDate, endDate, limit),
    queryFn: () => getTransactions({ startDate, endDate, limit }),
  }),
};
export function useTransactions(limit?: number) {
  const { data, isLoading, error } = useQuery(transactionsQuery.list({ limit }));
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

export function useTransactionStats() {
  const statsQuery = useQuery(transactionsQuery.stats());
  const listQuery = useQuery(transactionsQuery.list({ limit: 100 }));

  return {
    stats: statsQuery.data,
    transactions: listQuery.data?.transactions ?? [],
    isLoading: statsQuery.isLoading || listQuery.isLoading,
  };
}
