"use client";

import { useState } from "react";

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

  const initialForm = {
    day_number: 1,
    date: "",
    title: "Travel Day",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
          <h2 className="text-xl font-bold sm:text-2xl">
            Add Itinerary Day
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-3xl text-gray-500 transition hover:text-red-600 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-5">
            {/* Day Number */}

            <div>
              <label className="mb-2 block font-medium">
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
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Date */}

            <div>
              <label className="mb-2 block font-medium">
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
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Title */}

            <div>
              <label className="mb-2 block font-medium">
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
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Notes */}

            <div>
              <label className="mb-2 block font-medium">
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
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-lg border px-5 py-3 transition hover:bg-gray-100 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Creating..." : "Create Day"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}