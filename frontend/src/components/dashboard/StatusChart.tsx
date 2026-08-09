"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  planning: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export default function StatusChart({
  planning,
  confirmed,
  completed,
  cancelled,
}: Props) {
  const data = [
    {
      name: "Planning",
      value: planning,
      color: "#F59E0B",
    },
    {
      name: "Confirmed",
      value: confirmed,
      color: "#3B82F6",
    },
    {
      name: "Completed",
      value: completed,
      color: "#10B981",
    },
    {
      name: "Cancelled",
      value: cancelled,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  return (
    <section
      className="
        rounded-[30px]

        border
        border-border

        bg-card

        p-8

        shadow-xl
      "
    >
      {/* Header */}

      <div className="mb-8">

        <span
          className="
            rounded-full

            bg-blue-100
            dark:bg-blue-500/15

            px-4
            py-2

            text-sm
            font-semibold

            text-blue-700
            dark:text-blue-300
          "
        >
          Status Overview
        </span>

        <h2 className="mt-4 text-2xl font-bold text-foreground">
          Trip Status
        </h2>

        <p className="mt-2 text-muted-foreground">
          Distribution of your travel plans.
        </p>

      </div>

      {/* Chart */}

      <div className="h-[340px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                boxShadow:
                  "0 12px 30px rgba(0,0,0,0.15)",
              }}
            />

            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                color: "var(--foreground)",
              }}
            />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              stroke="var(--background)"
              strokeWidth={4}
              label={({ percent }) =>
                `${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>

          </PieChart>
        </ResponsiveContainer>

      </div>

    </section>
  );
}