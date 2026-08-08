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
  
        <div
          className="
            rounded-[32px]
            bg-white
            p-16
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
  
          <p className="mt-6 text-center text-slate-500">
            Loading itinerary...
          </p>
  
        </div>
  
      ) : !trip ? (
  
        <div
          className="
            rounded-[32px]
            bg-white
            p-16
            text-center
            shadow-xl
          "
        >
  
          <h2 className="text-3xl font-bold text-slate-900">
            Trip Not Found
          </h2>
  
          <p className="mt-4 text-slate-500">
            This itinerary doesn't exist.
          </p>
  
        </div>
  
      ) : (
  
        <>
  
          {/* Hero */}
  
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
  
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
  
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
  
            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
  
              <div>
  
                <span
                  className="
                    rounded-full
                    bg-white/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                  "
                >
                  AI Generated Itinerary
                </span>
  
                <h1 className="mt-6 text-5xl font-bold">
  
                  {trip.source_airport.iata_code}
  
                  <span className="mx-4 text-blue-300">
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
                  Planned Budget
                </p>
  
                <h2 className="mt-3 text-5xl font-bold">
  
                  ₹
                  {Number(trip.budget).toLocaleString(
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
  
          {/* Trip Statistics */}
  
          <section className="mt-10">
  
            <div className="grid gap-6 md:grid-cols-4">
            <StatCard
              label="Departure"
              value={trip.departure_date}
            />

            <StatCard
              label="Return"
              value={trip.return_date}
            />

            <StatCard
              label="Travelers"
              value={trip.travelers}
            />

            <StatCard
              label="Cabin"
              value={trip.cabin_class}
            />

          </div>

        </section>

        {/* Trip Overview */}

        <section className="mt-12">

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
              "
            >
              Trip Overview
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              Journey Details
            </h2>

            <p className="mt-2 text-slate-500">
              Complete information about your planned journey.
            </p>

          </div>

          <div
            className="
              rounded-[32px]
              border
              border-slate-200
              bg-white
              p-8
              shadow-xl
            "
          >

            <div className="grid gap-6 md:grid-cols-2">

              <InfoCard
                title="Departure Airport"
                value={`${trip.source_airport.name} (${trip.source_airport.iata_code})`}
              />

              <InfoCard
                title="Destination Airport"
                value={`${trip.destination_airport.name} (${trip.destination_airport.iata_code})`}
              />

              <InfoCard
                title="Budget"
                value={`₹${Number(trip.budget).toLocaleString("en-IN")}`}
              />

              <InfoCard
                title="Status"
                value={
                  <span
                    className="
                      inline-flex
                      rounded-full
                      bg-blue-100
                      px-4
                      py-2
                      text-blue-700
                      text-sm
                      font-semibold
                    "
                  >
                    {trip.status}
                  </span>
                }
              />

            </div>

            {trip.notes && (

              <div className="mt-10">

                <h3 className="text-lg font-semibold text-slate-900">
                  Notes
                </h3>

                <div
                  className="
                    mt-4
                    rounded-2xl
                    bg-slate-50
                    p-6
                  "
                >

                  <p className="leading-8 text-slate-600">
                    {trip.notes}
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>

        {/* Budget */}
        <section className="mt-12">

<div className="mb-8">

  <span
    className="
      rounded-full
      bg-emerald-100
      px-4
      py-2
      text-sm
      font-semibold
      text-emerald-700
    "
  >
    Budget Analysis
  </span>

  <h2 className="mt-4 text-3xl font-bold text-slate-900">
    Budget Overview
  </h2>

  <p className="mt-2 text-slate-500">
    Track your estimated and planned travel expenses.
  </p>

</div>

{budgetSummary && (

  <div className="space-y-8">

    <BudgetOverview
      summary={budgetSummary}
    />

    <BudgetCharts
      summary={budgetSummary}
    />

  </div>

)}

</section>

{/* Itinerary */}

<section className="mt-14">

<div className="mb-8">

  <span
    className="
      rounded-full
      bg-indigo-100
      px-4
      py-2
      text-sm
      font-semibold
      text-indigo-700
    "
  >
    Day Planner
  </span>

  <h2 className="mt-4 text-3xl font-bold text-slate-900">
    Travel Itinerary
  </h2>

  <p className="mt-2 text-slate-500">
    Every destination, activity and schedule for this trip.
  </p>

</div>

<div
  className="
    rounded-[32px]
    border
    border-slate-200
    bg-white
    p-8
    shadow-xl
  "
>

  <ItinerarySection
    tripId={id}
    travelers={trip.travelers}
  />

</div>

</section>

{/* Summary */}

<section className="mt-16">

<div className="grid gap-6 md:grid-cols-3">

  <StatCard
    label="Travelers"
    value={trip.travelers}
  />

  <StatCard
    label="Cabin Class"
    value={trip.cabin_class}
  />

  <StatCard
    label="Budget"
    value={`₹${Number(
      trip.budget
    ).toLocaleString("en-IN")}`}
  />

</div>

</section>
</>

)}

</DashboardLayout>
);

}

/* -------------------------------- */
/* Reusable Components */
/* -------------------------------- */

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
    border-slate-200
    bg-white

    p-7

    shadow-lg

    transition-all
    duration-300

    hover:-translate-y-1
    hover:shadow-xl
  "
>
  <p className="text-sm font-medium text-slate-500">
    {label}
  </p>

  <h3 className="mt-3 text-3xl font-bold text-slate-900 break-words">
    {value}
  </h3>
</div>
);
}

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
    border-slate-200
    bg-slate-50

    p-6

    transition-all
    duration-300

    hover:border-blue-200
  "
>
  <p className="text-sm font-medium text-slate-500">
    {title}
  </p>

  <div className="mt-3 text-lg font-semibold text-slate-900 break-words">
    {value}
  </div>
</div>
);
}