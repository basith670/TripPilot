"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plane,
  Loader2,
  LucideIcon,
} from "lucide-react";

import { Airport } from "@/types/airport";
import { searchAirports } from "@/lib/airportService";

interface AirportAutocompleteProps {
  label: string;
  value: string;
  placeholder?: string;
  icon?: LucideIcon;
  onSelect: (airport: Airport) => void;
}

export default function AirportAutocomplete({
  label,
  value,
  placeholder,
  icon: Icon,
  onSelect,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value);

  const [airports, setAirports] = useState<Airport[]>([]);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // Search

  useEffect(() => {
    if (!query.trim()) {
      setAirports([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const results = await searchAirports(query);
        setAirports(results);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      {/* Label */}

      <label className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>

      {/* Input */}

      <div className="relative">

        {Icon && (
          <Icon
            size={20}
            className="
              absolute
              left-4
              top-1/2
              z-10
              -translate-y-1/2

              text-blue-600
              dark:text-blue-400
            "
          />
        )}

        <input
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          className="
            h-14
            w-full

            rounded-2xl

            border
            border-border

            bg-background

            pl-12
            pr-12

            text-base
            text-foreground

            placeholder:text-muted-foreground

            transition-all
            duration-300

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/20
            focus:outline-none
          "
        />

        {loading && (
          <Loader2
            size={18}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2

              animate-spin

              text-blue-600
              dark:text-blue-400
            "
          />
        )}

      </div>

      {/* Dropdown */}

      {open && airports.length > 0 && (
        <div
          className="
            absolute
            z-50

            mt-2

            max-h-80
            w-full

            overflow-y-auto

            rounded-2xl

            border
            border-border

            bg-card

            shadow-2xl
          "
        >
          {airports.map((airport) => (
            <button
              key={airport.id}
              type="button"
              onClick={() => {
                setQuery(
                  `${airport.city} (${airport.iata_code})`
                );

                setOpen(false);

                onSelect(airport);
              }}
              className="
                flex
                w-full
                items-center
                gap-4

                border-b
                border-border

                p-4

                text-left

                transition-all
                duration-200

                hover:bg-accent
              "
            >
              <Plane
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />

              <div className="flex-1">

                <p className="font-semibold text-foreground">
                  {airport.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {airport.city}, {airport.country}
                </p>

              </div>

              <span
                className="
                  rounded-lg

                  bg-blue-100
                  dark:bg-blue-500/20

                  px-2.5
                  py-1

                  text-xs
                  font-bold

                  text-blue-700
                  dark:text-blue-300
                "
              >
                {airport.iata_code}
              </span>

            </button>
          ))}
        </div>
      )}
    </div>
  );
}