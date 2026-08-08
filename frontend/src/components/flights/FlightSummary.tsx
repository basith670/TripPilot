"use client";

import {
  Plane,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

interface FlightSummaryProps {
  totalFlights: number;
  selectedFlights: number;
  totalCost: number;
}

export default function FlightSummary({
  totalFlights,
  selectedFlights,
  totalCost,
}: FlightSummaryProps) {
  return (
    <section className="mt-16">

      <div className="grid gap-6 md:grid-cols-3">

        <SummaryCard
          icon={
            <Plane
              className="text-blue-500"
              size={24}
            />
          }
          title="Total Flights"
          value={totalFlights}
          valueColor="text-blue-500"
        />

        <SummaryCard
          icon={
            <CheckCircle2
              className="text-emerald-500"
              size={24}
            />
          }
          title="Selected Flight"
          value={selectedFlights}
          valueColor="text-emerald-500"
        />

        <SummaryCard
          icon={
            <IndianRupee
              className="text-violet-500"
              size={24}
            />
          }
          title="Total Flight Cost"
          value={`₹${totalCost.toLocaleString("en-IN")}`}
          valueColor="text-violet-500"
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
        p-8
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Icon */}

      <div
        className="
          mb-6
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-muted
        "
      >
        {icon}
      </div>

      {/* Title */}

      <p
        className="
          text-sm
          font-medium
          text-muted-foreground
        "
      >
        {title}
      </p>

      {/* Value */}

      <h3
        className={`mt-4 text-5xl font-bold ${valueColor}`}
      >
        {value}
      </h3>

    </div>
  );
}