"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import TripsHero from "@/components/trips/TripsHero";
import TripsFilters from "@/components/trips/TripsFilters";
import TripCard from "@/components/trips/TripCard";
import LayoverTripCard from "@/components/trips/LayoverTripCard";

import NewTripModal from "@/components/forms/NewTripModal";
import EditTripModal from "@/components/forms/EditTripModal";
import DeleteTripModal from "@/components/forms/DeleteTripModal";
import DeleteLayoverTripModal from "@/components/forms/DeleteLayoverTripModal";

import {
  getTrips,
  getLayoverTrips,
} from "@/services/trips.service";

import {
  Map,
  Plane,
  Route,
} from "lucide-react";

import { Trip } from "@/types/trip";

export default function TripsPage() {
  const [trips, setTrips] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* Filters */

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("latest");

  /* Create */

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  /* Edit */

  const [selectedTrip, setSelectedTrip] =
    useState<Trip | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  /* Delete */

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  /* Layover Delete */

  const [
    selectedLayoverTrip,
    setSelectedLayoverTrip,
  ] = useState<any>(null);

  const [
    isLayoverDeleteOpen,
    setIsLayoverDeleteOpen,
  ] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const [
        normalTrips,
        layoverTrips,
      ] = await Promise.all([
        getTrips(),
        getLayoverTrips(),
      ]);

      const formattedLayovers =
        layoverTrips.map((trip: any) => ({
          id: `layover-${trip.id}`,
          title:
            trip.ai_result?.airport ??
            `${trip.layover_airport} Layover`,
          overview:
            trip.ai_result?.summary ?? "",
          departure_date:
            trip.arrival_date,
          return_date:
            trip.departure_date,
          budget:
            trip.budget,
          travelers: 1,
          cabin_class: "Layover",
          status: "LAYOVER",
          from:
            trip.departure_airport,
          to:
            trip.destination_airport,
          isLayover: true,
          raw: trip,
        }));

      setTrips([
        ...formattedLayovers,
        ...normalTrips,
      ]);
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

      data = data.filter((trip: any) => {
        return (
          trip.from
            ?.toLowerCase()
            .includes(keyword) ||
          trip.to
            ?.toLowerCase()
            .includes(keyword) ||
          trip.title
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    if (status !== "all") {
      data = data.filter(
        (trip: any) =>
          trip.status.toLowerCase() ===
          status.toLowerCase()
      );
    }

    switch (sort) {
      case "oldest":
        data.sort(
          (a: any, b: any) =>
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
          (a: any, b: any) =>
            Number(b.budget) -
            Number(a.budget)
        );
        break;

      default:
        data.sort(
          (a: any, b: any) =>
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

  const totalLayovers =
    trips.filter(
      (trip: any) => trip.isLayover
    ).length;

  const handleEdit = (
    trip: Trip
  ) => {
    setSelectedTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleDelete = (
    trip: Trip
  ) => {
    setSelectedTrip(trip);
    setIsDeleteModalOpen(true);
  };

  const handleLayoverDelete = (
    trip: any
  ) => {
    setSelectedLayoverTrip(trip);
    setIsLayoverDeleteOpen(true);
  };

  return (
    <DashboardLayout>
  
      {/* Hero */}
  
      <TripsHero
        totalTrips={trips.length}
        totalLayovers={totalLayovers}
        onCreate={() => setIsModalOpen(true)}
      />
  
      {/* Filters */}
  
      <div className="mt-10">
        <TripsFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />
      </div>
  
      {/* Header */}
  
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
            Trip Collection
          </span>
  
          <h2 className="mt-5 text-4xl font-bold text-foreground">
            All Trips
          </h2>
  
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Manage every AI planned trip, layover and travel itinerary
            from one beautiful dashboard.
          </p>
  
        </div>
  
        {loading ? (
  
          <div
            className="
              rounded-[32px]
              border
              border-border
              bg-card
              p-16
              shadow-xl
            "
          >
            <div
              className="
                mx-auto
                h-14
                w-14
                animate-spin
                rounded-full
                border-4
                border-cyan-500
                border-t-transparent
              "
            />
  
            <p className="mt-6 text-center text-muted-foreground">
              Loading your trips...
            </p>
  
          </div>
  
        ) : filteredTrips.length === 0 ? (
  
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
  
            <h3 className="text-4xl font-bold text-foreground">
              No Trips Found
            </h3>
  
            <p className="mt-5 text-muted-foreground">
              Create your first AI-powered journey to begin planning.
            </p>
  
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                mt-8
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                via-cyan-500
                to-indigo-600
                px-8
                py-3
                font-semibold
                text-white
                shadow-lg
                transition-all
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              Create Trip
            </button>
  
          </div>
  
        ) : (
  
          <div className="space-y-8">
  
            {filteredTrips.map((trip: any) =>
  
              trip.isLayover ? (
  
                <LayoverTripCard
                  key={trip.raw.id}
                  trip={trip.raw}
                  onDelete={handleLayoverDelete}
                />
  
              ) : (
  
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
  
              )
  
            )}
  
          </div>
  
        )}
  
      </section>
  
      {/* Summary */}
  
      <section className="mt-16">
  <div className="grid gap-6 md:grid-cols-3">

    <SummaryCard
      title="Total Trips"
      value={trips.length}
      icon={<Map className="text-blue-500" size={24} />}
    />

    <SummaryCard
      title="Layover Trips"
      value={totalLayovers}
      icon={<Route className="text-violet-500" size={24} />}
    />

    <SummaryCard
      title="Planned Trips"
      value={filteredTrips.length}
      icon={<Plane className="text-emerald-500" size={24} />}
    />

  </div>
</section>
  
      {/* Create */}
  
      <NewTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTrips}
      />
  
      {/* Edit */}
  
      <EditTripModal
        isOpen={isEditModalOpen}
        trip={selectedTrip}
        onClose={() => {
          setSelectedTrip(null);
          setIsEditModalOpen(false);
        }}
        onSuccess={fetchTrips}
      />
  
      {/* Delete */}
  
      <DeleteTripModal
        isOpen={isDeleteModalOpen}
        trip={selectedTrip}
        onClose={() => {
          setSelectedTrip(null);
          setIsDeleteModalOpen(false);
        }}
        onSuccess={fetchTrips}
      />
  
      {/* Layover Delete */}
  
      <DeleteLayoverTripModal
        isOpen={isLayoverDeleteOpen}
        trip={selectedLayoverTrip}
        onClose={() => {
          setSelectedLayoverTrip(null);
          setIsLayoverDeleteOpen(false);
        }}
        onSuccess={fetchTrips}
      />
  
    </DashboardLayout>
  );

  
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
  
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          {title}
        </p>
  
        <h3 className={`mt-3 text-5xl font-bold ${valueColor}`}>
          {value}
        </h3>
      </div>
    );
  }
}