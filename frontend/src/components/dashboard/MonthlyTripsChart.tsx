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

export default function MonthlyTripsChart({ data }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Monthly Trips
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              fill="#3B82F6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}