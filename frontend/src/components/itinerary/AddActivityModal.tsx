"use client";

import { useState } from "react";

import { createActivity } from "@/services/activity.service";

interface Props {
  isOpen: boolean;
  dayId: number;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function AddActivityModal({
  isOpen,
  dayId,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const initialForm = {
    title: "",
    location: "",
    start_time: "",
    end_time: "",
    estimated_cost: 0,
    category: "ACTIVITIES",
    priority: "MEDIUM",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createActivity({
        itinerary_day: dayId,
        ...form,
      });

      await onSuccess();

      setForm(initialForm);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">

      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">

          <h2 className="text-xl font-bold sm:text-2xl">
            Add Activity
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-red-600"
          >
            ×
          </button>

        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          <div className="space-y-5">

            {/* Title */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Activity Title
              </label>

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Burj Khalifa Visit"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />

            </div>

            {/* Location */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Downtown Dubai"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
              />

            </div>

            {/* Time */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Start Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border p-3"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      start_time: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  End Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border p-3"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      end_time: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* Cost + Category */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Estimated Cost (₹)
                </label>

                <input
                  type="number"
                  className="w-full rounded-lg border p-3"
                  placeholder="2500"
                  value={form.estimated_cost}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estimated_cost: Number(e.target.value),
                    })
                  }
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  className="w-full rounded-lg border p-3"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="ACCOMMODATION">Accommodation</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="FOOD">Food & Drinks</option>
                  <option value="ACTIVITIES">Activities</option>
                  <option value="SHOPPING">Shopping</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="MISCELLANEOUS">Miscellaneous</option>
                </select>

              </div>

            </div>

            {/* Priority */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Priority
              </label>

              <select
                className="w-full rounded-lg border p-3"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value,
                  })
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

            </div>

            {/* Notes */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Notes
              </label>

              <textarea
                rows={4}
                className="w-full rounded-lg border p-3"
                placeholder="Additional information..."
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
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
              className="w-full rounded-lg border px-5 py-3 hover:bg-gray-100 sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Creating..." : "Create Activity"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}