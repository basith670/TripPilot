"use client";

import { useState } from "react";

import TripForm from "@/features/trips/TripForm";
import { TripFormData } from "@/features/trips/tripSchema";
import { createTrip } from "@/services/trips.service";

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function NewTripModal({
  isOpen,
  onClose,
  onSuccess,
}: NewTripModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateTrip = async (data: TripFormData) => {
    try {
      setLoading(true);

      await createTrip({
        source_airport_id: data.source_airport_id,
        destination_airport_id: data.destination_airport_id,
        departure_date: data.departure_date,
        return_date: data.return_date,
        travelers: data.travelers,
        cabin_class: data.cabin_class,
        budget: data.budget,
        status: data.status,
        notes: data.notes ?? "",
      });

      await onSuccess();

      onClose();
    } catch (error: any) {
      console.error("Trip creation failed:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert("Failed to create trip.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Trip
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 transition hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <TripForm
            onSubmit={handleCreateTrip}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}