"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import FlightHero from "@/components/flights/FlightHero";
import FlightFilters from "@/components/flights/FlightFilters";
import FlightList from "@/components/flights/FlightList";
import FlightSkeleton from "@/components/flights/FlightSkeleton";
import EmptyFlights from "@/components/flights/EmptyFlights";
import FlightSummary from "@/components/flights/FlightSummary";
import AddFlightModal from "@/components/flights/AddFlightModal";

import { getTrips } from "@/services/trips.service";
import { getFlights } from "@/services/flight.service";

import { Trip } from "@/types/trip";
import { Flight } from "@/types/flight";

export default function FlightsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);

  const [selectedTrip, setSelectedTrip] =
    useState<number>();

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

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  /* ---------------- Trips ---------------- */

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getTrips();

        setTrips(data);

        if (data.length > 0) {
          setSelectedTrip(data[0].id);

          setSelectedFlightId(
            data[0].selected_flight ?? null
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  /* ---------------- Flights ---------------- */

  useEffect(() => {
    const loadFlights = async () => {
      if (!selectedTrip) {
        setFlights([]);
        return;
      }

      try {
        const data = await getFlights({
          trip: selectedTrip,
        });

        setFlights(data);

        const trip = trips.find(
          (t) => t.id === selectedTrip
        );

        setSelectedFlightId(
          trip?.selected_flight ?? null
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadFlights();
  }, [selectedTrip, refreshKey, trips]);

  /* ---------------- Statistics ---------------- */

  const totalFlights = flights.length;

  const scheduledFlights = flights.filter(
    (flight) => flight.status === "SCHEDULED"
  ).length;

  const selectedFlights =
    selectedFlightId !== null ? 1 : 0;

  const totalFlightCost = flights.reduce(
    (sum, flight) =>
      sum + Number(flight.price),
    0
  );

  const tripOptions = trips.map((trip) => ({
    id: trip.id,
    label: `${trip.source_airport.iata_code} → ${trip.destination_airport.iata_code}`,
  }));

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
  
        {/* Hero */}
  
        <FlightHero
          totalFlights={totalFlights}
          scheduledFlights={scheduledFlights}
          selectedFlights={selectedFlights}
        />
  
        {/* Filters */}
  
        <div className="mt-10">
          <FlightFilters
            search={search}
            setSearch={setSearch}
            trip={String(selectedTrip ?? "all")}
            setTrip={(value) => {
              const tripId = Number(value);
  
              setSelectedTrip(tripId);
  
              const trip = trips.find(
                (t) => t.id === tripId
              );
  
              setSelectedFlightId(
                trip?.selected_flight ?? null
              );
            }}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            trips={tripOptions}
          />
        </div>
  
        {/* Flights */}
  
        <section className="mt-12 space-y-8">
  
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
  
                text-cyan-700 dark:text-cyan-300
              "
            >
              Flight Collection
            </span>
  
            <h2
              className="
                mt-5
  
                text-4xl
                font-bold
  
                text-slate-900 dark:text-white
              "
            >
              Available Flights
            </h2>
  
            <p
              className="
                mt-3
  
                max-w-2xl
  
                text-slate-600 dark:text-slate-400
              "
            >
              Browse, compare and manage every
              available flight for your selected
              trip from one centralized dashboard.
            </p>
  
          </div>
  
          {selectedTrip ? (
  
            <FlightList
              key={refreshKey}
              tripId={selectedTrip}
              search={search}
              status={status}
              sort={sort}
            />
  
          ) : (
  
            <EmptyFlights
              onCreate={() =>
                setAddModalOpen(true)
              }
            />
  
          )}
  
        </section>
  
        {/* Summary */}
  
        <section className="mt-16">
  
          <FlightSummary
            totalFlights={totalFlights}
            selectedFlights={selectedFlights}
            totalCost={totalFlightCost}
          />
  
        </section>

              {/* Add Flight */}

      <AddFlightModal
        isOpen={addModalOpen}
        tripId={selectedTrip ?? 0}
        onClose={() =>
          setAddModalOpen(false)
        }
        onSuccess={async () => {
          setRefreshKey(
            (prev) => prev + 1
          );

          setAddModalOpen(false);
        }}
      />

    </div>
  </DashboardLayout>
);
}