"use client";

import {
  Plane,
  Clock3,
  Wallet,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface FlightDetails {
  airline: string;
  airline_name?: string;
  airline_code?: string;
  airline_logo?: string;

  flight_number: string;

  departure_airport: string;
  arrival_airport: string;

  departure_time: string;
  arrival_time: string;

  departure_date?: string;
  arrival_date?: string;

  duration: string;
  duration_minutes?: number;

  stops: number;

  price: number;

  cabin_class?: string;
  baggage?: string;
  baggage_allowance?: string;

  reason?: string;
}

interface FlightRecommendationProps {
  flight: {
    outbound: FlightDetails | null;
    return: FlightDetails | null;
    total_price: number;
    reason: string;
  };
}

/* ============================================================
   FLIGHT CARD
============================================================ */

function FlightCard({
  flight,
  type,
}: {
  flight: FlightDetails;
  type: "outbound" | "return";
}) {
  const isOutbound = type === "outbound";

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

  const departureDate = new Date(
    flight.departure_time
  ).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const arrivalDate = new Date(
    flight.arrival_time
  ).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="
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
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-blue-100
              dark:bg-blue-500/15
            "
          >
            {flight.airline_logo ? (
              <img
                src={flight.airline_logo}
                alt={flight.airline}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Plane
                size={24}
                className="
                  text-blue-600
                  dark:text-blue-400
                "
              />
            )}
          </div>

          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-blue-600
                dark:text-blue-400
              "
            >
              {isOutbound
                ? "Outbound Flight"
                : "Return Flight"}
            </p>

            <h3
              className="
                mt-1
                text-xl
                font-bold
                text-foreground
              "
            >
              {flight.airline}
            </h3>

            <p className="text-sm text-muted-foreground">
              {flight.flight_number}
            </p>
          </div>
        </div>

        {/* Price */}

        <div className="sm:text-right">
          <p className="text-xs text-muted-foreground">
            Flight Price
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-black
              text-blue-600
              dark:text-blue-400
            "
          >
            ₹{(flight.price ?? 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ======================================================
          ROUTE TIMELINE
      ====================================================== */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-blue-200
          bg-blue-50
          p-6

          dark:border-blue-500/20
          dark:bg-blue-500/10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Departure */}

          <div className="min-w-[110px]">
            <p className="text-xs text-muted-foreground">
              Departure
            </p>

            <h4
              className="
                mt-1
                text-3xl
                font-black
                text-foreground
              "
            >
              {flight.departure_airport}
            </h4>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-foreground
              "
            >
              {departureTime}
            </p>

            <p className="text-xs text-muted-foreground">
              {departureDate}
            </p>
          </div>

          {/* Flight Path */}

          <div
            className="
              flex
              flex-1
              flex-col
              items-center
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-muted-foreground
              "
            >
              <Clock3 size={15} />

              <span>
                {flight.duration}
              </span>
            </div>

            <div
              className="
                my-2
                flex
                w-full
                items-center
                gap-2
              "
            >
              <div
                className="
                  h-px
                  flex-1
                  bg-blue-300
                  dark:bg-blue-500/40
                "
              />

              {isOutbound ? (
                <ArrowRight
                  size={22}
                  className="
                    text-blue-600
                    dark:text-blue-400
                  "
                />
              ) : (
                <ArrowLeft
                  size={22}
                  className="
                    text-blue-600
                    dark:text-blue-400
                  "
                />
              )}

              <div
                className="
                  h-px
                  flex-1
                  bg-blue-300
                  dark:bg-blue-500/40
                "
              />
            </div>

            <p
              className="
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} ${
                    flight.stops > 1
                      ? "Stops"
                      : "Stop"
                  }`}
            </p>
          </div>

          {/* Arrival */}

          <div
            className="
              min-w-[110px]
              md:text-right
            "
          >
            <p className="text-xs text-muted-foreground">
              Arrival
            </p>

            <h4
              className="
                mt-1
                text-3xl
                font-black
                text-foreground
              "
            >
              {flight.arrival_airport}
            </h4>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-foreground
              "
            >
              {arrivalTime}
            </p>

            <p className="text-xs text-muted-foreground">
              {arrivalDate}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          FLIGHT INFORMATION
      ====================================================== */}

      <div
        className="
          mt-5
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* Airline */}

        <div
          className="
            rounded-2xl
            bg-muted/40
            p-4
          "
        >
          <p className="text-xs text-muted-foreground">
            Airline
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {flight.airline}
          </p>
        </div>

        {/* Cabin */}

        <div
          className="
            rounded-2xl
            bg-muted/40
            p-4
          "
        >
          <p className="text-xs text-muted-foreground">
            Cabin
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {flight.cabin_class
              ?.replaceAll("_", " ") || "Economy"}
          </p>
        </div>

        {/* Baggage */}

        <div
          className="
            rounded-2xl
            bg-muted/40
            p-4
          "
        >
          <p className="text-xs text-muted-foreground">
            Baggage
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {flight.baggage ||
              flight.baggage_allowance ||
              "15 kg"}
          </p>
        </div>

        {/* Stops */}

        <div
          className="
            rounded-2xl
            bg-muted/40
            p-4
          "
        >
          <p className="text-xs text-muted-foreground">
            Stops
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {flight.stops === 0
              ? "Non-stop"
              : `${flight.stops} ${
                  flight.stops > 1
                    ? "Stops"
                    : "Stop"
                }`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function FlightRecommendation({
  flight,
}: FlightRecommendationProps) {
  console.log(
    "FLIGHT RECOMMENDATION:",
    flight
  );

  const outbound = flight?.outbound;
  const returnFlight = flight?.return;

  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-card
        p-6
        shadow-lg
        md:p-8
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex items-start gap-4">
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-blue-100
            dark:bg-blue-500/15
          "
        >
          <Plane
            size={30}
            className="
              text-blue-600
              dark:text-blue-400
            "
          />
        </div>

        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-foreground
              md:text-3xl
            "
          >
            Recommended Flights
          </h2>

          <p className="mt-1 text-muted-foreground">
            {flight.reason ||
              "Recommended flights based on your trip preferences."}
          </p>
        </div>
      </div>

      {/* ======================================================
          OUTBOUND
      ====================================================== */}

      {outbound && (
        <FlightCard
          flight={outbound}
          type="outbound"
        />
      )}

      {/* ======================================================
          RETURN SEPARATOR
      ====================================================== */}

      {outbound && returnFlight && (
        <div
          className="
            my-6
            flex
            items-center
            gap-4
          "
        >
          <div className="h-px flex-1 bg-border" />

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-muted
              px-4
              py-2
              text-sm
              font-semibold
              text-muted-foreground
            "
          >
            <ArrowLeft size={15} />

            Return Journey

            <ArrowRight size={15} />
          </div>

          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      {/* ======================================================
          RETURN
      ====================================================== */}

      {returnFlight && (
        <FlightCard
          flight={returnFlight}
          type="return"
        />
      )}

      {/* ======================================================
          TOTAL
      ====================================================== */}

      {(outbound || returnFlight) && (
        <div
          className="
            mt-6
            flex
            flex-col
            gap-4
            rounded-3xl
            border
            border-blue-200
            bg-blue-50
            p-6

            dark:border-blue-500/20
            dark:bg-blue-500/10

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
                dark:bg-slate-900
              "
            >
              <Wallet
                size={20}
                className="
                  text-green-600
                  dark:text-green-400
                "
              />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-muted-foreground
                "
              >
                Total Flight Price
              </p>

              <p className="text-xs text-muted-foreground">
                {outbound && returnFlight
                  ? "Outbound + Return"
                  : "Flight recommendation"}
              </p>
            </div>
          </div>

          <p
            className="
              text-3xl
              font-black
              text-blue-600
              dark:text-blue-400
            "
          >
            ₹
            {(flight.total_price ?? 0).toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      )}

      {/* ======================================================
          NO FLIGHT
      ====================================================== */}

      {!outbound && !returnFlight && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-border
            p-8
            text-center
          "
        >
          <Plane
            size={32}
            className="
              mx-auto
              text-muted-foreground
            "
          />

          <p className="mt-3 font-semibold text-foreground">
            No flight recommendation available
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            We could not generate a flight for this route.
          </p>
        </div>
      )}
    </div>
  );
}