"use client";

import {
  PlaneTakeoff,
  Plus,
} from "lucide-react";

interface EmptyFlightsProps {
  onCreate?: () => void;
}

export default function EmptyFlights({
  onCreate,
}: EmptyFlightsProps) {
  return (
    <div
      className="
        rounded-[32px]

        border
        border-dashed
        border-border

        bg-card

        p-16

        text-center

        shadow-xl
      "
    >
      {/* Icon */}

      <div
        className="
          mx-auto

          flex
          h-24
          w-24

          items-center
          justify-center

          rounded-full

          bg-gradient-to-br
          from-blue-600/10
          via-cyan-500/10
          to-indigo-600/10

          ring-1
          ring-cyan-500/20
        "
      >
        <PlaneTakeoff
          size={42}
          className="text-cyan-500"
        />
      </div>

      {/* Title */}

      <h2
        className="
          mt-8

          text-4xl
          font-bold

          text-foreground
        "
      >
        No Flights Found
      </h2>

      {/* Description */}

      <p
        className="
          mx-auto
          mt-5

          max-w-xl

          leading-8

          text-muted-foreground
        "
      >
        You haven't added any flights yet.
        Select a trip and create your first
        flight itinerary to begin planning
        your journey.
      </p>

      {/* Button */}

      {onCreate && (
        <button
          onClick={onCreate}
          className="
            mt-10

            inline-flex
            items-center
            gap-2

            rounded-2xl

            bg-gradient-to-r
            from-blue-600
            via-cyan-500
            to-indigo-600

            px-7
            py-3

            font-semibold
            text-white

            shadow-lg

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <Plus size={18} />

          Add Flight
        </button>
      )}
    </div>
  );
}