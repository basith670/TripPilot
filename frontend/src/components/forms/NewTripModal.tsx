"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { X, Plane } from "lucide-react";

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleCreateTrip = async (
    data: TripFormData
  ) => {
    try {
      setLoading(true);

      await createTrip({
        source_airport_id: data.source_airport_id,
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

      onClose();
    } catch (error: unknown) {
      console.error(
        "Trip creation failed:",
        error
      );

      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          alert(
            JSON.stringify(
              error.response.data,
              null,
              2
            )
          );
        } else {
          alert("Failed to create trip.");
        }
      } else {
        alert("Failed to create trip.");
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
            from-blue-600
            via-cyan-600
            to-indigo-600

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
                <Plane size={30} />
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Create New Trip
                </h2>

                <p className="mt-2 text-blue-100">
                  Plan your next journey with AI-powered
                  travel assistance.
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

                hover:bg-red-500
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
            onSubmit={
              handleCreateTrip
            }
            loading={loading}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}