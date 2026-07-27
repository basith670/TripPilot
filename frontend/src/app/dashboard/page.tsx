"use client";

import { useEffect, useState } from "react";

import { FaPlane, FaWallet, FaClock, FaCheckCircle } from "react-icons/fa";

import { getDashboard } from "@/services/dashboard.service";

import DashboardLayout from "@/components/layout/DashboardLayout";

interface DashboardData {
  statistics: {
    total_trips: number;
    planning_trips: number;
    confirmed_trips: number;
    completed_trips: number;
    cancelled_trips: number;
    total_budget: number;
  };

  next_trip: any;

  recent_trips: any[];
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
        <h1 className="text-xl font-semibold">Loading Dashboard...</h1>
      </main>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        TripPilot Dashboard
      </h1>
  
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <FaPlane className="mb-4 text-3xl text-blue-600" />
          <p className="text-gray-500">Total Trips</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {dashboard?.statistics.total_trips}
          </h2>
        </div>
  
        <div className="rounded-xl bg-white p-6 shadow">
          <FaClock className="mb-4 text-3xl text-orange-500" />
          <p className="text-gray-500">Planning Trips</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {dashboard?.statistics.planning_trips}
          </h2>
        </div>
  
        <div className="rounded-xl bg-white p-6 shadow">
          <FaCheckCircle className="mb-4 text-3xl text-green-600" />
          <p className="text-gray-500">Confirmed Trips</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {dashboard?.statistics.confirmed_trips}
          </h2>
        </div>
  
        <div className="rounded-xl bg-white p-6 shadow">
          <FaWallet className="mb-4 text-3xl text-purple-600" />
          <p className="text-gray-500">Total Budget</p>
          <h2 className="text-3xl font-bold text-gray-900">
            ₹{dashboard?.statistics.total_budget}
          </h2>
        </div>
      </div>
    </DashboardLayout>
  );
}