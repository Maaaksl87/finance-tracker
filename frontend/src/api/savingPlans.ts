import api from "./axios";
import type {
  SavingPlan,
  CreateSavingPlanDto,
  UpdateSavingPlanDto,
  SavingPlanStats,
} from "../types";

export const getSavingPlans = async (): Promise<SavingPlan[]> => {
  const { data } = await api.get<SavingPlan[]>("/saving-plans");
  return data;
};

export const getSavingPlan = async (id: string): Promise<SavingPlan> => {
  const { data } = await api.get<SavingPlan>(`/saving-plans/${id}`);
  return data;
};

export const getSavingPlanStats = async (): Promise<SavingPlanStats> => {
  const { data } = await api.get<SavingPlanStats>("/saving-plans/stats");
  return data;
};

export const createSavingPlan = async (
  savingPlanData: CreateSavingPlanDto,
): Promise<SavingPlan> => {
  const { data } = await api.post<SavingPlan>("/saving-plans", savingPlanData);
  return data;
};

export const updateSavingPlan = async (
  id: string,
  updateData: UpdateSavingPlanDto,
): Promise<SavingPlan> => {
  const { data } = await api.patch<SavingPlan>(
    `/saving-plans/${id}`,
    updateData,
  );
  return data;
};

export const deleteSavingPlan = async (
  id: string,
): Promise<{ delete: boolean }> => {
  const { data } = await api.delete<{ delete: boolean }>(`/saving-plans/${id}`);
  return data;
};

//поповнити план
export const addFunds = async (
  id: string,
  amount: number,
): Promise<SavingPlan> => {
  const { data } = await api.post<SavingPlan>(`/saving-plans/${id}/add-funds`, {
    amount,
  });
  return data;
};

//зняти кошти з плану
export const withdrawFunds = async (
  id: string,
  amount: number,
): Promise<SavingPlan> => {
  const { data } = await api.post<SavingPlan>(`/saving-plans/${id}/withdraw`, {
    amount,
  });
  return data;
};
