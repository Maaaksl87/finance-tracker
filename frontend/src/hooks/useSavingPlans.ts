import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSavingPlans,
  getSavingPlan,
  getSavingPlanStats,
  createSavingPlan,
  updateSavingPlan,
  deleteSavingPlan,
  addFunds,
  withdrawFunds,
} from "@/api/savingPlans";
import type {
  SavingPlan,
  CreateSavingPlanDto,
  UpdateSavingPlanDto,
  SavingPlanStats,
} from "@/types";

export const savingPlansKeys = {
  all: ["saving-plans"] as const,
  lists: () => [...savingPlansKeys.all, "list"] as const,
  detail: (id: string) => [...savingPlansKeys.all, "detail", id] as const,
  stats: () => [...savingPlansKeys.all, "stats"] as const,
};

export function useSavingPlans() {
  return useQuery({
    queryKey: savingPlansKeys.lists(),
    queryFn: getSavingPlans,
  });
}

// отримати статистику конкретного плану заощадження
export function useSavingPlan(id: string) {
  return useQuery({
    queryKey: savingPlansKeys.detail(id),
    queryFn: () => getSavingPlan(id),
    enabled: !!id,
  });
}

// отримати загальну статистику планів заощаджень
export function useSavingPlanStats() {
  return useQuery({
    queryKey: savingPlansKeys.stats(),
    queryFn: getSavingPlanStats,
  });
}

export function useCreateSavingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSavingPlanDto) => createSavingPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.stats(),
      });
    },
    onError: (error) => {
      console.error("Помилка створення:", error);
    },
  });
}

export function useUpdateSavingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSavingPlanDto }) =>
      updateSavingPlan(id, data),

    onSuccess: (newPlan, variables) => {
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.stats(),
      });
    },
  });
}

export function useDeleteSavingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSavingPlan(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.stats(),
      });
    },
  });
}

export function useAddFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      addFunds(id, amount),

    // Оптимістичне оновлення
    onMutate: async ({ id, amount }) => {
      // Скасувати попередні запити
      await queryClient.cancelQueries({
        queryKey: savingPlansKeys.detail(id),
      });
      await queryClient.cancelQueries({
        queryKey: savingPlansKeys.lists(),
      });

      // Зберегти попередній стан
      const previousPlan = queryClient.getQueryData<SavingPlan>(
        savingPlansKeys.detail(id),
      );

      // Оптимістично оновити UI
      if (previousPlan) {
        queryClient.setQueryData<SavingPlan>(savingPlansKeys.detail(id), {
          ...previousPlan,
          currentAmount: previousPlan.currentAmount + amount,
        });
      }

      return { previousPlan };
    },

    onError: (err, variables, context) => {
      if (context?.previousPlan) {
        queryClient.setQueryData(
          savingPlansKeys.detail(variables.id),
          context.previousPlan,
        );
      }
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.stats(),
      });
    },
  });
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      withdrawFunds(id, amount),

    onMutate: async ({ id, amount }) => {
      await queryClient.cancelQueries({
        queryKey: savingPlansKeys.detail(id),
      });

      const previousPlan = queryClient.getQueryData<SavingPlan>(
        savingPlansKeys.detail(id),
      );

      if (previousPlan) {
        queryClient.setQueryData<SavingPlan>(savingPlansKeys.detail(id), {
          ...previousPlan,
          currentAmount: previousPlan.currentAmount - amount,
        });
      }

      return { previousPlan };
    },

    onError: (err, variables, context) => {
      if (context?.previousPlan) {
        queryClient.setQueryData(
          savingPlansKeys.detail(variables.id),
          context.previousPlan,
        );
      }
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: savingPlansKeys.stats(),
      });
    },
  });
}
