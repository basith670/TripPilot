"use client";

import {
  Hotel,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

interface HotelSummaryProps {
  totalHotels: number;
  selectedHotels: number;
  totalCost: number;
}

export default function HotelSummary({
  totalHotels,
  selectedHotels,
  totalCost,
}: HotelSummaryProps) {
  return (
    <section className="mt-14">
      <div className="grid gap-6 md:grid-cols-3">

        <SummaryCard
          icon={
            <Hotel
              className="text-cyan-500"
              size={22}
            />
          }
          title="Total Hotels"
          value={totalHotels}
          valueColor="text-cyan-500 dark:text-cyan-400"
        />

        <SummaryCard
          icon={
            <CheckCircle2
              className="text-emerald-500"
              size={22}
            />
          }
          title="Selected Hotel"
          value={selectedHotels}
          valueColor="text-emerald-500 dark:text-emerald-400"
        />

        <SummaryCard
          icon={
            <IndianRupee
              className="text-indigo-500"
              size={22}
            />
          }
          title="Total Cost"
          value={`₹${totalCost.toLocaleString("en-IN")}`}
          valueColor="text-indigo-500 dark:text-indigo-400"
        />

      </div>
    </section>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  valueColor: string;
}

function SummaryCard({
  icon,
  title,
  value,
  valueColor,
}: SummaryCardProps) {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-border
        bg-card
        p-7
        shadow-lg
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div
        className="
          mb-5
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-cyan-500/10
        "
      >
        {icon}
      </div>

      <p
        className="
          text-sm
          font-medium
          uppercase
          tracking-wide
          text-muted-foreground
        "
      >
        {title}
      </p>

      <h3
        className={`mt-3 text-4xl font-bold ${valueColor}`}
      >
        {value}
      </h3>
    </div>
  );
}