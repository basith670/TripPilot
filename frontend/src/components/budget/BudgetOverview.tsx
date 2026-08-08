"use client";

import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

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
      ? "bg-red-500"
      : summary.status === "CRITICAL"
      ? "bg-orange-500"
      : summary.status === "WARNING"
      ? "bg-yellow-500"
      : summary.status === "NO_BUDGET"
      ? "bg-slate-500"
      : "bg-emerald-500";

  const alertStyle =
    summary.status === "OVER_BUDGET"
      ? "border-red-500/30 bg-red-500/10"
      : summary.status === "CRITICAL"
      ? "border-orange-500/30 bg-orange-500/10"
      : summary.status === "WARNING"
      ? "border-yellow-500/30 bg-yellow-500/10"
      : summary.status === "NO_BUDGET"
      ? "border-border bg-muted/40"
      : "border-emerald-500/30 bg-emerald-500/10";

  const alertIcon =
    summary.status === "SAFE" ? (
      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
    ) : (
      <AlertTriangle className="h-7 w-7 text-orange-400" />
    );

  return (
    <div
      className="
        rounded-[32px]
        border
        border-border
        bg-card
        p-8
        shadow-xl
      "
    >
      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <span
            className="
              inline-flex
              rounded-full
              bg-blue-500/10
              px-4
              py-2
              text-sm
              font-semibold
              text-blue-400
            "
          >
            Financial Dashboard
          </span>

          <h2 className="mt-4 text-3xl font-bold text-foreground">
            Budget Overview
          </h2>

          <p className="mt-2 text-muted-foreground">
            Track your travel expenses in real time.
          </p>

        </div>

        <div
          className="
            inline-flex
            items-center
            rounded-full
            bg-primary/10
            px-5
            py-3
            font-semibold
            text-primary
          "
        >
          {summary.total_activities} Activities
        </div>

      </div>

      {/* Alert */}

      <div
        className={`mb-8 rounded-3xl border p-6 ${alertStyle}`}
      >
        <div className="flex items-start gap-4">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-background/40
            "
          >
            {alertIcon}
          </div>

          <div>

            <h3 className="text-xl font-bold text-foreground">
              {summary.status.replaceAll("_", " ")}
            </h3>

            <p className="mt-2 text-muted-foreground">
              {summary.message}
            </p>

          </div>

        </div>
      </div>

      {/* Budget Cards */}

      <div className="grid gap-6 lg:grid-cols-3">

        <BudgetCard
          icon={<Wallet className="h-6 w-6 text-blue-400" />}
          title="Trip Budget"
          value={`₹${summary.budget.toLocaleString("en-IN")}`}
          color="bg-blue-500/10"
        />

        <BudgetCard
          icon={<TrendingUp className="h-6 w-6 text-red-400" />}
          title="Estimated Spend"
          value={`₹${summary.total_cost.toLocaleString("en-IN")}`}
          color="bg-red-500/10"
        />

        <BudgetCard
          icon={<PiggyBank className="h-6 w-6 text-emerald-400" />}
          title="Remaining Budget"
          value={`₹${summary.remaining_budget.toLocaleString("en-IN")}`}
          color="bg-emerald-500/10"
        />

      </div>

      {/* Progress */}

      <div className="mt-10">

        <div className="mb-3 flex items-center justify-between">

          <span className="font-medium text-foreground">
            Budget Utilization
          </span>

          <span className="font-semibold text-primary">
            {summary.budget_used_percentage.toFixed(1)}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-muted">

          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-xs text-muted-foreground">

          <span>0%</span>
          <span>70%</span>
          <span>90%</span>
          <span>100%</span>

        </div>

      </div>

      {/* Summary */}

      <div className="mt-10 grid gap-5 md:grid-cols-3">

        <SummaryCard
          title="Activities"
          value={summary.total_activities}
        />

        <SummaryCard
          title="Budget Used"
          value={`${summary.budget_used_percentage.toFixed(1)}%`}
        />

        <SummaryCard
          title="Current Status"
          value={summary.status.replaceAll("_", " ")}
        />

      </div>

    </div>
  );
}

interface BudgetCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  color: string;
}

function BudgetCard({
  icon,
  title,
  value,
  color,
}: BudgetCardProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-background/40
        p-6
      "
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
      >
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-foreground break-words">
        {value}
      </h3>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: React.ReactNode;
}

function SummaryCard({
  title,
  value,
}: SummaryCardProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-background/40
        p-6
      "
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <Activity className="h-5 w-5 text-primary" />
      </div>

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-foreground break-words">
        {value}
      </h3>
    </div>
  );
}