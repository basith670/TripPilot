"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardLayout from "@/components/layout/DashboardLayout";

import { getTrips } from "@/services/trips.service";

import { Trip } from "@/types/trip";

export default function ItineraryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Trip Itineraries
          </h1>

          <p className="mt-2 text-gray-500">
            Select a trip to view and manage its itinerary.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl bg-white p-8 shadow">
            <p className="text-gray-500">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-2xl font-semibold text-gray-800">
              No Trips Found
            </h2>

            <p className="mt-3 text-gray-500">
              Create your first trip to start planning your itinerary.
            </p>

            <Link
              href="/trips"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Go to My Trips
            </Link>
          </div>
        ) : (
          /* Trip Cards */
          <div className="grid gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {trip.source_airport.iata_code} →{" "}
                      {trip.destination_airport.iata_code}
                    </h2>

                    <p className="mt-2 text-gray-500">
                      {trip.source_airport.name} →{" "}
                      {trip.destination_airport.name}
                    </p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Departure
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                          {trip.departure_date}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Return
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                          {trip.return_date || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Travellers
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                          {trip.travelers}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Budget
                        </p>

                        <p className="mt-1 font-semibold text-green-600">
                          ₹
                          {trip.budget
                            ? Number(trip.budget).toLocaleString("en-IN")
                            : "Not Set"}
                        </p>
                      </div>
                    </div>

                    {trip.notes && (
                      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">
                          {trip.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-start gap-4 lg:items-end">
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                      {trip.status}
                    </span>

                    <Link
                      href={`/itinerary/${trip.id}`}
                      className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                      Open Itinerary →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}