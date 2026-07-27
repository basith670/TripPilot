"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import TripCard from "@/components/trips/TripCard";
import NewTripModal from "@/components/forms/NewTripModal";

import { getTrips } from "@/services/trips.service";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            My Trips
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all your travel plans in one place.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + New Trip
        </button>
      </div>

      {/* Trips */}
      <div className="mt-8">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-500">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-500">
              No trips found. Create your first trip.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      <NewTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTrips}
      />
    </DashboardLayout>
  );
}