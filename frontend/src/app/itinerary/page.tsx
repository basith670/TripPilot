"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ItineraryHero from "@/components/itinerary/ItineraryHero";
import ItineraryFilters from "@/components/itinerary/ItineraryFilters";
import ItineraryCard from "@/components/itinerary/ItineraryCard";
import ItinerarySkeleton from "@/components/itinerary/ItinerarySkeleton";
import EmptyItinerary from "@/components/itinerary/EmptyItinerary";

import { getTrips } from "@/services/trips.service";
import { getAllActivities } from "@/services/activity.service";

import { Trip } from "@/types/trip";

import {
  Map,
  CalendarDays,
  Sparkles,
} from "lucide-react";

export default function ItineraryPage() {
  const [trips, setTrips] =
    useState<Trip[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    totalActivities,
    setTotalActivities,
  ] = useState(0);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("latest");

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const [
        tripData,
        activities,
      ] = await Promise.all([
        getTrips(),
        getAllActivities(),
      ]);

      setTrips(tripData);

      setTotalActivities(
        activities.length
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    let data = [...trips];

    if (search.trim()) {
      const keyword =
        search.toLowerCase();

      data = data.filter(
        (trip) =>
          trip.source_airport.name
            .toLowerCase()
            .includes(keyword) ||
          trip.destination_airport.name
            .toLowerCase()
            .includes(keyword) ||
          trip.source_airport.iata_code
            .toLowerCase()
            .includes(keyword) ||
          trip.destination_airport.iata_code
            .toLowerCase()
            .includes(keyword)
      );
    }

    if (status !== "all") {
      data = data.filter(
        (trip) =>
          trip.status.toLowerCase() ===
          status.toLowerCase()
      );
    }

    switch (sort) {
      case "oldest":
        data.sort(
          (a, b) =>
            new Date(
              a.departure_date
            ).getTime() -
            new Date(
              b.departure_date
            ).getTime()
        );
        break;

      case "budget":
        data.sort(
          (a, b) =>
            Number(b.budget) -
            Number(a.budget)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(
              b.departure_date
            ).getTime() -
            new Date(
              a.departure_date
            ).getTime()
        );
    }

    return data;
  }, [
    trips,
    search,
    status,
    sort,
  ]);

  const upcomingTrips =
    trips.filter(
      (trip) =>
        trip.status.toLowerCase() ===
        "confirmed"
    ).length;

  return (
    <DashboardLayout>
      {/* Hero */}

      <ItineraryHero
        totalTrips={trips.length}
        upcomingTrips={upcomingTrips}
        totalActivities={
          totalActivities
        }
      />

      {/* Filters */}

      <div className="mt-10">
        <ItineraryFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* Itinerary List */}

      <section className="mt-12">
        <div className="mb-8">

          <span
            className="
              inline-flex
              items-center

              rounded-full

              border
              border-cyan-500/20

              bg-cyan-500/10

              px-4
              py-2

              text-sm
              font-semibold

              text-cyan-300
            "
          >
            Smart Travel Plans
          </span>

          <h2
            className="
              mt-5

              text-4xl
              font-bold

              text-foreground
            "
          >
            Your Itineraries
          </h2>

          <p
            className="
              mt-3

              max-w-2xl

              text-muted-foreground
            "
          >
            Browse, search, organize and manage every
            AI-generated travel itinerary from one
            centralized dashboard.
          </p>

        </div>

        {loading ? (
          <ItinerarySkeleton />
        ) : filteredTrips.length === 0 ? (
          <EmptyItinerary />
        ) : (
          <div className="space-y-8">
            {filteredTrips.map((trip) => (
              <ItineraryCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </div>
        )}
      </section>

      {/* Summary */}

      <section className="mt-16">
  <div className="grid gap-6 md:grid-cols-3">

    <SummaryCard
      title="Total Itineraries"
      value={trips.length}
      icon={<Map className="text-blue-500" size={24} />}
    />

    <SummaryCard
      title="Upcoming Trips"
      value={upcomingTrips}
      icon={<CalendarDays className="text-violet-500" size={24} />}
    />

    <SummaryCard
      title="Total Activities"
      value={totalActivities}
      icon={<Sparkles className="text-emerald-500" size={24} />}
    />

  </div>
</section>

    </DashboardLayout>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  valueColor?: string;
}

function SummaryCard({
  title,
  value,
  icon,
  valueColor = "text-foreground",
}: SummaryCardProps) {
  return (
    <div
      className="
        rounded-[30px]
        border
        border-border
        bg-card
        p-8
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-muted
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-8
          text-sm
          font-medium
          text-muted-foreground
        "
      >
        {title}
      </p>

      <h3
        className={`mt-3 text-5xl font-bold ${valueColor}`}
      >
        {value}
      </h3>
    </div>
  );
}
