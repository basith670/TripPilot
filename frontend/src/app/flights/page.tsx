"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import FlightHero from "@/components/flights/FlightHero";
import FlightFilters from "@/components/flights/FlightFilters";
import FlightList from "@/components/flights/FlightList";
import FlightSkeleton from "@/components/flights/FlightSkeleton";
import FlightSummary from "@/components/flights/FlightSummary";

import { getTrips } from "@/services/trips.service";

import { Trip } from "@/types/trip";

export default function FlightsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  /*
   * null = All Trips
   * number = Specific Trip
   */
  const [selectedTrip, setSelectedTrip] =
    useState<number | null>(null);

  const [selectedFlightId, setSelectedFlightId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("latest");

  /* ============================================================
     LOAD TRIPS
  ============================================================ */

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getTrips();

        setTrips(data);

        /*
         * IMPORTANT:
         *
         * Start on "All Trips"
         *
         * Do NOT automatically select data[0].
         */
        setSelectedTrip(null);

        setSelectedFlightId(null);

      } catch (error) {
        console.error(
          "Failed to load trips:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  /* ============================================================
     TRIP OPTIONS
  ============================================================ */

  const tripOptions = trips.map(
    (trip) => ({
      id: trip.id,

      label: `${trip.source_airport.iata_code} → ${trip.destination_airport.iata_code}`,
    })
  );

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <DashboardLayout>
        <FlightSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="space-y-12">

        {/* ======================================================
            HERO
        ====================================================== */}

        <FlightHero
          /*
           * These values are displayed based on the flights
           * rendered by FlightList.
           *
           * For now they remain zero at page level because
           * FlightList owns the actual flight collection.
           */
          totalFlights={0}
          scheduledFlights={0}
          selectedFlights={
            selectedFlightId !== null
              ? 1
              : 0
          }
        />

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mt-10">

          <FlightFilters
            search={search}
            setSearch={setSearch}

            /*
             * null means "All Trips"
             */
            trip={
              selectedTrip === null
                ? "all"
                : String(selectedTrip)
            }

            setTrip={(value) => {

              /*
               * ALL TRIPS
               */
              if (value === "all") {

                setSelectedTrip(null);

                setSelectedFlightId(
                  null
                );

                return;
              }

              /*
               * SPECIFIC TRIP
               */
              const tripId =
                Number(value);

              if (
                Number.isNaN(
                  tripId
                )
              ) {
                return;
              }

              setSelectedTrip(
                tripId
              );

              /*
               * We no longer need to manually
               * determine selected flight here.
               *
               * FlightList gets the trip and
               * fetches the selected flight.
               */
              setSelectedFlightId(
                null
              );
            }}

            status={status}
            setStatus={setStatus}

            sort={sort}
            setSort={setSort}

            trips={tripOptions}
          />

        </div>

        {/* ======================================================
            FLIGHTS
        ====================================================== */}

        <section
          className="
            mt-12
            space-y-8
          "
        >

          <div className="mb-10">

            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-4
                py-2
                text-sm
                font-semibold
                text-cyan-700
                dark:text-cyan-300
              "
            >
              Flight Collection
            </span>

            <h2
              className="
                mt-5
                text-4xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Available Flights
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-slate-600
                dark:text-slate-400
              "
            >
              Browse, compare and manage every
              available flight for your selected
              trip from one centralized dashboard.
            </p>

          </div>

          {/*
           * IMPORTANT:
           *
           * FlightList now accepts:
           *
           * tripId={null}
           *
           * which means ALL TRIPS.
           */}
          <FlightList
            tripId={selectedTrip}
            search={search}
            status={status}
            sort={sort}
          />

        </section>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        {/*
         * FlightSummary should eventually receive the
         * actual filtered flight totals from FlightList.
         *
         * Keeping the existing page structure for now.
         */}

      </div>

    </DashboardLayout>
  );
}