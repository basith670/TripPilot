"use client";

import Link from "next/link";

import {
  Plane,
  CalendarDays,
  Wallet,
  Users,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { Trip } from "@/types/trip";

interface TripCardProps {
  trip: Trip;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

export default function TripCard({
  trip,
  onEdit,
  onDelete,
}: TripCardProps) {
  const badge = () => {
    switch (trip.status.toLowerCase()) {
      case "planning":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";

      case "confirmed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";

      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";

      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";

      default:
        return "bg-muted text-muted-foreground";
    }
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
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-blue-500/10

                text-blue-600
                dark:text-blue-400
              "
            >
              <Plane size={24} />
            </div>

            <div>

              <h2 className="text-3xl font-bold text-foreground">
                {trip.source_airport.iata_code}
                <span className="mx-2 text-blue-600 dark:text-blue-400">
                  →
                </span>
                {trip.destination_airport.iata_code}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {trip.source_airport.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {trip.destination_airport.name}
              </p>

            </div>

          </div>

          <div
          className="
            flex
            items-center
            gap-2
            self-end
            shrink-0
          "
        >

            <span
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                ${badge()}
              `}
            >
              {trip.status}
            </span>

            <button
              onClick={() => onEdit?.(trip)}
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
              onClick={() => onDelete?.(trip)}
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
            label="Departure"
            value={trip.departure_date}
          />

          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Return"
            value={trip.return_date}
          />

          <InfoItem
            icon={<Users size={18} />}
            label="Travellers"
            value={trip.travelers}
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

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">

          <div>

            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Cabin Class
            </p>

            <p className="mt-1 font-semibold text-foreground">
              {trip.cabin_class.replaceAll("_", " ")}
            </p>

          </div>

          <Link
            href={`/trips/${trip.id}`}
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

              hover:-translate-y-0.5
              hover:shadow-blue-500/30
            "
          >
            View Trip

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>

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

          bg-blue-500/10

          text-blue-600
          dark:text-blue-400
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