"use client";

import {
  Plane,
  CalendarClock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface FlightHeroProps {
  totalFlights: number;
  scheduledFlights: number;
  selectedFlights: number;
}

export default function FlightHero({
  totalFlights,
  scheduledFlights,
  selectedFlights,
}: FlightHeroProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]

        bg-gradient-to-r
        from-slate-900
        via-blue-900
        to-indigo-900

        p-8
        lg:p-10

        text-white

        shadow-2xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

      <div
        className="
          relative

          flex
          flex-col
          gap-10

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Left */}

        <div className="max-w-2xl">

          <span
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              bg-white/10

              px-4
              py-2

              text-sm
              font-semibold

              backdrop-blur
            "
          >
            <Sparkles size={16} />

            Flight Management

          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            Manage Your
            <br />
            Flight Bookings
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Organize departures, arrivals and bookings for every trip
            from one centralized dashboard with real-time flight
            management.
          </p>

        </div>

        {/* Right Stats */}

        <div className="grid grid-cols-3 gap-5 lg:w-[520px]">

          <HeroCard
            icon={<Plane size={22} />}
            label="Flights"
            value={totalFlights}
          />

          <HeroCard
            icon={<CalendarClock size={22} />}
            label="Scheduled"
            value={scheduledFlights}
          />

          <HeroCard
            icon={<CheckCircle2 size={22} />}
            label="Selected"
            value={selectedFlights}
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
}

function HeroCard({
  icon,
  label,
  value,
}: HeroCardProps) {
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
        hover:-translate-y-1
      "
    >
      <div
        className="
          mb-5

          flex
          h-12
          w-12

          items-center
          justify-center

          rounded-2xl

          bg-white/10
        "
      >
        {icon}
      </div>

      <p className="text-sm text-slate-300">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h3>

    </div>
  );
}