"use client";

import { useEffect, useState } from "react";

import { updateActivity } from "@/services/activity.service";

interface Activity {
  id: number;
  itinerary_day: number;
  title: string;
  location: string;
  start_time: string;
  end_time?: string;
  estimated_cost: string;
  priority: string;
  notes: string;
}

interface Props {
  isOpen: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
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
    estimated_cost: "",
    priority: "MEDIUM",
    notes: "",
  });

  useEffect(() => {
    if (isOpen && activity) {
      setForm({
        title: activity.title,
        location: activity.location,
        start_time: activity.start_time,
        end_time: activity.end_time || "",
        estimated_cost: activity.estimated_cost,
        priority: activity.priority,
        notes: activity.notes,
      });
    }
  }, [isOpen]);

  if (!isOpen || !activity) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateActivity(activity.id, {
        title: form.title,
        location: form.location,
        start_time: form.start_time,
        end_time: form.end_time,
        estimated_cost: Number(form.estimated_cost),
        priority: form.priority,
        notes: form.notes,
      });

      await onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">
          Edit Activity
        </h2>

        <div className="space-y-4">
          <input
            className="w-full rounded-lg border p-3"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />

          <input
            className="w-full rounded-lg border p-3"
            value={form.location}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              className="rounded-lg border p-3"
              value={form.start_time}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  start_time: e.target.value,
                }))
              }
            />

            <input
              type="time"
              className="rounded-lg border p-3"
              value={form.end_time}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  end_time: e.target.value,
                }))
              }
            />
          </div>

          <input
            type="number"
            className="w-full rounded-lg border p-3"
            placeholder="Estimated Cost"
            value={form.estimated_cost}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                estimated_cost: e.target.value,
              }))
            }
          />

          <select
            className="w-full rounded-lg border p-3"
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

          <textarea
            rows={4}
            className="w-full rounded-lg border p-3"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
          />
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
            {loading ? "Updating..." : "Update Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}