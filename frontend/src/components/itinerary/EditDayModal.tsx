"use client";

import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen && day) {
      setForm({
        title: day.title,
        date: day.date,
        notes: day.notes ?? "",
      });
    }
  }, [isOpen, day]);

  // Disable body scroll
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC key closes modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, loading]);

  const handleClose = () => {
    if (loading) return;

    setForm({
      title: "",
      date: "",
      notes: "",
    });

    onClose();
  };

  if (!isOpen || !day) return null;

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

      toast.success("Day updated successfully.");

      await onSuccess();

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update day.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-5">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Edit Day
          </h2>

          <button
            onClick={handleClose}
            disabled={loading}
            className="text-3xl font-light text-gray-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-6">
            {/* Day Title */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Day Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Day Title"
                className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Notes */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Notes
              </label>

              <textarea
                rows={7}
                value={form.notes}
                placeholder="Add notes for this itinerary day..."
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="min-h-44 w-full rounded-lg border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="sticky bottom-0 border-t bg-white px-5 py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Updating..." : "Update Day"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}