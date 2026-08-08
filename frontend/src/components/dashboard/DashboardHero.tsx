"use client";

import { ReactNode } from "react";

import {
  FaPlane,
  FaWallet,
  FaCalendarAlt,
  FaTasks,
} from "react-icons/fa";

interface DashboardHeroProps {
  statistics: {
    total_trips: number;
    total_budget: number;
    total_days: number;
    total_activities: number;
  };
}

export default function DashboardHero({
  statistics,
}: DashboardHeroProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]

        bg-gradient-to-br
        from-blue-700
        via-blue-900
        to-slate-900

        p-8
        shadow-2xl

        text-white

        md:p-10
        xl:p-12

        dark:from-slate-950
        dark:via-blue-950
        dark:to-slate-900
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="absolute bottom-0 left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
        {/* Left */}

        <div className="max-w-2xl">
          <span
            className="
              inline-flex
              items-center

              rounded-full

              border
              border-white/15

              bg-white/10

              px-4
              py-2

              text-sm
              font-semibold

              backdrop-blur
            "
          >
            ✈ AI Travel Dashboard
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-6xl">
            Good Afternoon,
            <br />
            Muhammad Basith 👋
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100 dark:text-slate-300">
            Plan smarter, organize every journey effortlessly and
            manage your travel experience from one intelligent
            dashboard.
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-5 xl:w-[430px]">
          <HeroStat
            icon={<FaPlane />}
            label="Trips"
            value={statistics.total_trips}
          />

          <HeroStat
            icon={<FaWallet />}
            label="Budget"
            value={`₹${statistics.total_budget.toLocaleString(
              "en-IN"
            )}`}
            isBudget
          />

          <HeroStat
            icon={<FaCalendarAlt />}
            label="Travel Days"
            value={statistics.total_days}
          />

          <HeroStat
            icon={<FaTasks />}
            label="Activities"
            value={statistics.total_activities}
          />
        </div>
      </div>
    </section>
  );
}

interface HeroStatProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  isBudget?: boolean;
}

function HeroStat({
  icon,
  label,
  value,
  isBudget = false,
}: HeroStatProps) {
  return (
    <div
      className="
        rounded-3xl

        border
        border-white/15

        bg-white/10

        p-5

        backdrop-blur-xl

        transition-all
        duration-300

        hover:-translate-y-1
        hover:bg-white/15
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

          bg-white/15

          text-lg
          text-white
        "
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-blue-100 dark:text-slate-300">
        {label}
      </p>

      <h3
        className={
          isBudget
            ? "mt-2 break-words text-[28px] font-bold leading-tight xl:text-[32px]"
            : "mt-2 text-4xl font-bold leading-none"
        }
      >
        {value}
      </h3>
    </div>
  );
}