"use client";

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const styles = {
    planning: {
      bg: "bg-amber-500/15",
      text: "text-amber-300",
      border: "border-amber-500/30",
      icon: (
        <Clock3
          size={15}
          className="text-amber-300"
        />
      ),
    },

    confirmed: {
      bg: "bg-blue-500/15",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
      icon: (
        <CheckCircle2
          size={15}
          className="text-cyan-300"
        />
      ),
    },

    completed: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      icon: (
        <CheckCircle2
          size={15}
          className="text-emerald-300"
        />
      ),
    },

    cancelled: {
      bg: "bg-red-500/15",
      text: "text-red-300",
      border: "border-red-500/30",
      icon: (
        <XCircle
          size={15}
          className="text-red-300"
        />
      ),
    },

    default: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
      icon: (
        <AlertCircle
          size={15}
          className="text-muted-foreground"
        />
      ),
    },
  };

  const style =
    styles[
      normalized as keyof typeof styles
    ] ?? styles.default;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2

        rounded-full

        border
        ${style.border}

        ${style.bg}

        px-4
        py-2

        text-sm
        font-semibold

        ${style.text}

        backdrop-blur-xl
      `}
    >
      {style.icon}

      {status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) =>
          c.toUpperCase()
        )}
    </span>
  );
}