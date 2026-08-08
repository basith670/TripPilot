"use client";

import {
  FaClock,
  FaCheckCircle,
  FaFlagCheckered,
  FaTimesCircle,
} from "react-icons/fa";

interface TripStatusCardProps {
  title: string;
  value: number;
  gradient?: string;
}

export default function TripStatusCard({
  title,
  value,
}: TripStatusCardProps) {
  const getConfig = () => {
    switch (title) {
      case "Planning":
        return {
          icon: <FaClock />,
          color: "text-amber-500 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-500/15",
          border: "hover:border-amber-400/40",
        };

      case "Confirmed":
        return {
          icon: <FaCheckCircle />,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-100 dark:bg-emerald-500/15",
          border: "hover:border-emerald-400/40",
        };

      case "Completed":
        return {
          icon: <FaFlagCheckered />,
          color: "text-blue-600 dark:text-cyan-400",
          bg: "bg-blue-100 dark:bg-cyan-500/15",
          border: "hover:border-cyan-400/40",
        };

      case "Cancelled":
        return {
          icon: <FaTimesCircle />,
          color: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-100 dark:bg-rose-500/15",
          border: "hover:border-rose-400/40",
        };

      default:
        return {
          icon: <FaClock />,
          color: "text-slate-600 dark:text-slate-300",
          bg: "bg-slate-100 dark:bg-slate-700",
          border: "hover:border-blue-400/40",
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`
        rounded-3xl
        border
        border-border
        bg-card

        p-6

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-xl

        ${config.border}
      `}
    >
      <div
        className={`
          mb-5
          flex
          h-12
          w-12
          items-center
          justify-center

          rounded-2xl

          text-xl

          ${config.bg}
          ${config.color}
        `}
      >
        {config.icon}
      </div>

      <p className="text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-2 text-4xl font-bold text-foreground">
        {value}
      </h3>
    </div>
  );
}