"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import HotelHero from "../../components/hotels/HotelHero";
import HotelFilters from "../../components/hotels/HotelFilters";
import HotelSummary from "../../components/hotels/HotelSummary";
import HotelList from "@/components/hotels/HotelList";
import AddHotelModal from "@/components/hotels/AddHotelModal";

import { getTrips } from "@/services/trips.service";
import { getHotels } from "@/services/hotel.service";

import { Trip } from "@/types/trip";
import { Hotel } from "@/types/hotel";

export default function HotelsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [selectedTrip, setSelectedTrip] =
    useState<number>();

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("latest");

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  /* ---------------- Trips ---------------- */

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getTrips();

        setTrips(data);

        if (data.length > 0) {
          setSelectedTrip(data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  /* ---------------- Hotels ---------------- */

  useEffect(() => {
    const loadHotels = async () => {
      if (!selectedTrip) {
        setHotels([]);
        return;
      }

      try {
        const data = await getHotels({
          trip: selectedTrip,
        });

        setHotels(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadHotels();
  }, [selectedTrip, refreshKey]);

  /* ---------------- Statistics ---------------- */

  const totalHotels = hotels.length;

  const reservedHotels = hotels.filter(
    (hotel) => hotel.status === "RESERVED"
  ).length;

  const selectedHotels = trips.find(
    (trip) => trip.id === selectedTrip
  )?.selected_hotel
    ? 1
    : 0;

  const totalCost = hotels.reduce(
    (sum, hotel) =>
      sum + Number(hotel.price),
    0
  );

  /* ---------------- Trip Options ---------------- */

  const tripOptions = trips.map((trip) => ({
    id: trip.id,
    label: `${trip.source_airport.iata_code} → ${trip.destination_airport.iata_code}`,
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <p className="text-lg text-slate-500">
            Loading trips...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* Hero */}

        <HotelHero
          totalHotels={totalHotels}
          reservedHotels={reservedHotels}
          selectedHotels={selectedHotels}
        />

        {/* Filters */}

        <HotelFilters
          search={search}
          setSearch={setSearch}
          trip={String(selectedTrip ?? "all")}
          setTrip={(value) => {
            setSelectedTrip(Number(value));
          }}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
          trips={tripOptions}
        />

        {/* Hotel List */}

        {selectedTrip ? (
          <HotelList
            key={refreshKey}
            tripId={selectedTrip}
            search={search}
            status={status}
            sort={sort}
          />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg">
            <p className="text-slate-500">
              No trips available.
            </p>
          </div>
        )}

        {/* Summary */}

        <HotelSummary
          totalHotels={totalHotels}
          selectedHotels={selectedHotels}
          totalCost={totalCost}
        />

        {/* Add Hotel */}

        <AddHotelModal
          isOpen={addModalOpen}
          tripId={selectedTrip ?? 0}
          onClose={() =>
            setAddModalOpen(false)
          }
          onSuccess={async () => {
            setRefreshKey(
              (prev) => prev + 1
            );

            setAddModalOpen(false);
          }}
        />

      </div>
    </DashboardLayout>
  );
}