"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import FlightHero from "@/components/flights/FlightHero";
import FlightFilters from "@/components/flights/FlightFilters";
import FlightList from "@/components/flights/FlightList";
import FlightSkeleton from "@/components/flights/FlightSkeleton";
import FlightSummary from "@/components/flights/FlightSummary";

import {
  getTrips,
} from "@/services/trips.service";

import {
  getFlights,
} from "@/services/flight.service";

import { Trip } from "@/types/trip";
import { Flight } from "@/types/flight";

export default function FlightsPage() {
  /* ============================================================
     STATE
  ============================================================ */

  const [trips, setTrips] =
    useState<Trip[]>([]);

  /*
   * null = All Trips
   * number = Specific Trip
   */
  const [selectedTrip, setSelectedTrip] =
    useState<number | null>(null);

  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [selectedFlightId, setSelectedFlightId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [flightsLoading, setFlightsLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("latest");

  /* ============================================================
     SELECTED FLIGHT ID HELPER

     Supports:

     selected_flight: 12

     OR

     selected_flight: {
       id: 12,
       ...
     }
  ============================================================ */

  const getSelectedFlightId = (
    selectedFlight: any
  ): number | null => {
    if (!selectedFlight) {
      return null;
    }

    if (
      typeof selectedFlight ===
      "number"
    ) {
      return selectedFlight;
    }

    if (
      typeof selectedFlight ===
        "object" &&
      selectedFlight.id
    ) {
      return Number(
        selectedFlight.id
      );
    }

    return null;
  };

  /* ============================================================
     LOAD TRIPS
  ============================================================ */

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data =
          await getTrips();

        setTrips(data);

        /*
         * Start with All Trips.
         */
        setSelectedTrip(null);

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
     LOAD FLIGHTS FOR STATISTICS

     null = ALL TRIPS

     number = SPECIFIC TRIP
  ============================================================ */

  const loadFlightStatistics =
    async () => {
      try {
        setFlightsLoading(true);

        /* ======================================================
           ALL TRIPS
        ====================================================== */

        const data =
          selectedTrip === null
            ? await getFlights()
            : await getFlights({
                trip: selectedTrip,
              });

        setFlights(data);

        /* ======================================================
           SELECTED FLIGHT
        ====================================================== */

        if (
          selectedTrip !== null
        ) {
          const selectedTripData =
            trips.find(
              (trip) =>
                trip.id ===
                selectedTrip
            );

          const selectedId =
            getSelectedFlightId(
              selectedTripData?.selected_flight
            );

          setSelectedFlightId(
            selectedId
          );

        } else {

          /*
           * All Trips:
           *
           * Find whether any of the user's
           * trips currently has a selected flight.
           *
           * We only need the first ID for the
           * FlightHero selected count.
           */
          let firstSelectedId:
            number | null = null;

          for (
            const trip of trips
          ) {
            const selectedId =
              getSelectedFlightId(
                trip.selected_flight
              );

            if (
              selectedId !==
              null
            ) {
              firstSelectedId =
                selectedId;

              break;
            }
          }

          setSelectedFlightId(
            firstSelectedId
          );
        }

      } catch (error) {
        console.error(
          "Failed to load flight statistics:",
          error
        );

        setFlights([]);
        setSelectedFlightId(
          null
        );

      } finally {
        setFlightsLoading(false);
      }
    };

  /* ============================================================
     REFRESH FLIGHT STATISTICS

     Runs when:

     - Trips are loaded
     - Selected trip changes
  ============================================================ */

  useEffect(() => {
    /*
     * Do not try to load flight statistics
     * until trips have loaded.
     */
    if (loading) {
      return;
    }

    loadFlightStatistics();

  }, [
    selectedTrip,
    trips,
    loading,
  ]);

  /* ============================================================
     FLIGHT STATISTICS
  ============================================================ */

  const totalFlights =
    flights.length;

  const scheduledFlights =
    flights.filter(
      (flight) =>
        flight.status ===
        "SCHEDULED"
    ).length;

  const totalFlightCost =
    flights.reduce(
      (
        total,
        flight
      ) =>
        total +
        Number(
          flight.price
        ),
      0
    );

  /* ============================================================
     SELECTED FLIGHTS

     For a specific trip:

       0 or 1

     For All Trips:

       Count selected flights belonging
       to the currently loaded trips.
  ============================================================ */

  let selectedFlights = 0;

  if (
    selectedTrip !== null
  ) {
    selectedFlights =
      selectedFlightId !== null
        ? 1
        : 0;

  } else {

    selectedFlights =
      trips.reduce(
        (
          count,
          trip
        ) => {

          const selectedId =
            getSelectedFlightId(
              trip.selected_flight
            );

          if (
            selectedId ===
            null
          ) {
            return count;
          }

          /*
           * Only count the selected flight
           * if it belongs to the currently
           * loaded flights.
           */
          const exists =
            flights.some(
              (flight) =>
                flight.id ===
                selectedId
            );

          return exists
            ? count + 1
            : count;
        },
        0
      );
  }

  /* ============================================================
     TRIP OPTIONS
  ============================================================ */

  const tripOptions =
    trips.map(
      (trip) => ({
        id: trip.id,

        label:
          `${trip.source_airport.iata_code} → ${trip.destination_airport.iata_code}`,
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

  /* ============================================================
     HANDLE TRIP CHANGE
  ============================================================ */

  const handleTripChange =
    (value: string) => {

      /*
       * ALL TRIPS
       */
      if (
        value === "all"
      ) {
        setSelectedTrip(
          null
        );

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

      setSelectedFlightId(
        null
      );
    };

  /* ============================================================
     FLIGHT LIST REFRESH CALLBACK
  ============================================================ */

  const handleFlightsChange =
    (
      updatedFlights: Flight[]
    ) => {
      setFlights(
        updatedFlights
      );

      /*
       * Refresh selected flight information
       * from the current trip data.
       */
      if (
        selectedTrip !==
        null
      ) {
        const trip =
          trips.find(
            (item) =>
              item.id ===
              selectedTrip
          );

        setSelectedFlightId(
          getSelectedFlightId(
            trip?.selected_flight
          )
        );
      }
    };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <DashboardLayout>

      <div className="space-y-12">

        {/* ======================================================
            HERO
        ====================================================== */}

        <FlightHero
          totalFlights={
            flightsLoading
              ? 0
              : totalFlights
          }

          scheduledFlights={
            flightsLoading
              ? 0
              : scheduledFlights
          }

          selectedFlights={
            flightsLoading
              ? 0
              : selectedFlights
          }
        />

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mt-10">

          <FlightFilters
            search={
              search
            }

            setSearch={
              setSearch
            }

            trip={
              selectedTrip ===
              null
                ? "all"
                : String(
                    selectedTrip
                  )
            }

            setTrip={
              handleTripChange
            }

            status={
              status
            }

            setStatus={
              setStatus
            }

            sort={
              sort
            }

            setSort={
              setSort
            }

            trips={
              tripOptions
            }
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

          <div
            className="
              mb-10
            "
          >

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
              Browse, compare and
              manage every available
              flight for your selected
              trip from one centralized
              dashboard.
            </p>

          </div>

          <FlightList
            tripId={
              selectedTrip
            }

            search={
              search
            }

            status={
              status
            }

            sort={
              sort
            }

            onFlightsChange={
              handleFlightsChange
            }
          />

        </section>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        {!flightsLoading && (
          <section
            className="
              mt-16
            "
          >

            <FlightSummary
              totalFlights={
                totalFlights
              }

              selectedFlights={
                selectedFlights
              }

              totalCost={
                totalFlightCost
              }
            />

          </section>
        )}

      </div>

    </DashboardLayout>
  );
}