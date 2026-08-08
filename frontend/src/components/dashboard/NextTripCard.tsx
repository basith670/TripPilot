"use client";

import Link from "next/link";

import {
  PlaneTakeoff,
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface Props {
  trip: {
    id: number;
    destination: string;
    iata_code: string;
    departure_date: string;
  } | null;
}

export default function NextTripCard({
  trip,
}: Props) {
  if (!trip) {
    return (
      <section
        className="
          rounded-[32px]
          border
          border-dashed
          border-border

          bg-card

          p-12

          text-center

          shadow-xl
        "
      >
        <div
          className="
            mx-auto
            mb-6

            flex
            h-20
            w-20
            items-center
            justify-center

            rounded-full

            bg-blue-100

            dark:bg-blue-500/15
          "
        >
          <PlaneTakeoff
            size={40}
            className="text-blue-600 dark:text-blue-400"
          />
        </div>

        <h2 className="text-3xl font-bold text-foreground">
          No Upcoming Trips
        </h2>

        <p className="mt-4 text-muted-foreground">
          Start planning with AI and your next
          adventure will appear here.
        </p>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        overflow-hidden

        rounded-[32px]

        border
        border-border

        bg-card

        p-8
        lg:p-10

        shadow-xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-0 left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div
        className="
          relative

          flex
          flex-col
          gap-8

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Left */}

        <div>
          <span
            className="
              inline-flex

              rounded-full

              bg-blue-100
              dark:bg-blue-500/15

              px-4
              py-2

              text-sm
              font-semibold

              text-blue-700
              dark:text-blue-300
            "
          >
            ✈ Next Journey
          </span>

          <h2
            className="
              mt-6

              text-4xl
              font-bold

              text-foreground
            "
          >
            {trip.destination}
          </h2>

          <div
            className="
              mt-6

              flex
              flex-wrap

              gap-6

              text-muted-foreground
            "
          >
            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />

              {trip.iata_code}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />

              {trip.departure_date}
            </div>
          </div>
        </div>

        {/* CTA */}

        <Link
          href={`/trips/${trip.id}`}
          className="
            group

            inline-flex
            items-center
            gap-3

            rounded-2xl

            bg-blue-600

            px-7
            py-4

            font-semibold

            text-white

            shadow-lg

            transition-all
            duration-300

            hover:-translate-y-1
            hover:bg-blue-700
            hover:shadow-xl
          "
        >
          View Trip

          <ArrowRight
            size={18}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </Link>
      </div>
    </section>
  );
}