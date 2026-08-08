"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Plane,
  CalendarDays,
  Wallet,
  Coffee,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";

interface Props {
  trip: any;
  onDelete: (trip: any) => void;
}

export default function LayoverTripCard({
  trip,
  onDelete,
}: Props) {
  const router = useRouter();

  const handleEdit = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/planner?edit=${trip.id}`);
  };

  const handleDelete = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onDelete(trip);
  };

  return (
    <article
      className="
        group
        relative
        overflow-hidden

        rounded-[30px]

        border
        border-border

        bg-card

        p-7

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
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <Link
        href={`/layover-trips/${trip.id}`}
        className="relative z-10 block"
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-5">

          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-indigo-500/10

                text-indigo-600
                dark:text-indigo-400
              "
            >
              <Plane size={24} />
            </div>

            <div>

              <h2 className="text-3xl font-bold text-foreground">
                {trip.departure_airport}

                <span className="mx-2 text-blue-600 dark:text-blue-400">
                  →
                </span>

                {trip.destination_airport}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Layover at{" "}
                <span className="font-medium text-foreground">
                  {trip.layover_airport}
                </span>
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <span
              className="
                rounded-full

                bg-violet-100
                px-4
                py-2

                text-sm
                font-semibold
                text-violet-700

                dark:bg-violet-500/15
                dark:text-violet-300
              "
            >
              LAYOVER
            </span>

            <button
              onClick={handleEdit}
              className="
                rounded-xl
                p-2.5

                text-muted-foreground

                transition-all

                hover:bg-muted
                hover:text-blue-600
                dark:hover:text-blue-400
              "
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={handleDelete}
              className="
                rounded-xl
                p-2.5

                text-red-500

                transition-all

                hover:bg-red-500/10
              "
            >
              <Trash2 size={18} />
            </button>

          </div>

        </div>

        {/* Details */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">

          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Arrival"
            value={trip.arrival_date}
          />

          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Departure"
            value={trip.departure_date}
          />

          <InfoItem
            icon={<Coffee size={18} />}
            label="Travel Style"
            value={trip.travel_style}
          />

          <InfoItem
            icon={<Wallet size={18} />}
            label="Budget"
            value={`₹${Number(
              trip.budget
            ).toLocaleString("en-IN")}`}
            highlight
          />

        </div>

        {/* AI Summary */}

        <div
          className="
            mt-8

            rounded-3xl

            border
            border-border

            bg-muted/40

            p-6
          "
        >

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI Layover Plan
          </p>

          <p className="mt-4 leading-7 text-foreground/80">
            {trip.ai_result?.summary ||
              "AI-generated layover itinerary available."}
          </p>

        </div>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">

          <div>

            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Layover Airport
            </p>

            <p className="mt-1 font-semibold text-foreground">
              {trip.layover_airport}
            </p>

          </div>

          <span
            className="
              inline-flex
              items-center
              gap-2

              rounded-2xl

              bg-gradient-to-r
              from-blue-600
              to-indigo-600

              px-6
              py-3

              font-semibold
              text-white

              shadow-lg

              transition-all
              duration-300

              group-hover:-translate-y-0.5
              group-hover:shadow-blue-500/30
            "
          >
            View Details

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </span>

        </div>

      </Link>

    </article>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function InfoItem({
  icon,
  label,
  value,
  highlight = false,
}: InfoItemProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-4

        rounded-2xl

        border
        border-border

        bg-muted/40

        p-4
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center

          rounded-xl

          bg-indigo-500/10

          text-indigo-600
          dark:text-indigo-400
        "
      >
        {icon}
      </div>

      <div>

        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p
          className={`mt-1 font-semibold ${
            highlight
              ? "text-blue-600 dark:text-blue-400"
              : "text-foreground"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}