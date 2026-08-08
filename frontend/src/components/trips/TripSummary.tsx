"use client";

import {
  CalendarDays,
  MapPinned,
  Wallet,
  Users,
} from "lucide-react";

interface TripSummaryProps {
  days: number;
  activities: number;
  totalCost: number;
  travelers: number;
}

export default function TripSummary({
  days,
  activities,
  totalCost,
  travelers,
}: TripSummaryProps) {
  const cards = [
    {
      title: "Days",
      value: days,
      icon: CalendarDays,
      color:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Activities",
      value: activities,
      icon: MapPinned,
      color:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Estimated Cost",
      value: `₹${totalCost.toLocaleString("en-IN")}`,
      icon: Wallet,
      color:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Travelers",
      value: travelers,
      icon: Users,
      color:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              relative
              overflow-hidden

              rounded-[28px]

              border
              border-border

              bg-card

              p-6

              shadow-lg

              transition-all
              duration-300

              hover:-translate-y-2
              hover:border-blue-500/30
              hover:shadow-2xl
            "
          >
            {/* Glow */}

            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  ${card.color}
                `}
              >
                <Icon size={26} />
              </div>

              <p className="mt-5 text-sm font-medium text-muted-foreground">
                {card.title}
              </p>

              <h3 className="mt-2 text-3xl font-bold text-foreground">
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}