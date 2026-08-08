"use client";

import {
  Map,
  CalendarDays,
  Sparkles,
  Plane,
} from "lucide-react";

interface ItineraryHeroProps {
  totalTrips: number;
  upcomingTrips: number;
  totalActivities?: number;
}

export default function ItineraryHero({
  totalTrips,
  upcomingTrips,
  totalActivities,
}: ItineraryHeroProps) {
  return (
    <section
      className="
        relative
        overflow-hidden

        rounded-[36px]

        bg-gradient-to-br
        from-slate-950
        via-blue-950
        to-indigo-950

        p-8
        lg:p-12

        text-white

        shadow-2xl
      "
    >
      {/* Background Effects */}

      <div className="absolute -top-28 -right-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-12 xl:flex-row xl:items-center xl:justify-between">

        {/* Left */}

        <div className="max-w-3xl">

          <span
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-white/10

              bg-white/10

              px-5
              py-2.5

              text-sm
              font-semibold

              backdrop-blur-xl
            "
          >
            <Sparkles size={16} />

            AI Powered Trip Management

          </span>

          <h1
            className="
              mt-8

              text-4xl
              font-extrabold
              leading-tight

              md:text-6xl
            "
          >
            Plan.

            <span className="text-cyan-300">
              {" "}Travel.
            </span>

            <br />

            Explore.

          </h1>

          <p
            className="
              mt-6

              max-w-2xl

              text-lg

              leading-8

              text-slate-300
            "
          >
            Manage every itinerary, organize travel plans,
            monitor activities and keep every journey perfectly
            planned from one beautiful dashboard.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-2xl

                bg-white/10

                px-5
                py-3

                backdrop-blur-xl
              "
            >
              <Plane size={18} />

              Smart Travel Planner

            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-2xl

                bg-cyan-500/20

                px-5
                py-3

                text-cyan-200

                backdrop-blur-xl
              "
            >
              AI Recommendations

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:w-[520px]">

          <HeroCard
            icon={<Map size={24} />}
            label="Trips"
            value={totalTrips}
            color="from-blue-500 to-cyan-500"
          />

          <HeroCard
            icon={<CalendarDays size={24} />}
            label="Upcoming"
            value={upcomingTrips}
            color="from-violet-500 to-indigo-500"
          />

          <HeroCard
            icon={<Sparkles size={24} />}
            label="Activities"
            value={totalActivities ?? 0}
            color="from-emerald-500 to-teal-500"
          />

        </div>

      </div>
    </section>
  );
}

interface HeroCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function HeroCard({
  icon,
  label,
  value,
  color,
}: HeroCardProps) {
  return (
    <div
      className="
        group

        rounded-[30px]

        border
        border-white/10

        bg-white/10

        p-6

        backdrop-blur-xl

        transition-all
        duration-300

        hover:-translate-y-2
        hover:bg-white/15
      "
    >
      <div
        className={`
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          bg-gradient-to-r
          ${color}

          shadow-lg
        `}
      >
        {icon}
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-slate-300">
        {label}
      </p>

      <h3 className="mt-2 text-4xl font-bold">
        {value}
      </h3>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">

        <div
          className={`
            h-full
            rounded-full
            bg-gradient-to-r
            ${color}
          `}
          style={{ width: "70%" }}
        />

      </div>

    </div>
  );
}