"use client";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Wallet,
} from "lucide-react";

interface Props {
  trip: {
    id: number;
    from: string;
    to: string;
    departure_date: string;
    status: string;
    budget: number;
  };
}

const statusColor: Record<string, string> = {
  Planning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",

  Confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",

  Completed:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",

  Cancelled:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export default function RecentTripCard({
  trip,
}: Props) {
  return (
    <div
      className="
        group

        rounded-3xl

        border
        border-border

        bg-card

        p-6

        shadow-lg

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-blue-300
        hover:shadow-2xl

        dark:hover:border-blue-500/40
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm text-muted-foreground">
            Route
          </p>

          <h3
            className="
              mt-2

              flex
              items-center

              text-2xl
              font-bold

              text-foreground
            "
          >
            <span className="truncate">
              {trip.from}
            </span>

            <ArrowRight
              size={18}
              className="mx-2 shrink-0 text-blue-600 dark:text-blue-400"
            />

            <span className="truncate">
              {trip.to}
            </span>

          </h3>

        </div>

        <span
          className={`
            shrink-0

            rounded-full

            px-4
            py-2

            text-xs
            font-semibold

            ${
              statusColor[
                trip.status
              ] ??
              "bg-muted text-muted-foreground"
            }
          `}
        >
          {trip.status}
        </span>

      </div>

      <div className="mt-8 space-y-4">

        <div className="flex items-center gap-3 text-muted-foreground">

          <CalendarDays
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span>
            {trip.departure_date}
          </span>

        </div>

        <div className="flex items-center gap-3 text-muted-foreground">

          <Wallet
            size={18}
            className="text-emerald-600 dark:text-emerald-400"
          />

          <span>
            ₹
            {Number(
              trip.budget
            ).toLocaleString("en-IN")}
          </span>

        </div>

        <div className="flex items-center gap-3 text-muted-foreground">

          <MapPin
            size={18}
            className="text-rose-500 dark:text-rose-400"
          />

          <span>
            {trip.to}
          </span>

        </div>

      </div>

    </div>
  );
}