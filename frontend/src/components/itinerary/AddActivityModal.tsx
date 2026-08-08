"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  Calendar,
  Clock3,
  MapPin,
  IndianRupee,
  Flag,
  FileText,
  X,
  Plus,
} from "lucide-react";

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

  const [mounted, setMounted] =
  useState(false);

useEffect(() => {
  setMounted(true);
}, []);

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

  if (!mounted || !isOpen) return null;

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
                New Activity
              </span>
  
              <h2 className="mt-4 text-3xl font-bold">
                Add Activity
              </h2>
  
              <p className="mt-2 text-blue-100">
                Add an activity to your itinerary.
              </p>
  
            </div>
  
            <button
              onClick={onClose}
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
  
                <Plus size={18} />
  
                Activity Title
  
              </label>
  
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Burj Khalifa Visit"
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
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                placeholder="Downtown Dubai"
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
                    setForm({
                      ...form,
                      start_time: e.target.value,
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
                    setForm({
                      ...form,
                      end_time: e.target.value,
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
      setForm({
        ...form,
        estimated_cost: Number(e.target.value),
      })
    }
    placeholder="2500"
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
      setForm({
        ...form,
        category: e.target.value,
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
  >
    <option value="ACCOMMODATION">
      Accommodation
    </option>

    <option value="TRANSPORT">
      Transport
    </option>

    <option value="FOOD">
      Food & Drinks
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

<label className="mb-2 font-semibold text-foreground block">
  Priority
</label>

<select
  value={form.priority}
  onChange={(e) =>
    setForm({
      ...form,
      priority: e.target.value,
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
    setForm({
      ...form,
      notes: e.target.value,
    })
  }
  placeholder="Additional information..."
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
to-cyan-600

px-7
py-3

font-semibold

text-white

shadow-lg

transition

hover:-translate-y-0.5

disabled:opacity-50
"
>
{loading
? "Creating..."
: "Create Activity"}
</button>

</div>

</div>

</div>,
document.body
);
}