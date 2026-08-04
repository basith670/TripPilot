"use client";

import { Flight } from "@/types/flight";

interface FlightCardProps {
  flight: Flight;
  onView?: (flight: Flight) => void;
  onSelect?: (flight: Flight) => void;
}

export default function FlightCard({
  flight,
  onView,
  onSelect,
}: FlightCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      {/* Airline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={flight.airline_logo}
            alt={flight.airline_name}
            className="h-12 w-12 rounded-full object-contain"
          />

          <div>
            <h3 className="text-lg font-bold">
              {flight.airline_name}
            </h3>

            <p className="text-sm text-gray-500">
              {flight.flight_number}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            flight.status === "SCHEDULED"
              ? "bg-green-100 text-green-700"
              : flight.status === "DELAYED"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {flight.status}
        </span>
      </div>

      {/* Timeline */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold">
            {new Date(
              flight.departure_datetime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {flight.source_iata}
          </p>
        </div>

        <div className="flex flex-1 items-center px-8">
          <div className="h-px flex-1 bg-gray-300"></div>

          <div className="mx-4 text-center">
            <p className="text-sm font-medium">
              {flight.duration_display}
            </p>

            <p className="text-xs text-gray-500">
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} Stop`}
            </p>
          </div>

          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">
            {new Date(
              flight.arrival_datetime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {flight.destination_iata}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <div>
          <p className="text-3xl font-bold text-blue-600">
            ₹{flight.price.toLocaleString()}
          </p>

          <p className="text-sm text-gray-500">
            {flight.cabin_class}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onView?.(flight)}
            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
          >
            Details
          </button>

          <button
            onClick={() => onSelect?.(flight)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}