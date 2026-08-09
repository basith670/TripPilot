"use client";

import { useEffect, useState } from "react";

import AddActivityModal from "./AddActivityModal";
import EditActivityModal from "./EditActivityModal";

import ConfirmDialog from "@/components/common/ConfirmDialog";

import {
  deleteActivity,
  getActivities,
} from "@/services/activity.service";

import { toast } from "sonner";

import { Activity } from "@/types/itinerary";

interface Props {
  dayId: number;
  onActivityChanged?: () => void;
}

export default function ActivitySection({
  dayId,
  onActivityChanged,
}: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] =
    useState<number | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const data = await getActivities(dayId);

      data.sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );

      setActivities(data);
    } catch (error) {
      console.error(
        "Failed to load activities:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [dayId]);

  const handleDelete = async () => {
    if (selectedActivityId === null) return;
  
    try {
      setDeleting(true);
  
      await deleteActivity(selectedActivityId);
  
      toast.success("Activity deleted successfully.");
  
      await fetchActivities();
  
      onActivityChanged?.();
  
      setDeleteDialogOpen(false);
      setSelectedActivityId(null);
    } catch (error) {
      console.error(error);
  
      toast.error("Failed to delete activity.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredActivities =
    activities.filter((activity) => {
      const matchesSearch =
        activity.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        activity.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "ALL" ||
        activity.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesPriority
      );
    });

    return (
      <>
        <div
          className="
            rounded-[30px]
            border
            border-border
            bg-card/70
            backdrop-blur-xl
            p-6
            lg:p-8
            shadow-xl
          "
        >
          {/* Header */}
    
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    
            <div>
    
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-blue-500/10
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-500
                "
              >
                Daily Activities
              </span>
    
              <h3 className="mt-4 text-3xl font-bold text-foreground">
                Activities
              </h3>
    
              <p className="mt-2 text-muted-foreground">
                Organize transportation, sightseeing,
                dining and every moment of your journey.
              </p>
    
            </div>
    
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                inline-flex
                items-center
                justify-center
    
                rounded-2xl
    
                bg-gradient-to-r
                from-emerald-500
                to-green-600
    
                px-6
                py-3
    
                font-semibold
                text-white
    
                shadow-lg
    
                transition-all
    
                hover:-translate-y-1
                hover:shadow-emerald-500/30
              "
            >
              + Add Activity
            </button>
    
          </div>
    
          {/* Search */}
    
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_260px]">
    
            <input
              type="text"
              placeholder="🔍 Search activities..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
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
    
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="
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
              <option value="ALL">
                All Priorities
              </option>
    
              <option value="HIGH">
                High
              </option>
    
              <option value="MEDIUM">
                Medium
              </option>
    
              <option value="LOW">
                Low
              </option>
    
            </select>
    
          </div>
    
          {loading ? (
    
            <div className="py-16 text-center">
    
              <div
                className="
                  mx-auto
                  h-12
                  w-12
                  animate-spin
                  rounded-full
                  border-4
                  border-blue-600
                  border-t-transparent
                "
              />
    
              <p className="mt-6 text-muted-foreground">
                Loading activities...
              </p>
    
            </div>
    
          ) : filteredActivities.length === 0 ? (
    
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-border
                bg-background/60
                p-10
                text-center
              "
            >
              <h4 className="text-xl font-semibold text-foreground">
                No Activities
              </h4>
    
              <p className="mt-2 text-muted-foreground">
                Add your first activity for this day.
              </p>
    
            </div>
    
          ) : (
    
            <div className="space-y-7">
    
              {filteredActivities.map(
                (
                  activity,
                  index
                ) => (
    
                  <div
                    key={activity.id}
                    className="relative flex gap-5"
                  >
    
                    {/* Timeline */}
    
                    <div className="flex flex-col items-center">
    
                      <div
                        className="
                          z-10
                          h-5
                          w-5
                          rounded-full
                          bg-gradient-to-r
                          from-blue-500
                          to-cyan-500
                          shadow-lg
                        "
                      />
    
                      {index !==
                        filteredActivities.length - 1 && (
    
                        <div className="h-full w-[2px] bg-border" />
    
                      )}
    
                    </div>
    
                    {/* Card */}
    
                    <div
                      className="
                        flex-1
    
                        rounded-[26px]
    
                        border
                        border-border
    
                        bg-card
    
                        p-6
    
                        shadow-lg
    
                        transition-all
    
                        duration-300
    
                        hover:-translate-y-1
                        hover:shadow-2xl
                      "
                    >
    
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
    
                        <div>
    
                          <h4 className="text-2xl font-bold text-foreground">
                            {activity.title}
                          </h4>
    
                          {activity.location && (
    
                            <p className="mt-2 text-muted-foreground">
                              📍 {activity.location}
                            </p>
    
                          )}
    
                        </div>
    
                        <div className="flex gap-3">

<button
  onClick={() => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  }}
  className="
    rounded-xl
    bg-blue-500/10
    px-4
    py-2
    font-medium
    text-blue-500
    transition
    hover:bg-blue-500/20
  "
>
  ✏️ Edit
</button>

<button
  onClick={() => {
    setSelectedActivityId(activity.id);
    setDeleteDialogOpen(true);
  }}
  className="
    rounded-xl
    bg-red-500/10
    px-4
    py-2
    font-medium
    text-red-500
    transition
    hover:bg-red-500/20
  "
>
  🗑 Delete
</button>

</div>

</div>

<div className="mt-6 flex flex-wrap items-center gap-5 text-sm">

<div className="flex items-center gap-2 text-muted-foreground">
  🕒
  <span>
    {activity.start_time}
    {activity.end_time &&
      ` - ${activity.end_time}`}
  </span>
</div>

<div className="flex items-center gap-2 text-muted-foreground">
  💰
  <span>
    ₹
    {Number(
      activity.estimated_cost
    ).toLocaleString("en-IN")}
  </span>
</div>

<span
  className={`
    rounded-full
    px-3
    py-1
    text-xs
    font-semibold
    ${getPriorityBadge(activity.priority)}
  `}
>
  {activity.priority}
</span>

</div>

{activity.notes && (

<div
  className="
    mt-6

    rounded-2xl

    border
    border-border

    bg-background/60

    p-4

    text-muted-foreground
    leading-7
  "
>
  {activity.notes}
</div>

)}

</div>

</div>

))

}

</div>

)}

</div>

<AddActivityModal
isOpen={isModalOpen}
dayId={dayId}
onClose={() =>
  setIsModalOpen(false)
}
onSuccess={() => {
  fetchActivities();
  onActivityChanged?.();
}}
/>

<EditActivityModal
isOpen={isEditModalOpen}
activity={selectedActivity}
onClose={() => {
  setIsEditModalOpen(false);
  setSelectedActivity(null);
}}
onSuccess={() => {
  fetchActivities();
  onActivityChanged?.();
}}
/>

<ConfirmDialog
isOpen={deleteDialogOpen}
title="Delete this activity?"
message="This activity will be permanently removed from your itinerary. This action cannot be undone."
confirmText={
  deleting
    ? "Deleting..."
    : "Delete Activity"
}
loading={deleting}
variant="danger"
onConfirm={handleDelete}
onCancel={() => {
  if (deleting) return;

  setDeleteDialogOpen(false);
  setSelectedActivityId(null);
}}
/>

</>
);
}