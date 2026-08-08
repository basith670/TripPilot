"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import BudgetOverview from "@/components/budget/BudgetOverview";
import ItinerarySection from "@/components/itinerary/ItinerarySection";

import {
  getBudgetSummary,
  BudgetSummary,
} from "@/services/budget.service";

import { getTrip } from "@/services/trips.service";

import { Trip } from "@/types/trip";

export default function TripDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);

  const [budgetSummary, setBudgetSummary] =
    useState<BudgetSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);

        const [tripData, budgetData] =
          await Promise.all([
            getTrip(id),
            getBudgetSummary(id),
          ]);

        setTrip(tripData);
        setBudgetSummary(budgetData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTripDetails();
    }
  }, [id]);

  return (
    <DashboardLayout>

      {/* Loading */}

      {loading ? (

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

      ) : !trip ? (

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

            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

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

                <h1 className="mt-6 text-5xl font-bold">

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
                  ).toLocaleString("en-IN")}

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

          {/* Statistics */}

          <section className="mt-10">

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <StatCard
                label="Travelers"
                value={trip.travelers}
              />

              <StatCard
                label="Cabin Class"
                value={
                  trip.cabin_class
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .replace(
                      /\b\w/g,
                      (c) => c.toUpperCase()
                    )
                }
              />

              <StatCard
                label="Departure"
                value={trip.departure_date}
              />

              <StatCard
                label="Return"
                value={trip.return_date}
              />

            </div>

          </section>

          {/* Trip Overview */}

          <section
            className="
              mt-10

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
                  dark:bg-blue-500/15
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-700
                  dark:text-blue-300
                "
              >
                Trip Information
              </span>

              <h2 className="mt-4 text-3xl font-bold text-foreground">
                Overview
              </h2>

            </div>

            <div className="grid gap-8 lg:grid-cols-2">

              <InfoCard
                title="Source Airport"
                value={trip.source_airport.name}
              />

              <InfoCard
                title="Destination Airport"
                value={trip.destination_airport.name}
              />

              <InfoCard
                title="Budget"
                value={`₹${Number(
                  trip.budget
                ).toLocaleString("en-IN")}`}
              />

              <InfoCard
                title="Status"
                value={trip.status}
              />

            </div>

          </section>
                    {/* Notes */}

                    {trip.notes && (

<section
  className="
    mt-10

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
      dark:bg-amber-500/15
      px-4
      py-2
      text-sm
      font-semibold
      text-amber-700
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

{/* Budget */}

{budgetSummary && (

<section className="mt-10">

  <div className="mb-6">

    <span
      className="
        rounded-full
        bg-emerald-100
        dark:bg-emerald-500/15
        px-4
        py-2
        text-sm
        font-semibold
        text-emerald-700
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
    summary={budgetSummary}
  />

</section>

)}

{/* Itinerary */}

<section className="mt-10">

<div className="mb-6">

  <span
    className="
      rounded-full
      bg-blue-100
      dark:bg-blue-500/15
      px-4
      py-2
      text-sm
      font-semibold
      text-blue-700
      dark:text-blue-300
    "
  >
    Travel Timeline
  </span>

  <h2 className="mt-4 text-3xl font-bold text-foreground">
    Daily Itinerary
  </h2>

  <p className="mt-2 text-muted-foreground">
    Manage every day of your journey with
    activities, hotels and transportation.
  </p>

</div>

<ItinerarySection
  tripId={id}
  travelers={trip.travelers}
/>

</section>

</>

)}

</DashboardLayout>
);
}

/* ------------------------------------------------ */
/* Components */
/* ------------------------------------------------ */

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