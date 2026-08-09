"use client";

import { useEffect, useState } from "react";

import { Palette } from "lucide-react";

import { useAppTheme } from "@/hooks/useAppTheme";

export default function AppearanceCard() {
  const {
    theme,
    changeTheme,
    loading,
  } = useAppTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section
      className="
        rounded-[32px]
        bg-white
        p-8
        shadow-xl
        transition-colors
        dark:bg-slate-900
      "
    >
      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-purple-100 p-4 dark:bg-purple-900/30">

          <Palette
            size={28}
            className="text-purple-600"
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Choose how TripPilot looks.
          </p>

        </div>

      </div>

      {/* Theme Options */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <ThemeButton
          emoji="☀️"
          title="Light"
          active={theme === "light"}
          disabled={loading}
          onClick={() =>
            changeTheme("light")
          }
        />

        <ThemeButton
          emoji="🌙"
          title="Dark"
          active={theme === "dark"}
          disabled={loading}
          onClick={() =>
            changeTheme("dark")
          }
        />

        <ThemeButton
          emoji="💻"
          title="System"
          active={theme === "system"}
          disabled={loading}
          onClick={() =>
            changeTheme("system")
          }
        />

      </div>

    </section>
  );
}

interface ThemeButtonProps {
  emoji: string;
  title: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

function ThemeButton({
  emoji,
  title,
  active,
  disabled,
  onClick,
}: ThemeButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        rounded-3xl
        border-2
        p-8
        transition-all

        disabled:opacity-50

        ${
          active
            ? "border-blue-600 bg-blue-50 dark:border-cyan-400 dark:bg-cyan-500/10"
            : "border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-cyan-500"
        }
      `}
    >
      <div className="text-5xl">
        {emoji}
      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {title} Mode
      </p>

    </button>
  );
}