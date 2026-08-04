"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import FlightList from "@/components/flights/FlightList";
import AddFlightModal from "@/components/flights/AddFlightModal";

import { getTrips } from "@/services/trips.service";

import { Trip } from "@/types/trip";

export default function FlightsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<number>();

  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getTrips();

        setTrips(data);

        if (data.length > 0) {
          setSelectedTrip(data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10">
          Loading trips...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Flights
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all flights for your trips.
            </p>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            disabled={!selectedTrip}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add Flight
          </button>
        </div>

        {/* Trip Selector */}

        <div className="rounded-2xl bg-white p-6 shadow">
          <label className="mb-3 block font-semibold">
            Select Trip
          </label>

          <select
            value={selectedTrip}
            onChange={(e) =>
              setSelectedTrip(Number(e.target.value))
            }
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          >
            {trips.map((trip) => (
              <option
                key={trip.id}
                value={trip.id}
              >
                {trip.source_airport.iata_code}
                {" → "}
                {trip.destination_airport.iata_code}
                {" • "}
                {trip.departure_date}
              </option>
            ))}
          </select>
        </div>

        {/* Flight List */}

        {selectedTrip ? (
          <FlightList
            key={refreshKey}
            tripId={selectedTrip}
          />
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-gray-500">
              No trips available.
            </p>
          </div>
        )}

        {/* Add Flight Modal */}

        <AddFlightModal
          isOpen={addModalOpen}
          tripId={selectedTrip ?? 0}
          onClose={() => setAddModalOpen(false)}
          onSuccess={async () => {
            setRefreshKey((prev) => prev + 1);
            setAddModalOpen(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
}