"use client";

import Link from "next/link";

import {
  Plane,
  CalendarDays,
  Wallet,
  Users,
  ArrowRight,
  Clock3,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

interface ItineraryCardProps {
  trip: any;
}

export default function ItineraryCard({
  trip,
}: ItineraryCardProps) {
  const departure = new Date(
    trip.departure_date
  );

  const returning = new Date(
    trip.return_date
  );

  const days = Math.max(
    1,
    Math.ceil(
      (returning.getTime() -
        departure.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <article
      className="
        group

        rounded-[32px]

        border
        border-border

        bg-card

        p-8

        shadow-xl

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-2xl

              bg-gradient-to-br
              from-blue-500/20
              to-cyan-500/20

              text-blue-500
            "
          >
            <Plane size={24} />
          </div>

          <div>

            <h2 className="text-3xl font-bold text-foreground">

              {trip.source_airport.iata_code}

              <span className="mx-2 text-blue-500">
                →
              </span>

              {trip.destination_airport.iata_code}

            </h2>

            <p className="mt-1 text-muted-foreground">

              {trip.source_airport.name}

              {" → "}

              {trip.destination_airport.name}

            </p>

          </div>

        </div>

        <StatusBadge status={trip.status} />

      </div>

      {/* Statistics */}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <InfoCard
          icon={<CalendarDays size={18} />}
          label="Departure"
          value={trip.departure_date}
        />

        <InfoCard
          icon={<Clock3 size={18} />}
          label="Duration"
          value={`${days} Days`}
        />

        <InfoCard
          icon={<Users size={18} />}
          label="Travelers"
          value={trip.travelers}
        />

        <InfoCard
          icon={<Wallet size={18} />}
          label="Budget"
          value={`₹${Number(
            trip.budget
          ).toLocaleString("en-IN")}`}
        />

      </div>

      {/* Notes */}

      {trip.notes && (

        <div
          className="
            mt-8

            rounded-2xl

            border
            border-border

            bg-background

            p-5
          "
        >
          <p className="line-clamp-2 leading-7 text-muted-foreground">

            {trip.notes}

          </p>
        </div>

      )}

            {/* Footer */}

            <div
        className="
          mt-8

          flex
          items-center
          justify-between

          border-t
          border-border

          pt-6
        "
      >
        <div>

          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Cabin
          </p>

          <p className="font-semibold text-foreground">
            {trip.cabin_class}
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
            via-cyan-600
            to-indigo-600

            px-6
            py-3

            font-semibold

            text-white

            shadow-lg

            transition-all

            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >
          Open Itinerary

          <ArrowRight size={18} />

        </Link>

      </div>

    </article>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="flex items-center gap-4">

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center

          rounded-2xl

          bg-background

          text-blue-500

          border
          border-border
        "
      >
        {icon}
      </div>

      <div>

        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>

        <p className="font-semibold text-foreground">
          {value}
        </p>

      </div>

    </div>
  );
}