"use client";

import { useEffect, useState } from "react";

import FlightSkeleton from "./FlightSkeleton";

import EmptyFlights from "./EmptyFlights";

import FlightCard from "./FlightCard";
import FlightDetailsModal from "./FlightDetailsModal";
import EditFlightModal from "./EditFlightModal";

import ConfirmDialog from "@/components/common/ConfirmDialog";

import { Flight } from "@/types/flight";

import {
  getFlights,
  deleteFlight,
} from "@/services/flight.service";

import {
  getTrip,
  selectFlight,
} from "@/services/trips.service";

import { toast } from "sonner";

import BoardingPassModal from "@/features/flights/components/BoardingPassModal";

interface FlightListProps {
    tripId: number;
    search: string;
    status: string;
    sort: string;
  }

  export default function FlightList({
    tripId,
    search,
    status,
    sort,
  }: FlightListProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFlightId, setSelectedFlightId] =
    useState<number | null>(null);

  const [selectedFlight, setSelectedFlight] =
    useState<Flight | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [editingFlight, setEditingFlight] =
    useState<Flight | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deletingFlight, setDeletingFlight] =
    useState<Flight | null>(null);

  const [selecting, setSelecting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

const [boardingPassOpen, setBoardingPassOpen] =
    useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const [flightData, trip] =
        await Promise.all([
          getFlights({
            trip: tripId,
          }),
          getTrip(tripId),
        ]);

      setSelectedFlightId(
        trip.selected_flight ?? null
      );

      const sortedFlights = [...flightData].sort(
        (a, b) => {
          if (a.id === trip.selected_flight)
            return -1;

          if (b.id === trip.selected_flight)
            return 1;

          return 0;
        }
      );

      setFlights(sortedFlights);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load flights."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [tripId]);

  const handleView = (
    flight: Flight
  ) => {
    setSelectedFlight(flight);
    setDetailsOpen(true);
  };

  const handleEdit = (
    flight: Flight
  ) => {
    setEditingFlight(flight);
    setEditOpen(true);
  };

  const handleDeleteClick = (
    flight: Flight
  ) => {
    setDeletingFlight(flight);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingFlight) return;

    try {
      setDeleting(true);

      await deleteFlight(
        deletingFlight.id
      );

      toast.success(
        "Flight deleted successfully."
      );

      if (
        deletingFlight.id ===
        selectedFlightId
      ) {
        setSelectedFlightId(null);
      }

      setDeleteOpen(false);
      setDeletingFlight(null);

      await fetchFlights();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete flight."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDetails = () => {
    if (selecting) return;

    setDetailsOpen(false);

    setTimeout(() => {
      setSelectedFlight(null);
    }, 200);
  };

  const handleSelect = async (
    flight: Flight
  ) => {
    if (
      flight.id === selectedFlightId
    )
      return;

    try {
      setSelecting(true);

      await selectFlight(
        tripId,
        flight.id
      );

      toast.success(
        "Flight selected successfully."
      );

      setSelectedFlightId(
        flight.id
      );

      setDetailsOpen(false);
      setSelectedFlight(null);

      await fetchFlights();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to select flight."
      );
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return <FlightSkeleton />;
  }

  const filteredFlights = [...flights]
  .filter((flight) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();

    return (
      flight.airline_name.toLowerCase().includes(query) ||
      flight.flight_number.toLowerCase().includes(query) ||
      flight.source_iata.toLowerCase().includes(query) ||
      flight.destination_iata.toLowerCase().includes(query)
    );
  })
  .filter((flight) => {
    if (status === "all") return true;

    return (
      flight.status.toLowerCase() === status.toLowerCase()
    );
  })
  .sort((a, b) => {
    switch (sort) {
      case "price":
        return Number(b.price) - Number(a.price);

      case "duration":
        return b.duration_minutes - a.duration_minutes;

      case "oldest":
        return (
          new Date(a.departure_datetime).getTime() -
          new Date(b.departure_datetime).getTime()
        );

      default:
        return (
          new Date(b.departure_datetime).getTime() -
          new Date(a.departure_datetime).getTime()
        );
    }
  });

  if (filteredFlights.length === 0) {
    return <EmptyFlights />;
  }

  return (
    <>
      <div className="space-y-6">
      {filteredFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              isSelected={
                flight.id ===
                selectedFlightId
              }
              onView={
                handleView
              }
              onEdit={
                handleEdit
              }
              onDelete={
                handleDeleteClick
              }
              onSelect={
                handleSelect
              }
            />
          )
        )}
      </div>

      <FlightDetailsModal
        isOpen={detailsOpen}
        flight={selectedFlight}
        onClose={handleCloseDetails}
        onBoardingPass={() => {
            setDetailsOpen(false);

            setTimeout(() => {
            setBoardingPassOpen(true);
            }, 200);
        }}
        onSelect={() => {
            if (selectedFlight) {
            handleSelect(selectedFlight);
            }
        }}
        />

      <EditFlightModal
        isOpen={editOpen}
        flight={
          editingFlight
        }
        onClose={() => {
          setEditOpen(false);
          setEditingFlight(null);
        }}
        onSuccess={async () => {
          await fetchFlights();

          setEditOpen(false);
          setEditingFlight(null);
        }}
      />

        <BoardingPassModal
        isOpen={boardingPassOpen}
        flight={selectedFlight}
        onClose={() => {
            setBoardingPassOpen(false);
        }}
        />

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete Flight?"
        message="Are you sure you want to delete this flight? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        onConfirm={
          handleDelete
        }
        onCancel={() => {
          if (deleting)
            return;

          setDeleteOpen(false);
          setDeletingFlight(null);
        }}
      />
    </>
  );
}