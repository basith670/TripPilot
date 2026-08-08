"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface MonthlyTrip {
  month: string;
  total: number;
}

interface Props {
  data: MonthlyTrip[];
}

export default function MonthlyTripsChart({
  data,
}: Props) {
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

            bg-cyan-100
            dark:bg-cyan-500/15

            px-4
            py-2

            text-sm
            font-semibold

            text-cyan-700
            dark:text-cyan-300
          "
        >
          Monthly Overview
        </span>

        <h2 className="mt-4 text-2xl font-bold text-foreground">
          Monthly Trips
        </h2>

        <p className="mt-2 text-muted-foreground">
          Track how many trips you planned each month.
        </p>

      </div>

      {/* Chart */}

      <div className="h-[340px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(59,130,246,0.08)",
              }}
              contentStyle={{
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                boxShadow:
                  "0 12px 30px rgba(0,0,0,0.15)",
              }}
              labelStyle={{
                color: "var(--foreground)",
                fontWeight: 600,
              }}
            />

            <Bar
              dataKey="total"
              fill="#2563EB"
              radius={[10, 10, 0, 0]}
              maxBarSize={44}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </section>
  );
}