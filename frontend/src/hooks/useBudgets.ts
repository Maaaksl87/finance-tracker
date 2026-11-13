import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import {
  createBudget,
  deleteBudget,
  getBudgets,
  getBudgetStatuses,
  updateBudget,
} from "@/api/budgets";
import type { CreateBudgetDto, UpdateBudgetDto } from "@/types";

export const budgetsKeys = {
  all: ["budgets"] as const,
  status: (monthKey: string) => ["budgets", "status", monthKey] as const,
};

export function useBudgetStatuses(monthDate: Date) {
  const monthKey = format(monthDate, "yyyy-MM");

  const { data, isLoading, error } = useQuery({
    queryKey: budgetsKeys.status(monthKey),
    queryFn: () => getBudgetStatuses(monthKey),
  });

  return {
    budgets: data ?? [],
    isLoading,
    error,
    monthKey,
  };
}

export function useBudgetsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: budgetsKeys.all,
    queryFn: getBudgets,
  });

  return { budgets: data ?? [], isLoading, error };
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateBudgetDto) => createBudget(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBudgetDto }) => updateBudget(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

