"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Plane,
  ArrowRight,
  ArrowLeft,
  Clock3,
  Wallet,
  Luggage,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import BudgetOverview from "@/components/budget/BudgetOverview";
import ItinerarySection from "@/components/itinerary/ItinerarySection";

import {
  getBudgetSummary,
  BudgetSummary,
} from "@/services/budget.service";

import { getTrip } from "@/services/trips.service";

import { Trip } from "@/types/trip";

/* ============================================================
   FLIGHT TYPE
============================================================ */

interface SavedFlight {
  id?: number;

  airline?: {
    id?: number;
    name?: string;
    code?: string;
    logo?: string;
  };

  airline_name?: string;
  airline_code?: string;
  airline_logo?: string;

  flight_type?: "OUTBOUND" | "RETURN";

  flight_number: string;

  source_airport?: {
    id?: number;
    name?: string;
    iata_code?: string;
    city?: string;
  };

  destination_airport?: {
    id?: number;
    name?: string;
    iata_code?: string;
    city?: string;
  };

  departure_airport?: string;
  arrival_airport?: string;

  departure_datetime?: string;
  arrival_datetime?: string;

  departure_time?: string;
  arrival_time?: string;

  duration_minutes?: number;

  duration?: string;

  cabin_class?: string;

  price?: number | string;

  stops?: number;

  baggage_allowance?: string;
  baggage?: string;

  aircraft?: string;

  terminal?: string;

  gate?: string;

  refundable?: boolean;

  status?: string;
}

/* ============================================================
   FLIGHT CARD
============================================================ */

function SavedFlightCard({
  flight,
  type,
}: {
  flight: SavedFlight;
  type: "OUTBOUND" | "RETURN";
}) {
  const isOutbound = type === "OUTBOUND";

  /* ----------------------------------------------------------
     AIRLINE
  ---------------------------------------------------------- */

  const airlineName =
    flight.airline?.name ||
    flight.airline_name ||
    "Airline";

  const airlineCode =
    flight.airline?.code ||
    flight.airline_code ||
    "";

  const airlineLogo =
    flight.airline?.logo ||
    flight.airline_logo ||
    "";

  /* ----------------------------------------------------------
     AIRPORTS
  ---------------------------------------------------------- */

  const departureAirport =
    flight.source_airport?.iata_code ||
    flight.departure_airport ||
    "—";

  const arrivalAirport =
    flight.destination_airport?.iata_code ||
    flight.arrival_airport ||
    "—";

  const departureAirportName =
    flight.source_airport?.name ||
    "";

  const arrivalAirportName =
    flight.destination_airport?.name ||
    "";

  /* ----------------------------------------------------------
     DATETIME
  ---------------------------------------------------------- */

  const departureDateTime =
    flight.departure_datetime ||
    flight.departure_time;

  const arrivalDateTime =
    flight.arrival_datetime ||
    flight.arrival_time;

  const departureDate = departureDateTime
    ? new Date(
        departureDateTime
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const arrivalDate = arrivalDateTime
    ? new Date(
        arrivalDateTime
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const departureTime = departureDateTime
    ? new Date(
        departureDateTime
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const arrivalTime = arrivalDateTime
    ? new Date(
        arrivalDateTime
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  /* ----------------------------------------------------------
     DURATION
  ---------------------------------------------------------- */

  const getDuration = () => {
    if (flight.duration) {
      return flight.duration;
    }

    if (
      flight.duration_minutes !== undefined
    ) {
      const hours = Math.floor(
        flight.duration_minutes / 60
      );

      const minutes =
        flight.duration_minutes % 60;

      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      }

      if (hours > 0) {
        return `${hours}h`;
      }

      return `${minutes}m`;
    }

    if (
      departureDateTime &&
      arrivalDateTime
    ) {
      const difference =
        new Date(
          arrivalDateTime
        ).getTime() -
        new Date(
          departureDateTime
        ).getTime();

      const minutes = Math.max(
        Math.round(
          difference / 60000
        ),
        0
      );

      const hours = Math.floor(
        minutes / 60
      );

      const remainingMinutes =
        minutes % 60;

      if (
        hours > 0 &&
        remainingMinutes > 0
      ) {
        return `${hours}h ${remainingMinutes}m`;
      }

      if (hours > 0) {
        return `${hours}h`;
      }

      return `${remainingMinutes}m`;
    }

    return "—";
  };

  const duration = getDuration();

  /* ----------------------------------------------------------
     STOPS
  ---------------------------------------------------------- */

  const stops = Number(
    flight.stops ?? 0
  );

  const stopsLabel =
    stops === 0
      ? "Non-stop"
      : `${stops} ${
          stops > 1
            ? "Stops"
            : "Stop"
        }`;

  /* ----------------------------------------------------------
     CABIN
  ---------------------------------------------------------- */

  const cabinClass =
    flight.cabin_class
      ?.replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (character) =>
          character.toUpperCase()
      ) || "Economy";

  /* ----------------------------------------------------------
     PRICE
  ---------------------------------------------------------- */

  const price = Number(
    flight.price ?? 0
  );

  /* ----------------------------------------------------------
     BAGGAGE
  ---------------------------------------------------------- */

  const baggage =
    flight.baggage_allowance ||
    flight.baggage ||
    "—";

  return (
    <div
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-border
        bg-card
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* ======================================================
          FLIGHT HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border
          p-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div className="flex items-center gap-4">
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
            {airlineLogo ? (
              <img
                src={airlineLogo}
                alt={airlineName}
                className="
                  h-9
                  w-9
                  object-contain
                "
              />
            ) : (
              <Plane
                size={28}
                className="
                  text-blue-600
                  dark:text-blue-400
                "
              />
            )}
          </div>

          <div>
            <span
              className="
                inline-flex
                rounded-full
                bg-blue-100
                px-3
                py-1
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-blue-700
                dark:bg-blue-500/15
                dark:text-blue-300
              "
            >
              {isOutbound
                ? "Outbound Flight"
                : "Return Flight"}
            </span>

            <h3
              className="
                mt-2
                text-xl
                font-bold
                text-foreground
              "
            >
              {airlineName}
            </h3>

            <p className="text-sm text-muted-foreground">
              {airlineCode
                ? `${airlineCode} · `
                : ""}
              {flight.flight_number}
            </p>
          </div>
        </div>

        {/* Price */}

        <div className="md:text-right">
          <p className="text-xs text-muted-foreground">
            Flight Price
          </p>

          <p
            className="
              mt-1
              text-3xl
              font-black
              text-blue-600
              dark:text-blue-400
            "
          >
            ₹
            {price.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      </div>

      {/* ======================================================
          ROUTE
      ====================================================== */}

      <div className="p-6">
        <div
          className="
            rounded-3xl
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
              gap-8
              lg:flex-row
              lg:items-center
            "
          >
            {/* Departure */}

            <div
              className="
                min-w-[150px]
                lg:flex-1
              "
            >
              <p className="text-xs font-medium text-muted-foreground">
                Departure
              </p>

              <h4
                className="
                  mt-1
                  text-4xl
                  font-black
                  text-foreground
                "
              >
                {departureAirport}
              </h4>

              {departureAirportName && (
                <p
                  className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                >
                  {departureAirportName}
                </p>
              )}

              <p
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-foreground
                "
              >
                {departureTime}
              </p>

              <p className="text-sm text-muted-foreground">
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
                  font-semibold
                  text-muted-foreground
                "
              >
                <Clock3 size={16} />

                <span>
                  {duration}
                </span>
              </div>

              <div
                className="
                  my-3
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
                    size={24}
                    className="
                      text-blue-600
                      dark:text-blue-400
                    "
                  />
                ) : (
                  <ArrowLeft
                    size={24}
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

              <span
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-muted-foreground
                  shadow-sm
                  dark:bg-slate-900
                "
              >
                {stopsLabel}
              </span>
            </div>

            {/* Arrival */}

            <div
              className="
                min-w-[150px]
                lg:flex-1
                lg:text-right
              "
            >
              <p className="text-xs font-medium text-muted-foreground">
                Arrival
              </p>

              <h4
                className="
                  mt-1
                  text-4xl
                  font-black
                  text-foreground
                "
              >
                {arrivalAirport}
              </h4>

              {arrivalAirportName && (
                <p
                  className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                >
                  {arrivalAirportName}
                </p>
              )}

              <p
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-foreground
                "
              >
                {arrivalTime}
              </p>

              <p className="text-sm text-muted-foreground">
                {arrivalDate}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            FLIGHT INFORMATION
        ==================================================== */}

        <div
          className="
            mt-5
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* Cabin */}

          <FlightInfo
            label="Cabin"
            value={cabinClass}
          />

          {/* Baggage */}

          <FlightInfo
            label="Baggage"
            value={baggage}
            icon={
              <Luggage
                size={16}
              />
            }
          />

          {/* Aircraft */}

          <FlightInfo
            label="Aircraft"
            value={
              flight.aircraft ||
              "—"
            }
          />

          {/* Terminal */}

          <FlightInfo
            label="Terminal"
            value={
              flight.terminal ||
              "—"
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FLIGHT INFO
============================================================ */

function FlightInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-muted/50
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          text-muted-foreground
        "
      >
        {icon}

        <span>
          {label}
        </span>
      </div>

      <p
        className="
          mt-2
          font-semibold
          text-foreground
        "
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function TripDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [trip, setTrip] =
    useState<Trip | null>(null);

  const [budgetSummary, setBudgetSummary] =
    useState<BudgetSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* ==========================================================
     FETCH TRIP
  ========================================================== */

  useEffect(() => {
    const fetchTripDetails =
      async () => {
        try {
          setLoading(true);

          const [
            tripData,
            budgetData,
          ] = await Promise.all([
            getTrip(id),
            getBudgetSummary(id),
          ]);

          setTrip(tripData);
          setBudgetSummary(
            budgetData
          );
        } catch (error) {
          console.error(
            "Failed to load trip:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchTripDetails();
    }
  }, [id]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="
            rounded-[32px]
            border
            border-border
            bg-card
            p-16
            text-center
            shadow-xl
          "
        >
          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-blue-600
              border-t-transparent
            "
          />

          <p className="mt-6 text-muted-foreground">
            Loading trip...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  /* ==========================================================
     NOT FOUND
  ========================================================== */

  if (!trip) {
    return (
      <DashboardLayout>
        <div
          className="
            rounded-[32px]
            border
            border-border
            bg-card
            p-16
            text-center
            shadow-xl
          "
        >
          <h2 className="text-3xl font-bold text-foreground">
            Trip Not Found
          </h2>

          <p className="mt-4 text-muted-foreground">
            We couldn't find this itinerary.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  /* ==========================================================
     FLIGHTS

     Backend should return:

     trip.flights = [
       {
         flight_type: "OUTBOUND",
         ...
       },
       {
         flight_type: "RETURN",
         ...
       }
     ]
  ========================================================== */

  const flights =
    Array.isArray(
      (trip as any).flights
    )
      ? ((trip as any)
          .flights as SavedFlight[])
      : [];

  const outboundFlight =
    flights.find(
      (flight) =>
        flight.flight_type ===
        "OUTBOUND"
    ) || null;

  const returnFlight =
    flights.find(
      (flight) =>
        flight.flight_type ===
        "RETURN"
    ) || null;

  const totalFlightPrice =
    flights.reduce(
      (total, flight) =>
        total +
        Number(
          flight.price ?? 0
        ),
      0
    );

  /* ==========================================================
     ITINERARY
  ========================================================== */

  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* ====================================================
            HERO
        ==================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[36px]
            bg-gradient-to-r
            from-slate-900
            via-blue-900
            to-indigo-900
            p-10
            text-white
            shadow-2xl
          "
        >
          <div
            className="
              absolute
              -right-24
              -top-24
              h-96
              w-96
              rounded-full
              bg-cyan-400/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-0
              h-72
              w-72
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-10
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-white/10
                  px-4
                  py-2
                  text-sm
                  font-semibold
                "
              >
                ✈ AI Planned Journey
              </span>

              <h1
                className="
                  mt-6
                  text-4xl
                  font-bold
                  md:text-5xl
                "
              >
                {trip.source_airport.iata_code}

                <span className="mx-5 text-cyan-300">
                  →
                </span>

                {trip.destination_airport.iata_code}
              </h1>

              <p className="mt-4 text-lg text-slate-300">
                {trip.source_airport.name}

                {" → "}

                {trip.destination_airport.name}
              </p>
            </div>

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/10
                p-8
                backdrop-blur-xl
              "
            >
              <p className="text-sm text-slate-300">
                Total Budget
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                ₹
                {Number(
                  trip.budget
                ).toLocaleString(
                  "en-IN"
                )}
              </h2>

              <span
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-white/20
                  px-4
                  py-2
                  text-sm
                  font-semibold
                "
              >
                {trip.status}
              </span>
            </div>
          </div>
        </section>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <section>
          <div
            className="
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            <StatCard
              label="Travelers"
              value={trip.travelers}
            />

            <StatCard
              label="Cabin Class"
              value={trip.cabin_class
                .replaceAll(
                  "_",
                  " "
                )
                .toLowerCase()
                .replace(
                  /\b\w/g,
                  (c) =>
                    c.toUpperCase()
                )}
            />

            <StatCard
              label="Departure"
              value={
                trip.departure_date
              }
            />

            <StatCard
              label="Return"
              value={
                trip.return_date
              }
            />
          </div>
        </section>

        {/* ====================================================
            TRIP OVERVIEW
        ==================================================== */}

        <section
          className="
            rounded-[32px]
            border
            border-border
            bg-card
            p-8
            shadow-lg
          "
        >
          <div className="mb-8">
            <span
              className="
                rounded-full
                bg-blue-100
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-700
                dark:bg-blue-500/15
                dark:text-blue-300
              "
            >
              Trip Information
            </span>

            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Overview
            </h2>
          </div>

          <div
            className="
              grid
              gap-8
              lg:grid-cols-2
            "
          >
            <InfoCard
              title="Source Airport"
              value={
                trip.source_airport
                  .name
              }
            />

            <InfoCard
              title="Destination Airport"
              value={
                trip.destination_airport
                  .name
              }
            />

            <InfoCard
              title="Budget"
              value={`₹${Number(
                trip.budget
              ).toLocaleString(
                "en-IN"
              )}`}
            />

            <InfoCard
              title="Status"
              value={
                trip.status
              }
            />
          </div>
        </section>

        {/* ====================================================
            FLIGHTS
        ==================================================== */}

        <section>
          <div className="mb-6">
            <span
              className="
                inline-flex
                rounded-full
                bg-blue-100
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-700
                dark:bg-blue-500/15
                dark:text-blue-300
              "
            >
              Flight Details
            </span>

            <div
              className="
                mt-4
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-end
                md:justify-between
              "
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Your Flights
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Saved flight details for your journey.
                </p>
              </div>

              {flights.length > 0 && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50
                    px-5
                    py-3
                    dark:border-blue-500/20
                    dark:bg-blue-500/10
                  "
                >
                  <Wallet
                    size={20}
                    className="
                      text-green-600
                      dark:text-green-400
                    "
                  />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Flight Price
                    </p>

                    <p
                      className="
                        text-xl
                        font-black
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      ₹
                      {totalFlightPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {outboundFlight ||
          returnFlight ? (
            <div className="space-y-6">

              {/* OUTBOUND */}

              {outboundFlight && (
                <SavedFlightCard
                  flight={
                    outboundFlight
                  }
                  type="OUTBOUND"
                />
              )}

              {/* RETURN SEPARATOR */}

              {outboundFlight &&
                returnFlight && (
                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      py-2
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
                        px-5
                        py-2
                        text-sm
                        font-semibold
                        text-muted-foreground
                      "
                    >
                      <ArrowLeft
                        size={15}
                      />

                      Return Journey

                      <ArrowRight
                        size={15}
                      />
                    </div>

                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}

              {/* RETURN */}

              {returnFlight && (
                <SavedFlightCard
                  flight={
                    returnFlight
                  }
                  type="RETURN"
                />
              )}
            </div>
          ) : (
            <div
              className="
                rounded-[30px]
                border
                border-dashed
                border-border
                bg-card
                p-12
                text-center
              "
            >
              <Plane
                size={40}
                className="
                  mx-auto
                  text-muted-foreground
                "
              />

              <h3
                className="
                  mt-4
                  text-xl
                  font-bold
                  text-foreground
                "
              >
                No flights saved
              </h3>

              <p className="mt-2 text-muted-foreground">
                No flight information is available for this trip.
              </p>
            </div>
          )}
        </section>

        {/* ====================================================
            NOTES
        ==================================================== */}

        {trip.notes && (
          <section
            className="
              rounded-[32px]
              border
              border-border
              bg-card
              p-8
              shadow-lg
            "
          >
            <span
              className="
                rounded-full
                bg-amber-100
                px-4
                py-2
                text-sm
                font-semibold
                text-amber-700
                dark:bg-amber-500/15
                dark:text-amber-300
              "
            >
              Personal Notes
            </span>

            <div
              className="
                mt-6
                rounded-2xl
                bg-muted
                p-6
              "
            >
              <p className="leading-8 text-foreground">
                {trip.notes}
              </p>
            </div>
          </section>
        )}

        {/* ====================================================
            BUDGET
        ==================================================== */}

        {budgetSummary && (
          <section>
            <div className="mb-6">
              <span
                className="
                  rounded-full
                  bg-emerald-100
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-emerald-700
                  dark:bg-emerald-500/15
                  dark:text-emerald-300
                "
              >
                Financial Overview
              </span>

              <h2 className="mt-4 text-3xl font-bold text-foreground">
                Budget Summary
              </h2>
            </div>

            <BudgetOverview
              summary={
                budgetSummary
              }
            />
          </section>
        )}

        {/* ====================================================
            ITINERARY
        ==================================================== */}

        <section>
          <div className="mb-6">
            <span
              className="
                rounded-full
                bg-blue-100
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-700
                dark:bg-blue-500/15
                dark:text-blue-300
              "
            >
              Travel Timeline
            </span>

            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Daily Itinerary
            </h2>

            <p className="mt-2 text-muted-foreground">
              Manage every day of your journey with activities,
              hotels and transportation.
            </p>
          </div>

          <ItinerarySection
            tripId={id}
            travelers={
              trip.travelers
            }
          />
        </section>

      </div>
    </DashboardLayout>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

interface StatCardProps {
  label: string;
  value: React.ReactNode;
}

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-border
        bg-card
        p-6
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/30
        hover:shadow-xl
      "
    >
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <h3
        className="
          mt-3
          break-words
          text-xl
          font-bold
          leading-tight
          text-foreground
          lg:text-2xl
        "
      >
        {value}
      </h3>
    </div>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

interface InfoCardProps {
  title: string;
  value: React.ReactNode;
}

function InfoCard({
  title,
  value,
}: InfoCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-muted
        p-6
        transition-all
        duration-300
        hover:border-blue-500/30
      "
    >
      <p className="text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <h3
        className="
          mt-2
          break-words
          text-lg
          font-semibold
          text-foreground
        "
      >
        {value}
      </h3>
    </div>
  );
}