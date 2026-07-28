"use client";

import { useState } from "react";

import { deleteTrip } from "@/services/trips.service";

interface DeleteTripModalProps {
  isOpen: boolean;
  trip: any;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function DeleteTripModal({
  isOpen,
  trip,
  onClose,
  onSuccess,
}: DeleteTripModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !trip) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteTrip(trip.id);

      await onSuccess();

      onClose();
    } catch (error) {
      console.error("Failed to delete trip:", error);
      alert("Failed to delete trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Delete Trip
          </h2>
        </div>

        <div className="space-y-3 p-6">
          <p className="text-gray-600">
            Are you sure you want to delete this trip?
          </p>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="font-semibold">
              {trip.source_airport.iata_code} →{" "}
              {trip.destination_airport.iata_code}
            </p>

            <p className="text-sm text-gray-500">
              {trip.departure_date}
            </p>
          </div>

          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Trip"}
          </button>
        </div>
      </div>
    </div>
  );
}