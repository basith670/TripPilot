"use client";

import { useEffect, useState } from "react";

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
}

export default function FlightList({
  tripId,
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
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

        <p className="text-gray-600">
          Loading flights...
        </p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
          ✈️
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">
          No Flights Found
        </h3>

        <p className="mt-3 text-gray-500">
          Add a flight to this trip to get started.
        </p>

      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {flights.map(
          (flight) => (
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