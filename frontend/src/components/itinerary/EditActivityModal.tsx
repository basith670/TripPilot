"use client";

import { useEffect, useState } from "react";

import { updateActivity } from "@/services/activity.service";
import { Activity } from "@/types/itinerary";

import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function EditActivityModal({
  isOpen,
  activity,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    start_time: "",
    end_time: "",
    estimated_cost: 0,
    category: "ACTIVITIES",
    priority: "MEDIUM",
    notes: "",
  });

  useEffect(() => {
    if (isOpen && activity) {
      setForm({
        title: activity.title,
        location: activity.location ?? "",
        start_time: activity.start_time,
        end_time: activity.end_time ?? "",
        estimated_cost: activity.estimated_cost,
        category: activity.category,
        priority: activity.priority,
        notes: activity.notes ?? "",
      });
    }
  }, [isOpen, activity]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  if (!isOpen || !activity) return null;

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Activity title is required.");
      return;
    }

    try {
      setLoading(true);

      await updateActivity(activity.id, {
        title: form.title.trim(),
        location: form.location,
        start_time: form.start_time,
        end_time: form.end_time || undefined,
        estimated_cost: Number(form.estimated_cost),
        category: form.category,
        priority: form.priority,
        notes: form.notes,
      });

      toast.success("Activity updated successfully.");

      await onSuccess();

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update activity.");
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
            Edit Activity
          </h2>

          <button
            onClick={handleClose}
            disabled={loading}
            className="text-3xl text-gray-500 transition hover:text-red-600 disabled:opacity-50"
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
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
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
                  className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      start_time: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  End Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      end_time: e.target.value,
                    }))
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
                  className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                  value={form.estimated_cost}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estimated_cost: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="ACCOMMODATION">
                    Accommodation
                  </option>
                  <option value="TRANSPORT">
                    Transport
                  </option>
                  <option value="FOOD">
                    Food
                  </option>
                  <option value="ACTIVITIES">
                    Activities
                  </option>
                  <option value="SHOPPING">
                    Shopping
                  </option>
                  <option value="ENTERTAINMENT">
                    Entertainment
                  </option>
                  <option value="MISCELLANEOUS">
                    Miscellaneous
                  </option>
                </select>
              </div>
            </div>

            {/* Priority */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Priority
              </label>

              <select
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
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
                rows={5}
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full rounded-lg border px-5 py-3 transition hover:bg-gray-100 disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Updating..." : "Update Activity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}