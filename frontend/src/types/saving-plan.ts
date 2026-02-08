export const SavingPlanStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  PAUSED: "paused",
} as const;

export type SavingPlanStatus =
  (typeof SavingPlanStatus)[keyof typeof SavingPlanStatus];

export interface SavingPlan {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon?: string;
  deadline?: string;
  description?: string;
  status: SavingPlanStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingPlanDto {
  title: string;
  targetAmount: number;
  icon?: string;
  deadline?: string;
  description?: string;
}

export interface SavingPlanStats {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  totalSaved: number;
  totalTarget: number;
}

export interface UpdateSavingPlanDto {
  title?: string;
  targetAmount?: number;
  icon?: string;
  deadline?: Date;
  description?: string;
  currentAmount?: number;
  status?: SavingPlanStatus;
}
