"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Pencil,
  X,
} from "lucide-react";

import TripForm from "@/features/trips/TripForm";
import { TripFormData } from "@/features/trips/tripSchema";
import { updateTrip } from "@/services/trips.service";
import { Trip } from "@/types/trip";

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  trip: Trip | null;
}

export default function EditTripModal({
  isOpen,
  onClose,
  onSuccess,
  trip,
}: EditTripModalProps) {
  const [loading, setLoading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !trip)
    return null;

  const handleUpdateTrip = async (
    data: TripFormData
  ) => {
    try {
      setLoading(true);

      await updateTrip(trip.id, {
        source_airport_id:
          data.source_airport_id,

        destination_airport_id:
          data.destination_airport_id,

        departure_date:
          data.departure_date,

        return_date:
          data.return_date,

        travelers:
          data.travelers,

        cabin_class:
          data.cabin_class,

        budget:
          data.budget,

        status:
          data.status,

        notes:
          data.notes ?? "",
      });

      await onSuccess();

      toast.success(
        "Trip updated successfully!",
        {
          description:
            "Your itinerary has been updated.",
        }
      );

      onClose();
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          "Failed to update trip",
          {
            description:
              error.response?.data
                ?.detail ??
              "Something went wrong while updating your trip.",
          }
        );
      } else {
        toast.error(
          "Failed to update trip",
          {
            description:
              "An unexpected error occurred.",
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]

        flex
        items-center
        justify-center

        bg-black/60

        p-4

        backdrop-blur-md
      "
    >
      <div
        className="
          relative

          flex
          w-full
          max-w-6xl
          max-h-[92vh]
          flex-col
          overflow-hidden

          rounded-[32px]

          border
          border-border

          bg-card

          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            relative
            overflow-hidden

            bg-gradient-to-r
            from-amber-500
            via-orange-500
            to-red-500

            px-8
            py-7

            text-white
          "
        >
          {/* Glow */}

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-start justify-between">

            <div className="flex items-center gap-5">

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center

                  rounded-2xl

                  bg-white/15

                  backdrop-blur
                "
              >
                <Pencil size={28} />
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Edit Trip
                </h2>

                <p className="mt-2 text-orange-100">
                  Update your itinerary and
                  keep your travel plans
                  synchronized.
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-white/10

                transition-all

                hover:bg-red-600
              "
            >
              <X size={22} />
            </button>

          </div>

        </div>

        {/* Form */}

        <div
          className="
            flex-1
            overflow-y-auto

            bg-card

            p-6
            lg:p-8
          "
        >
          <TripForm
            initialData={{
              source_airport_id:
                trip.source_airport.id,

              destination_airport_id:
                trip.destination_airport.id,

              departure_date:
                trip.departure_date,

              return_date:
                trip.return_date ?? "",

              travelers:
                trip.travelers,

              cabin_class:
                trip.cabin_class,

              budget: Number(
                trip.budget
              ),

              status:
                trip.status,

              notes:
                trip.notes ?? "",
            }}
            onSubmit={
              handleUpdateTrip
            }
            loading={loading}
          />
        </div>

      </div>

    </div>,
    document.body
  );
}