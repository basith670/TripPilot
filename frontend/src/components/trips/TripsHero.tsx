"use client";

import {
  Plane,
  MapPinned,
  Plus,
} from "lucide-react";

interface TripsHeroProps {
  totalTrips: number;
  totalLayovers: number;
  onCreate: () => void;
}

export default function TripsHero({
  totalTrips,
  totalLayovers,
  onCreate,
}: TripsHeroProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]

        border
        border-border

        bg-gradient-to-br
        from-slate-900/95
        via-slate-800/95
        to-blue-900/95

        dark:from-slate-950
        dark:via-slate-900
        dark:to-blue-950

        p-8
        lg:p-10

        text-white

        shadow-2xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute bottom-0 left-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_55%)]" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="max-w-2xl">

          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-white/10
              bg-white/10
              px-4
              py-2
              text-sm
              font-semibold
              backdrop-blur-xl
            "
          >
            ✈ Travel Workspace
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            My Trips
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300 dark:text-slate-400">
            Manage upcoming adventures, monitor travel
            plans and keep every journey organized from
            one intelligent workspace.
          </p>

        </div>

        {/* Right */}

        <button
          type="button"
          onClick={onCreate}
          className="
            inline-flex
            items-center
            gap-3

            rounded-2xl

            bg-background
            text-foreground

            border
            border-border

            px-6
            py-4

            font-semibold

            shadow-xl

            transition-all
            duration-300

            hover:-translate-y-1
            hover:bg-accent
            hover:text-accent-foreground
            hover:shadow-2xl
          "
        >
          <Plus size={20} />

          Plan New Trip
        </button>

      </div>

      {/* Stats */}

      <div className="relative z-10 mt-10 grid gap-5 md:grid-cols-2">

        <StatCard
          icon={<Plane size={22} />}
          title="Trips"
          value={totalTrips}
        />

        <StatCard
          icon={<MapPinned size={22} />}
          title="Layovers"
          value={totalLayovers}
        />

      </div>

    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

function StatCard({
  icon,
  title,
  value,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-3xl

        border
        border-white/10

        bg-white/10

        p-6

        backdrop-blur-xl

        transition-all
        duration-300

        hover:bg-white/15
        hover:shadow-xl
      "
    >
      <div
        className="
          mb-5

          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          bg-white/10

          text-cyan-300
        "
      >
        {icon}
      </div>

      <p className="text-sm text-slate-300 dark:text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-4xl font-bold tracking-tight">
        {value}
      </h3>
    </div>
  );
}