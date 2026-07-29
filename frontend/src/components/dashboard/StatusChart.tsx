"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  planning: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

const COLORS = [
  "#FACC15",
  "#22C55E",
  "#3B82F6",
  "#EF4444",
];

export default function StatusChart({
  planning,
  confirmed,
  completed,
  cancelled,
}: Props) {
    const data = [
        { name: "Planning", value: planning, color: "#FACC15" },
        { name: "Confirmed", value: confirmed, color: "#22C55E" },
        { name: "Completed", value: completed, color: "#3B82F6" },
        { name: "Cancelled", value: cancelled, color: "#EF4444" },
      ].filter((item) => item.value > 0);;

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Trip Status
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />

            <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius="70%"
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
    </div>
  );
}