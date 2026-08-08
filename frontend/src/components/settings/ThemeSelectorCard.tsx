"use client";

import { Palette } from "lucide-react";

export default function ThemeSelectorCard() {
  return (
    <section
      className="
        rounded-[32px]
        bg-white
        p-8
        shadow-xl
      "
    >
      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-purple-100 p-4">

          <Palette
            size={28}
            className="text-purple-600"
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold">
            Appearance
          </h2>

          <p className="mt-1 text-slate-500">
            Choose your preferred theme.
          </p>

        </div>

      </div>

      <div className="mt-8">
        Coming next...
      </div>

    </section>
  );
}