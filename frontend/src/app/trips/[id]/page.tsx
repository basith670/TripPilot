"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ItinerarySection from "@/components/itinerary/ItinerarySection";

import { getTrip } from "@/services/trips.service";

export default function TripDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTrip(id);
        setTrip(data);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id]);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          <p className="text-gray-500">Loading trip...</p>
        </div>
      ) : !trip ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          <p className="text-red-500">Trip not found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {trip.source_airport.iata_code} →{" "}
              {trip.destination_airport.iata_code}
            </h1>

            <p className="mt-2 text-gray-500">
              {trip.source_airport.name} →{" "}
              {trip.destination_airport.name}
            </p>
          </div>

          {/* Trip Overview */}
          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Trip Overview
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Departure
                </h3>

                <p className="mt-2 text-lg font-medium">
                  {trip.departure_date}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Return
                </h3>

                <p className="mt-2 text-lg font-medium">
                  {trip.return_date}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Travelers
                </h3>

                <p className="mt-2 text-lg font-medium">
                  {trip.travelers}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Cabin Class
                </h3>

                <p className="mt-2 text-lg font-medium">
                  {trip.cabin_class}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Budget
                </h3>

                <p className="mt-2 text-lg font-semibold text-green-600">
                  ₹{Number(trip.budget).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </h3>

                <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {trip.status}
                </span>
              </div>
            </div>

            {trip.notes && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </h3>

                <div className="mt-3 rounded-xl bg-gray-50 p-4">
                  <p className="text-gray-700">{trip.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Itinerary */}
          <ItinerarySection
            tripId={id}
            travelers={trip.travelers}
            />
        </div>
      )}
    </DashboardLayout>
  );
}