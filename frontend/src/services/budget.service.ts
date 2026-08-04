import api from "@/lib/axios";

export interface CostByDay {
  day: number;
  cost: number;
}

export interface CostByPriority {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
}

export interface BudgetSummary {
  // Budget
  budget: number;
  total_cost: number;
  remaining_budget: number;
  budget_used_percentage: number;

  // Statistics
  total_activities: number;

  // Charts
  cost_by_day: CostByDay[];
  cost_by_priority: CostByPriority;

  // Budget Alerts
  status:
    | "SAFE"
    | "WARNING"
    | "CRITICAL"
    | "OVER_BUDGET"
    | "NO_BUDGET";

  message: string;
}

export const getBudgetSummary = async (
  tripId: string | number
): Promise<BudgetSummary> => {
  const response = await api.get<BudgetSummary>(
    `/trips/${tripId}/budget-summary/`
  );

  return response.data;
};