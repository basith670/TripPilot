"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import BudgetOverview from "@/components/budget/BudgetOverview";
import BudgetCharts from "@/components/budget/BudgetCharts";
import ItinerarySection from "@/components/itinerary/ItinerarySection";

import { getTrip } from "@/services/trips.service";
import {
  BudgetSummary,
  getBudgetSummary,
} from "@/services/budget.service";

import { Trip } from "@/types/trip";

export default function ItineraryDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [budgetSummary, setBudgetSummary] =
    useState<BudgetSummary | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);

        const [tripData, budgetData] = await Promise.all([
          getTrip(id),
          getBudgetSummary(id),
        ]);

        setTrip(tripData);
        setBudgetSummary(budgetData);
      } catch (error) {
        console.error("Failed to fetch itinerary:", error);
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
          <p className="text-gray-500">
            Loading itinerary...
          </p>
        </div>
      ) : !trip ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          <p className="text-red-500">
            Trip not found.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Itinerary
            </h1>

            <p className="mt-2 text-gray-500">
              {trip.source_airport.iata_code} →{" "}
              {trip.destination_airport.iata_code}
            </p>
          </div>

          {/* Trip Information */}
          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Trip Overview
            </h2>

            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">
                  Departure
                </p>

                <p className="mt-1 font-semibold">
                  {trip.departure_date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Return
                </p>

                <p className="mt-1 font-semibold">
                  {trip.return_date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Travellers
                </p>

                <p className="mt-1 font-semibold">
                  {trip.travelers}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Budget
                </p>

                <p className="mt-1 font-semibold text-green-600">
                  ₹
                  {Number(trip.budget).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            {trip.notes && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </h3>

                <div className="mt-3 rounded-xl bg-gray-50 p-4">
                  <p className="text-gray-700">
                    {trip.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Budget Overview */}
          {budgetSummary && (
            <BudgetOverview summary={budgetSummary} />
          )}

          {/* Budget Charts */}
          {budgetSummary && (
            <BudgetCharts summary={budgetSummary} />
          )}

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