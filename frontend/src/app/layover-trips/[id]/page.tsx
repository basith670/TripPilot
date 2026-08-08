"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LayoverResults from "@/components/ai/LayoverPlanner/LayoverResults";

import { getLayoverTrip } from "@/services/trips.service";

export default function LayoverTripDetailsPage() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getLayoverTrip(id as string);

        setTrip(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-white p-8 shadow">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-white p-8 shadow">
          Trip not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <LayoverResults
        result={trip.ai_result}
        planner={trip}
        savedTrip={true}
        onBack={() => router.back()}
        />
    </DashboardLayout>
  );
}