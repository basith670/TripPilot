"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  Calendar,
  FileText,
  Pencil,
  X,
} from "lucide-react";

import { updateItineraryDay } from "@/services/itinerary.service";
import { ItineraryDay } from "@/types/itinerary";

import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  day: ItineraryDay | null;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function EditDayModal({
  isOpen,
  day,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && day) {
      setForm({
        title: day.title,
        date: day.date,
        notes: day.notes ?? "",
      });
    }
  }, [isOpen, day]);

  const handleClose = () => {
    if (loading) return;

    onClose();
  };

  if (!mounted || !isOpen || !day)
    return null;

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Day title is required.");
      return;
    }

    if (!form.date) {
      toast.error("Please select a date.");
      return;
    }

    try {
      setLoading(true);

      await updateItineraryDay(day.id, {
        title: form.title.trim(),
        date: form.date,
        notes: form.notes,
      });

      toast.success(
        "Day updated successfully."
      );

      await onSuccess();

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update day."
      );
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
          max-w-3xl

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
                Edit Day
              </span>

              <h2 className="mt-4 text-3xl font-bold">
                Update Itinerary Day
              </h2>

              <p className="mt-2 text-blue-100">
                Modify your itinerary day information.
              </p>

            </div>

            <button
              onClick={handleClose}
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

                disabled:opacity-50
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
          <div className="grid gap-6">

            {/* Title */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <Pencil size={18} />

                Day Title

              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Arrival in Dubai"
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
                  setForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
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

            {/* Notes */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <FileText size={18} />

                Notes

              </label>

              <textarea
                rows={6}
                value={form.notes}
                placeholder="Write notes for this day..."
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
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
            onClick={handleClose}
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

              disabled:cursor-not-allowed
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

              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0
            "
          >
            {loading
              ? "Updating..."
              : "Update Day"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}