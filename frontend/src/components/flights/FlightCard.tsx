"use client";

import { Flight } from "@/types/flight";

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
        return "bg-green-100 text-green-700";

      case "BOARDING":
        return "bg-blue-100 text-blue-700";

      case "DELAYED":
        return "bg-yellow-100 text-yellow-700";

      case "LANDED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 shadow-sm transition-all hover:shadow-lg sm:p-6 ${
        isSelected
          ? "border-2 border-blue-600 bg-blue-50"
          : "border border-gray-200 bg-white"
      }`}
    >
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
            <img
              src={flight.airline_logo}
              alt={flight.airline_name}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {flight.airline_name}
            </h3>

            <p className="text-sm text-gray-500">
              {flight.flight_number}
            </p>
          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          {isSelected && (
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              ✓ Selected
            </span>
          )}

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}
          >
            {flight.status}
          </span>

        </div>

      </div>

      {/* Timeline */}

      <div className="my-8 grid grid-cols-3 items-center gap-3">

        {/* Departure */}

        <div className="text-left">

          <p className="text-3xl font-bold">
            {departureTime}
          </p>

          <p className="mt-2 text-xl font-semibold">
            {flight.source_iata}
          </p>

        </div>

        {/* Duration */}

        <div className="flex flex-col items-center">

          <div className="w-full border-t border-dashed border-gray-300"></div>

          <div className="my-3 text-center">

            <p className="text-sm font-semibold text-gray-700">
              {flight.duration_display}
            </p>

            <p className="text-xs text-gray-500">
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} Stop${
                    flight.stops > 1 ? "s" : ""
                  }`}
            </p>

          </div>

          <div className="w-full border-t border-dashed border-gray-300"></div>

        </div>

        {/* Arrival */}

        <div className="text-right">

          <p className="text-3xl font-bold">
            {arrivalTime}
          </p>

          <p className="mt-2 text-xl font-semibold">
            {flight.destination_iata}
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="flex flex-col gap-5 border-t pt-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-3xl font-bold text-blue-600">
            ₹
            {Number(flight.price).toLocaleString(
              "en-IN"
            )}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {flight.cabin_class.replaceAll(
              "_",
              " "
            )}
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 lg:flex">

          <button
            onClick={() => onView?.(flight)}
            className="rounded-xl border border-gray-300 px-4 py-3 font-medium transition hover:bg-gray-100"
          >
            Details
          </button>

          <button
            onClick={() => onEdit?.(flight)}
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-medium text-amber-700 transition hover:bg-amber-100"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete?.(flight)}
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-medium text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>

          <button
            disabled={isSelected}
            onClick={() => onSelect?.(flight)}
            className={`rounded-xl px-5 py-3 font-medium text-white transition ${
              isSelected
                ? "cursor-not-allowed bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSelected
              ? "✓ Selected"
              : "Select"}
          </button>

        </div>

      </div>

    </div>
  );
}