"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  Calendar,
  Clock3,
  MapPin,
  Pencil,
  IndianRupee,
  Flag,
  FileText,
  X,
} from "lucide-react";

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

  const [mounted, setMounted] =
    useState(false);

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
    setMounted(true);
  }, []);

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

  if (!mounted || !isOpen || !activity)
    return null;

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error(
        "Activity title is required."
      );
      return;
    }

    try {
      setLoading(true);

      await updateActivity(activity.id, {
        title: form.title.trim(),
        location: form.location,
        start_time: form.start_time,
        end_time:
          form.end_time || undefined,
        estimated_cost: Number(
          form.estimated_cost
        ),
        category: form.category,
        priority: form.priority,
        notes: form.notes,
      });

      toast.success(
        "Activity updated successfully."
      );

      await onSuccess();

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update activity."
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
          max-w-4xl

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
                Edit Activity
              </span>

              <h2 className="mt-4 text-3xl font-bold">
                Update Activity
              </h2>

              <p className="mt-2 text-blue-100">
                Modify your itinerary activity.
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

                Activity Title

              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
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

            {/* Location */}

            <div>

              <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                <MapPin size={18} />

                Location

              </label>

              <input
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    location: e.target.value,
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

            {/* Time */}

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                  <Clock3 size={18} />

                  Start Time

                </label>

                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      start_time:
                        e.target.value,
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
                  "
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

                  <Calendar size={18} />

                  End Time

                </label>

                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      end_time:
                        e.target.value,
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
                  "
                />

              </div>

            </div>

                        {/* Cost + Category */}

                        <div className="grid gap-6 md:grid-cols-2">

<div>

  <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

    <IndianRupee size={18} />

    Estimated Cost

  </label>

  <input
    type="number"
    value={form.estimated_cost}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        estimated_cost: Number(e.target.value),
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

<div>

  <label className="mb-2 flex items-center gap-2 font-semibold text-foreground">

    <Flag size={18} />

    Category

  </label>

  <select
    value={form.category}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        category: e.target.value,
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

<label className="mb-2 block font-semibold text-foreground">
  Priority
</label>

<select
  value={form.priority}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      priority: e.target.value,
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
>
  <option value="LOW">
    Low
  </option>

  <option value="MEDIUM">
    Medium
  </option>

  <option value="HIGH">
    High
  </option>

</select>

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
? "Updating..."
: "Update Activity"}
</button>

</div>

</div>

</div>,
document.body
);
}