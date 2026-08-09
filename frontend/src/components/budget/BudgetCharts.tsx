"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
 CartesianGrid,
  Legend,
} from "recharts";

import { BudgetSummary } from "@/services/budget.service";

interface Props {
  summary: BudgetSummary;
}

const COLORS = [
  "#2563eb", // Blue
  "#f59e0b", // Orange
  "#16a34a", // Green
];

const formatCurrency = (value: number) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

export default function BudgetCharts({
  summary,
}: Props) {
  const dayData = summary.cost_by_day;

  const priorityData = Object.entries(
    summary.cost_by_priority
  ).map(([priority, cost]) => ({
    name: priority,
    value: Number(cost),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Cost by Day */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold">
          📊 Cost by Day
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(value) =>
                `₹${Number(value) / 1000}k`
              }
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Legend />

            <Bar
              dataKey="cost"
              name="Cost"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost by Priority */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold">
          🥧 Cost by Priority
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, percent }) =>
                `${name} ${(percent! * 100).toFixed(0)}%`
              }
            >
              {priorityData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}