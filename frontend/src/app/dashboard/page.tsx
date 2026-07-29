"use client";

import { useEffect, useState } from "react";

import {
    FaPlane,
    FaWallet,
    FaCalendarAlt,
    FaTasks,
  } from "react-icons/fa";

import { getDashboard } from "@/services/dashboard.service";

import DashboardLayout from "@/components/layout/DashboardLayout";

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
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-xl font-semibold">
          Loading Dashboard...
        </h1>
      </main>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        TripPilot Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <FaPlane className="mb-4 text-3xl text-blue-600" />

          <p className="text-gray-500">Total Trips</p>

          <h2 className="text-3xl font-bold text-gray-900">
            {dashboard?.statistics.total_trips}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <FaCalendarAlt className="mb-4 text-3xl text-orange-500" />

          <p className="text-gray-500">Itinerary Days</p>

          <h2 className="text-3xl font-bold text-gray-900">
            {dashboard?.statistics.total_days}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
        <FaTasks className="mb-4 text-3xl text-green-600" />

          <p className="text-gray-500">Activities</p>

          <h2 className="text-3xl font-bold text-gray-900">
            {dashboard?.statistics.total_activities}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <FaWallet className="mb-4 text-3xl text-purple-600" />

          <p className="text-gray-500">Total Budget</p>

          <h2 className="text-3xl font-bold text-gray-900">
            ₹
            {dashboard?.statistics.total_budget.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Planning</p>
            <h3 className="text-3xl font-bold">
            {dashboard?.statistics.planning_trips}
            </h3>
        </div>

        <div className="rounded-xl border-l-4 border-green-500 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Confirmed</p>
            <h3 className="text-3xl font-bold">
            {dashboard?.statistics.confirmed_trips}
            </h3>
        </div>

        <div className="rounded-xl border-l-4 border-blue-500 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Completed</p>
            <h3 className="text-3xl font-bold">
            {dashboard?.statistics.completed_trips}
            </h3>
        </div>

        <div className="rounded-xl border-l-4 border-red-500 bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Cancelled</p>
            <h3 className="text-3xl font-bold">
            {dashboard?.statistics.cancelled_trips}
            </h3>
        </div>
        </div>

      {/* Next Trip */}
      <div className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Next Upcoming Trip
        </h2>

        {dashboard?.next_trip ? (
          <div>
            <p className="text-lg font-semibold">
              {dashboard.next_trip.destination} (
              {dashboard.next_trip.iata_code})
            </p>

            <p className="mt-2 text-gray-600">
              Departure:{" "}
              {dashboard.next_trip.departure_date}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            No upcoming trips.
          </p>
        )}
      </div>

      {/* Recent Trips */}
      <div className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Recent Trips
        </h2>

        {dashboard?.recent_trips.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3">From</th>
                  <th className="pb-3">To</th>
                  <th className="pb-3">Departure</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Budget</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recent_trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3">{trip.from}</td>
                    <td>{trip.to}</td>
                    <td>{trip.departure_date}</td>
                    <td>{trip.status}</td>
                    <td>
                      ₹
                      {Number(trip.budget).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            No trips available.
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
  <StatusChart
    planning={dashboard?.statistics.planning_trips ?? 0}
    confirmed={dashboard?.statistics.confirmed_trips ?? 0}
    completed={dashboard?.statistics.completed_trips ?? 0}
    cancelled={dashboard?.statistics.cancelled_trips ?? 0}
  />

  <MonthlyTripsChart
    data={dashboard?.monthly_trips ?? []}
  />
</div>
    </DashboardLayout>
  );
}