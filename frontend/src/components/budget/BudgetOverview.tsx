"use client";

import { BudgetSummary } from "@/services/budget.service";

interface BudgetOverviewProps {
  summary: BudgetSummary;
}

export default function BudgetOverview({
  summary,
}: BudgetOverviewProps) {
  const percentage = Math.min(
    summary.budget_used_percentage,
    100
  );

  const progressColor =
    summary.status === "OVER_BUDGET"
      ? "bg-red-600"
      : summary.status === "CRITICAL"
      ? "bg-orange-500"
      : summary.status === "WARNING"
      ? "bg-yellow-500"
      : summary.status === "NO_BUDGET"
      ? "bg-gray-400"
      : "bg-green-600";

  const alertStyle =
    summary.status === "OVER_BUDGET"
      ? "border-red-300 bg-red-50"
      : summary.status === "CRITICAL"
      ? "border-orange-300 bg-orange-50"
      : summary.status === "WARNING"
      ? "border-yellow-300 bg-yellow-50"
      : summary.status === "NO_BUDGET"
      ? "border-gray-300 bg-gray-50"
      : "border-green-300 bg-green-50";

  const alertIcon =
    summary.status === "OVER_BUDGET"
      ? "🚨"
      : summary.status === "CRITICAL"
      ? "⚠️"
      : summary.status === "WARNING"
      ? "🟡"
      : summary.status === "NO_BUDGET"
      ? "ℹ️"
      : "✅";

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            💰 Budget Overview
          </h2>

          <p className="mt-1 text-gray-500">
            Track your travel expenses in real time.
          </p>
        </div>

        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {summary.total_activities} Activities
        </div>
      </div>

      {/* Budget Alert */}
      <div
        className={`mb-8 rounded-xl border p-5 ${alertStyle}`}
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl">
            {alertIcon}
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {summary.status
                .replaceAll("_", " ")
                .toUpperCase()}
            </h3>

            <p className="mt-1 text-gray-700">
              {summary.message}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-6">
          <p className="text-sm text-gray-500">
            Trip Budget
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-700">
            ₹{summary.budget.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="rounded-xl bg-red-50 p-6">
          <p className="text-sm text-gray-500">
            Estimated Spend
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-700">
            ₹{summary.total_cost.toLocaleString(
              "en-IN"
            )}
          </h3>
        </div>

        <div className="rounded-xl bg-green-50 p-6">
          <p className="text-sm text-gray-500">
            Remaining Budget
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-700">
            ₹
            {summary.remaining_budget.toLocaleString(
              "en-IN"
            )}
          </h3>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between text-sm font-medium">
          <span>Budget Used</span>

          <span>
            {summary.budget_used_percentage.toFixed(
              1
            )}
            %
          </span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>0%</span>

          <span>70%</span>

          <span>90%</span>

          <span>100%</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Total Activities
          </p>

          <p className="mt-1 text-xl font-bold">
            {summary.total_activities}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Budget Utilization
          </p>

          <p className="mt-1 text-xl font-bold">
            {summary.budget_used_percentage.toFixed(
              1
            )}
            %
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Current Status
          </p>

          <p className="mt-1 text-xl font-bold">
            {summary.status.replaceAll(
              "_",
              " "
            )}
          </p>
        </div>
      </div>
    </div>
  );
}