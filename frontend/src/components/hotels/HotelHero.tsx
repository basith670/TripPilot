"use client";

import { Hotel, CheckCircle2, IndianRupee } from "lucide-react";

interface HotelHeroProps {
  totalHotels: number;
  reservedHotels: number;
  selectedHotels: number;
}

export default function HotelHero({
  totalHotels,
  reservedHotels,
  selectedHotels,
}: HotelHeroProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[36px]
        bg-gradient-to-r
        from-slate-900
        via-blue-900
        to-indigo-900
        p-10
        text-white
        shadow-2xl
      "
    >
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            TripPilot
          </span>

          <h1 className="mt-6 text-5xl font-black">
            Hotel Bookings
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Organize hotel reservations, bookings and stays
            for all your trips from one centralized dashboard.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <HeroCard
            icon={<Hotel size={22} />}
            label="Hotels"
            value={totalHotels}
          />

          <HeroCard
            icon={<CheckCircle2 size={22} />}
            label="Reserved"
            value={reservedHotels}
          />

          <HeroCard
            icon={<IndianRupee size={22} />}
            label="Selected"
            value={selectedHotels}
          />
        </div>
      </div>

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
    </section>
  );
}

function HeroCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/10
        p-6
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-slate-300">
          {label}
        </span>
      </div>

      <h3 className="mt-5 text-4xl font-black">
        {value}
      </h3>
    </div>
  );
}