"use client";

import { useEffect, useState } from "react";

import { getDashboard } from "@/services/dashboard.service";

import DashboardLayout from "@/components/layout/DashboardLayout";

import DashboardHero from "@/components/dashboard/DashboardHero";
import TripStatusCard from "@/components/dashboard/TripStatusCard";
import NextTripCard from "@/components/dashboard/NextTripCard";
import RecentTripCard from "@/components/dashboard/RecentTripCard";

import StatusChart from "@/components/dashboard/StatusChart";
import MonthlyTripsChart from "@/components/dashboard/MonthlyTripsChart";

interface DashboardData {
  statistics: {
    total_trips: number;
    planning_trips: number;
    confirmed_trips: number;
    completed_trips: number;
    cancelled_trips: number;
    total_budget: number;
    total_days: number;
    total_activities: number;
  };

  next_trip: {
    id: number;
    destination: string;
    iata_code: string;
    departure_date: string;
  } | null;

  recent_trips: {
    id: number;
    from: string;
    to: string;
    departure_date: string;
    status: string;
    budget: number;
  }[];

  monthly_trips: {
    month: string;
    total: number;
  }[];
}

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background transition-colors">
        <div
          className="
            rounded-3xl
            border
            border-border
            bg-card
            px-10
            py-8
            shadow-xl
          "
        >
          <h1 className="text-xl font-semibold text-foreground">
            Loading Dashboard...
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please wait while we prepare your dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <DashboardLayout>
      {/* Hero */}

      <DashboardHero
        statistics={{
          total_trips:
            dashboard?.statistics.total_trips ?? 0,

          total_budget:
            dashboard?.statistics.total_budget ?? 0,

          total_days:
            dashboard?.statistics.total_days ?? 0,

          total_activities:
            dashboard?.statistics.total_activities ?? 0,
        }}
      />

      {/* Status */}

      <section className="mt-12">
        <div className="mb-6">
          <span
            className="
              rounded-full
              bg-blue-100
              px-4
              py-2
              text-sm
              font-semibold
              text-blue-700

              dark:bg-blue-500/15
              dark:text-blue-300
            "
          >
            Dashboard Overview
          </span>

          <h2 className="mt-4 text-3xl font-bold text-foreground">
            Trip Status
          </h2>

          <p className="mt-2 text-muted-foreground">
            Monitor every trip throughout its journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <TripStatusCard
            title="Planning"
            value={
              dashboard?.statistics.planning_trips ?? 0
            }
            gradient="bg-gradient-to-r from-amber-500 to-orange-500"
          />

          <TripStatusCard
            title="Confirmed"
            value={
              dashboard?.statistics.confirmed_trips ?? 0
            }
            gradient="bg-gradient-to-r from-emerald-500 to-green-600"
          />

          <TripStatusCard
            title="Completed"
            value={
              dashboard?.statistics.completed_trips ?? 0
            }
            gradient="bg-gradient-to-r from-sky-500 to-blue-600"
          />

          <TripStatusCard
            title="Cancelled"
            value={
              dashboard?.statistics.cancelled_trips ?? 0
            }
            gradient="bg-gradient-to-r from-rose-500 to-red-600"
          />
        </div>
      </section>

      {/* Next Trip */}

      <section className="mt-12">
        <NextTripCard
          trip={dashboard?.next_trip ?? null}
        />
      </section>

      {/* Recent Trips */}

      <section className="mt-14">
        <div className="mb-8">
          <span
            className="
              rounded-full
              bg-cyan-100
              px-4
              py-2
              text-sm
              font-semibold
              text-cyan-700

              dark:bg-cyan-500/15
              dark:text-cyan-300
            "
          >
            Latest Activity
          </span>

          <h2 className="mt-4 text-3xl font-bold text-foreground">
            Recent Trips
          </h2>

          <p className="mt-2 text-muted-foreground">
            Your latest travel plans and AI-generated journeys.
          </p>
        </div>

        {dashboard?.recent_trips.length ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {dashboard.recent_trips.map((trip) => (
              <RecentTripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              rounded-3xl
              border
              border-border
              bg-card
              p-12
              text-center
              shadow-xl
            "
          >
            <h3 className="text-2xl font-bold text-foreground">
              No Trips Yet
            </h3>

            <p className="mt-3 text-muted-foreground">
              Create your first AI trip and it will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Analytics */}

      <section className="mt-16">
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

              dark:bg-indigo-500/15
              dark:text-indigo-300
            "
          >
            Insights
          </span>

          <h2 className="mt-4 text-3xl font-bold text-foreground">
            Travel Analytics
          </h2>

          <p className="mt-2 text-muted-foreground">
            Understand your travel history with AI-powered insights.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <StatusChart
            planning={
              dashboard?.statistics.planning_trips ?? 0
            }
            confirmed={
              dashboard?.statistics.confirmed_trips ?? 0
            }
            completed={
              dashboard?.statistics.completed_trips ?? 0
            }
            cancelled={
              dashboard?.statistics.cancelled_trips ?? 0
            }
          />

          <MonthlyTripsChart
            data={dashboard?.monthly_trips ?? []}
          />
        </div>
      </section>
    </DashboardLayout>
  );
}