"use client";

import { useState } from "react";

import { createActivity } from "@/services/activity.service";

interface Props {
  isOpen: boolean;
  dayId: number;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function AddActivityModal({
  isOpen,
  dayId,
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
    priority: "MEDIUM",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createActivity({
        itinerary_day: dayId,
        ...form,
      });

      await onSuccess();

      onClose();

      setForm({
        title: "",
        location: "",
        start_time: "",
        end_time: "",
        estimated_cost: 0,
        priority: "MEDIUM",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">
          Add Activity
        </h2>

        <div className="space-y-4">

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Activity Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="time"
              className="rounded-lg border p-3"
              value={form.start_time}
              onChange={(e) =>
                setForm({
                  ...form,
                  start_time: e.target.value,
                })
              }
            />

            <input
              type="time"
              className="rounded-lg border p-3"
              value={form.end_time}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_time: e.target.value,
                })
              }
            />

          </div>

          <input
            type="number"
            className="w-full rounded-lg border p-3"
            placeholder="Estimated Cost"
            value={form.estimated_cost}
            onChange={(e) =>
              setForm({
                ...form,
                estimated_cost: Number(e.target.value),
              })
            }
          />

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

          <textarea
            rows={4}
            className="w-full rounded-lg border p-3"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
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
            {loading ? "Creating..." : "Create Activity"}
          </button>

        </div>
      </div>
    </div>
  );
}