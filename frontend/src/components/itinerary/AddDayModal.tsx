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

  const [form, setForm] = useState({
    day_number: 1,
    date: "",
    title: "Travel Day",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createItineraryDay({
        trip: Number(tripId),
        ...form,
      });

      await onSuccess();

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create itinerary day.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold">
          Add Itinerary Day
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Day Number
            </label>

            <input
              type="number"
              value={form.day_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  day_number: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

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
              className="w-full rounded-lg border p-3"
            />
          </div>

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
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Day"}
          </button>
        </div>
      </div>
    </div>
  );
}