"use client";

import { Plane, Clock3, Wallet } from "lucide-react";

interface FlightRecommendationProps {
  flight: {
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    stops: number;
    price: number;
    reason: string;
  };
}

export default function FlightRecommendation({
    flight,
  }: FlightRecommendationProps) {
  
    console.log("FLIGHT OBJECT:", flight);
  
    const departureTime = new Date(
      flight.departure_time
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const arrivalTime = new Date(
    flight.arrival_time
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-card
        p-8
        shadow-lg
      "
    >
      {/* Header */}

      <div className="mb-8 flex items-center gap-4">
        <div
          className="
            rounded-2xl
            bg-blue-100
            p-4
            dark:bg-blue-500/15
          "
        >
          <Plane
            size={32}
            className="text-blue-600 dark:text-blue-400"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Recommended Flight
          </h2>

          <p className="text-muted-foreground">
            {flight.reason}
          </p>
        </div>
      </div>

      {/* Flight Summary */}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Airline */}

        <div>
          <p className="text-sm text-muted-foreground">
            Airline
          </p>

          <h3 className="mt-1 text-2xl font-bold text-foreground">
            {flight.airline}
          </h3>

          <p className="mt-1 text-muted-foreground">
            {flight.flight_number}
          </p>
        </div>

        {/* Duration */}

        <div>
          <div className="flex items-center gap-2">
            <Clock3
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />

            <span className="font-semibold text-foreground">
              Duration
            </span>
          </div>

          <p className="mt-2 text-xl text-foreground">
            {flight.duration}
          </p>

          <p className="text-muted-foreground">
            {flight.stops === 0
              ? "Non-stop"
              : `${flight.stops} Stop${
                  flight.stops > 1 ? "s" : ""
                }`}
          </p>
        </div>

        {/* Price */}

        <div>
          <div className="flex items-center gap-2">
            <Wallet
              size={18}
              className="text-green-600 dark:text-green-400"
            />

            <span className="font-semibold text-foreground">
              Price
            </span>
          </div>

          <p className="mt-2 text-3xl font-black text-blue-600 dark:text-blue-400">
          ₹{(flight.price ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Timeline */}

      <div
        className="
          mt-8
          rounded-2xl
          border
          border-blue-200
          bg-blue-50
          p-6

          dark:border-blue-500/20
          dark:bg-blue-500/10
        "
      >
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Departure */}

          <div>
            <p className="text-sm text-muted-foreground">
              Departure
            </p>

            <h3 className="text-3xl font-bold text-foreground">
              {flight.departure_airport}
            </h3>

            <p className="mt-1 font-medium text-foreground">
              {departureTime}
            </p>
          </div>

          {/* Flight Line */}

          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm text-muted-foreground">
              {flight.duration}
            </p>

            <div className="text-2xl text-blue-500">
              ─────── ✈ ───────
            </div>
          </div>

          {/* Arrival */}

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Arrival
            </p>

            <h3 className="text-3xl font-bold text-foreground">
              {flight.arrival_airport}
            </h3>

            <p className="mt-1 font-medium text-foreground">
              {arrivalTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}