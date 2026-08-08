"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  Calendar,
  FileText,
  Hash,
  Plus,
  X,
} from "lucide-react";

import { createItineraryDay } from "@/services/itinerary.service";

interface AddDayModalProps {
  isOpen: boolean;
  tripId: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function AddDayModal({
  isOpen,
  tripId,
  onClose,
  onSuccess,
}: AddDayModalProps) {
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialForm = {
    day_number: 1,
    date: "",
    title: "Travel Day",
    notes: "",
  };

  const [form, setForm] =
    useState(initialForm);

  if (!mounted || !isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createItineraryDay({
        trip: Number(tripId),
        ...form,
      });

      await onSuccess();

      setForm(initialForm);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create itinerary day.");
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

        backdrop-blur-md

        p-4
      "
    >
      <div
        className="
          flex

          w-full
          max-w-2xl

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
            sticky
            top-0
            z-10

            bg-gradient-to-r
            from-blue-600
            via-cyan-600
            to-indigo-600

            px-8
            py-6

            text-white
          "
        >
          <div className="flex items-center justify-between">

            <div>

              <span
                className="
                  rounded-full
                  bg-white/20
                  px-4
                  py-2
                  text-sm
                  font-semibold
                "
              >
                New Day
              </span>

              <h2 className="mt-4 text-3xl font-bold">
                Add Itinerary Day
              </h2>

              <p className="mt-2 text-blue-100">
                Organize your trip one day at a time.
              </p>

            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-2xl

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

        <div
          className="
            flex-1

            overflow-y-auto

            p-8
          "
        >
          <div className="space-y-6">

            {/* Day Number */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <Hash size={18} />

                Day Number

              </label>

              <input
                type="number"
                min={1}
                value={form.day_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    day_number: Number(e.target.value),
                  })
                }
                className="
                  w-full

                  rounded-2xl

                  border
                  border-border

                  bg-background

                  px-5
                  py-3

                  text-foreground

                  outline-none

                  transition

                  focus:border-blue-500
                "
              />

            </div>

            {/* Date */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <Calendar size={18} />

                Date

              </label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
                className="
                  w-full

                  rounded-2xl

                  border
                  border-border

                  bg-background

                  px-5
                  py-3

                  text-foreground

                  outline-none

                  transition

                  focus:border-blue-500
                "
              />

            </div>

            {/* Title */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <Plus size={18} />

                Title

              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Travel Day"
                className="
                  w-full

                  rounded-2xl

                  border
                  border-border

                  bg-background

                  px-5
                  py-3

                  text-foreground

                  outline-none

                  transition

                  focus:border-blue-500
                "
              />

            </div>

            {/* Notes */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <FileText size={18} />

                Notes

              </label>

              <textarea
                rows={5}
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                placeholder="Additional notes..."
                className="
                  w-full

                  rounded-2xl

                  border
                  border-border

                  bg-background

                  px-5
                  py-3

                  text-foreground

                  outline-none

                  transition

                  focus:border-blue-500
                "
              />

            </div>

          </div>

        </div>

        {/* Footer */}

        <div
          className="
            sticky
            bottom-0

            flex
            justify-end
            gap-4

            border-t
            border-border

            bg-card

            px-8
            py-6
          "
        >

          <button
            onClick={onClose}
            disabled={loading}
            className="
              rounded-2xl

              border
              border-border

              bg-background

              px-6
              py-3

              font-semibold

              text-foreground

              transition

              hover:bg-muted

              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              rounded-2xl

              bg-gradient-to-r
              from-blue-600
              via-cyan-600
              to-indigo-600

              px-7
              py-3

              font-semibold

              text-white

              shadow-lg

              transition-all

              hover:-translate-y-0.5
              hover:shadow-xl

              disabled:opacity-50
              disabled:hover:translate-y-0
            "
          >
            {loading
              ? "Creating..."
              : "Create Day"}
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
}