"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  TriangleAlert,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { deleteLayoverTrip } from "@/services/trips.service";

interface Props {
  isOpen: boolean;
  trip: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteLayoverTripModal({
  isOpen,
  trip,
  onClose,
  onSuccess,
}: Props) {
  const [mounted, setMounted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !trip)
    return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteLayoverTrip(trip.id);

      toast.success("Layover trip deleted", {
        description:
          "The layover itinerary has been removed successfully.",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      toast.error("Delete failed", {
        description:
          "Unable to delete this layover trip.",
      });
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
          w-full
          max-w-lg

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
            from-red-600
            via-rose-600
            to-orange-500

            px-8
            py-7

            text-white
          "
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

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
                "
              >
                <TriangleAlert size={30} />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  Delete Layover Trip
                </h2>

                <p className="mt-2 text-red-100">
                  This action is permanent and
                  cannot be undone.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-xl

                bg-white/10

                transition

                hover:bg-white/20
              "
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}

        <div className="space-y-6 p-8">
          <div
            className="
              rounded-3xl

              border
              border-border

              bg-muted/40

              p-6
            "
          >
            <p className="text-sm text-muted-foreground">
              Layover Route
            </p>

            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {trip.departure_airport}
              {" → "}
              {trip.destination_airport}
            </h3>

            <p className="mt-2 text-muted-foreground">
              Via {trip.layover_airport}
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              {trip.arrival_date}
            </p>
          </div>

          <div
            className="
              rounded-2xl

              border
              border-red-500/20

              bg-red-500/10

              p-5
            "
          >
            <p className="font-semibold text-red-600 dark:text-red-400">
              Warning
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Deleting this layover trip will permanently
              remove the AI itinerary, airport plan,
              recommendations and travel information.
            </p>
          </div>
        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-4

            border-t
            border-border

            bg-muted/30

            p-6
          "
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="
              rounded-2xl

              border
              border-border

              bg-card

              px-6
              py-3

              font-semibold

              text-foreground

              transition

              hover:bg-muted
            "
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2

              rounded-2xl

              bg-gradient-to-r
              from-red-600
              to-rose-600

              px-6
              py-3

              font-semibold
              text-white

              shadow-lg

              transition

              hover:-translate-y-0.5
              hover:shadow-red-500/30

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Trash2 size={18} />

            {loading
              ? "Deleting..."
              : "Delete Layover"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}