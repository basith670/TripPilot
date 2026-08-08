"use client";

import { Flight } from "@/types/flight";

import {
  Plane,
  PlaneTakeoff,
} from "lucide-react";

interface FlightCardProps {
  flight: Flight;

  isSelected?: boolean;

  onView?: (flight: Flight) => void;

  onEdit?: (flight: Flight) => void;

  onDelete?: (flight: Flight) => void;

  onSelect?: (flight: Flight) => void;
}

export default function FlightCard({
  flight,
  isSelected = false,
  onView,
  onEdit,
  onDelete,
  onSelect,
}: FlightCardProps) {
  const departureTime = new Date(
    flight.departure_datetime
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const arrivalTime = new Date(
    flight.arrival_datetime
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusColor = () => {
    switch (flight.status) {
      case "SCHEDULED":
        return "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300";

      case "BOARDING":
        return "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300";

      case "DELAYED":
        return "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-300";

      case "LANDED":
        return "bg-muted text-muted-foreground";

      default:
        return "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300";
    }
  };

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
  
        rounded-[32px]
  
        border
  
        ${
          isSelected
            ? "border-blue-500 bg-blue-50/70 dark:bg-blue-500/10"
            : "border-border bg-card/90"
        }
  
        backdrop-blur-xl
  
        shadow-lg
  
        transition-all
        duration-300
  
        hover:-translate-y-1
        hover:shadow-2xl
      `}
    >
      {/* Selected Accent */}
  
      {isSelected && (
        <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-600" />
      )}
  
      <div className="p-8">
  
        {/* Header */}
  
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
  
          <div className="flex items-center gap-5">
  
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
  
                rounded-2xl
  
                bg-muted
  
                shadow-sm
              "
            >
                {flight.airline_logo ? (
                <img
                    src={flight.airline_logo}
                    alt={flight.airline_name}
                    className="h-10 w-10 object-contain"
                />
                ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                    {flight.airline_name?.slice(0, 2).toUpperCase() || "✈"}
                </div>
                )}
            </div>
  
            <div>
  
              <div className="flex items-center gap-3">
  
                <h2 className="text-2xl font-bold text-foreground">
                  {flight.airline_name}
                </h2>
  
                {isSelected && (
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Selected
                  </span>
                )}
  
              </div>
  
              <p className="mt-1 text-muted-foreground">
                Flight {flight.flight_number}
              </p>
  
            </div>
  
          </div>
  
          <div className="flex flex-wrap items-center gap-3">
  
            <span
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                ${getStatusColor()}
              `}
            >
              {flight.status}
            </span>
  
          </div>
  
        </div>
  
        {/* Timeline */}
  
        <div className="my-10">
  
          <div className="grid grid-cols-3 items-center">
  
            {/* Departure */}
  
            <div>
  
              <h3 className="text-4xl font-bold text-foreground">
                {departureTime}
              </h3>
  
              <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
                {flight.source_iata}
              </p>
  
            </div>
  
            {/* Center */}
  
            <div className="flex flex-col items-center">
  
              <p className="mb-3 text-sm font-semibold text-muted-foreground">
                {flight.duration_display}
              </p>
  
              <div className="flex w-full items-center">
  
                <div className="h-px flex-1 bg-border" />
  
                <div
                  className="
                    mx-4
  
                    rounded-full
  
                    bg-blue-100
                    dark:bg-blue-500/15
  
                    p-3
  
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  <PlaneTakeoff size={20} />
                </div>
  
                <div className="h-px flex-1 bg-border" />
  
              </div>
  
              <p className="mt-3 text-sm text-muted-foreground">
  
                {flight.stops === 0
                  ? "Non-stop"
                  : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
  
              </p>
  
            </div>
  
            {/* Arrival */}
  
            <div className="text-right">
  
              <h3 className="text-4xl font-bold text-foreground">
                {arrivalTime}
              </h3>
  
              <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
                {flight.destination_iata}
              </p>
  
            </div>
  
          </div>
  
        </div>
  
        {/* Flight Information */}
  
        <div className="grid gap-5 rounded-2xl bg-muted p-5 md:grid-cols-3">
  
          <div>
  
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Cabin
            </p>
  
            <p className="mt-2 font-semibold text-foreground">
  
              {flight.cabin_class.replaceAll("_", " ")}
  
            </p>
  
          </div>
  
          <div>
  
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Price
            </p>
  
            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
  
              ₹
              {Number(flight.price).toLocaleString("en-IN")}
  
            </p>
  
          </div>
  
          <div>
  
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Route
            </p>
  
            <p className="mt-2 font-semibold text-foreground">
  
              {flight.source_iata} → {flight.destination_iata}
  
            </p>
  
          </div>
  
        </div>

        {/* Footer */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-6

            border-t
            border-border

            pt-6

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Flight Details */}

          <div className="flex flex-wrap items-center gap-5">

            <div
              className="
                rounded-xl
                bg-muted
                px-4
                py-3
              "
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Airline
              </p>

              <p className="mt-1 font-semibold text-foreground">
                {flight.airline_name}
              </p>
            </div>

            <div
              className="
                rounded-xl
                bg-muted
                px-4
                py-3
              "
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Flight
              </p>

              <p className="mt-1 font-semibold text-foreground">
                {flight.flight_number}
              </p>
            </div>

            <div
              className="
                rounded-xl
                bg-muted
                px-4
                py-3
              "
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Stops
              </p>

              <p className="mt-1 font-semibold text-foreground">

                {flight.stops === 0
                  ? "Non-stop"
                  : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}

              </p>

            </div>

          </div>

          {/* Actions */}

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => onView?.(flight)}
              className="
                rounded-xl
                border
                border-border
                bg-card

                px-5
                py-3

                font-medium
                text-foreground

                transition-all

                hover:bg-accent
              "
            >
              Details
            </button>

            <button
              onClick={() => onEdit?.(flight)}
              className="
                rounded-xl
                border
                border-amber-200
                dark:border-amber-500/30
                bg-amber-50
                dark:bg-amber-500/10

                px-5
                py-3

                font-medium
                text-amber-700
                dark:text-amber-300

                transition-all

                hover:bg-amber-100
                dark:hover:bg-amber-500/20
              "
            >
              Edit
            </button>

            <button
              onClick={() => onDelete?.(flight)}
              className="
                rounded-xl
                border
                border-red-200
                dark:border-red-500/30
                bg-red-50
                dark:bg-red-500/10

                px-5
                py-3

                font-medium
                text-red-700
                dark:text-red-300

                transition-all

                hover:bg-red-100
                dark:hover:bg-red-500/20
              "
            >
              Delete
            </button>

            <button
              disabled={isSelected}
              onClick={() => onSelect?.(flight)}
              className={`
                rounded-xl

                px-6
                py-3

                font-semibold
                text-white

                transition-all

                ${
                  isSelected
                    ? "cursor-not-allowed bg-emerald-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {isSelected
                ? "✓ Selected"
                : "Select Flight"}
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}