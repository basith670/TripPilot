"use client";

import { Map, Plus } from "lucide-react";

interface Props {
  onCreate?: () => void;
}

export default function EmptyItinerary({
  onCreate,
}: Props) {
  return (
    <div
      className="
        rounded-[32px]

        border
        border-border

        bg-card

        p-16

        text-center

        shadow-2xl
      "
    >
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
          from-blue-500/15
          to-cyan-500/15

          text-blue-600
          dark:text-blue-400
        "
      >
        <Map size={42} />
      </div>

      <span
        className="
          mt-8
          inline-flex

          rounded-full

          bg-blue-500/10

          px-4
          py-2

          text-sm
          font-semibold

          text-blue-600
          dark:text-blue-400
        "
      >
        AI Travel Planner
      </span>

      <h2 className="mt-6 text-3xl font-bold text-foreground">
        No Itineraries Yet
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
        Start planning your first journey and let AI build a
        personalized itinerary complete with daily activities,
        budgeting, and travel recommendations.
      </p>

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
            via-cyan-600
            to-indigo-600

            px-7
            py-3

            font-semibold

            text-white

            shadow-lg

            transition-all

            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >
          <Plus size={18} />

          Plan Your First Trip
        </button>
      )}
    </div>
  );
}