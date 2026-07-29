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

interface Props {
  dayId: number;
}

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

export default function ActivitySection({ dayId }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
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

      // Sort by start time
      data.sort((a: Activity, b: Activity) =>
        a.start_time.localeCompare(b.start_time)
      );

      setActivities(data);
    } catch (error) {
      console.error("Failed to load activities:", error);
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
  
      setDeleteDialogOpen(false);
      setSelectedActivityId(null);
  
      fetchActivities();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete activity.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredActivities = activities.filter(
    (activity) => {
      const matchesSearch =
        activity.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        activity.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "ALL" ||
        activity.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    }
  );

  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-gray-800">
            Activities
          </h4>

          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700"
          >
            + Add Activity
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="🔍 Search activities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="ALL">
              All Priorities
            </option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">
              Medium
            </option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">
            Loading activities...
          </p>
        ) : filteredActivities.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No matching activities found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredActivities.map(
              (activity, index) => (
                <div
                  key={activity.id}
                  className="relative flex gap-5"
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="z-10 h-4 w-4 rounded-full bg-blue-600"></div>

                    {index !==
                      filteredActivities.length -
                        1 && (
                      <div className="mt-1 h-full w-0.5 bg-gray-300"></div>
                    )}
                  </div>

                  {/* Card */}
                  <div className="mb-4 flex-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h5>

                        {activity.location && (
                          <p className="mt-1 text-sm text-gray-500">
                            📍 {activity.location}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedActivity(
                              activity
                            );
                            setIsEditModalOpen(
                              true
                            );
                          }}
                          className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelectedActivityId(activity.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>
                        🕒 {activity.start_time}
                        {activity.end_time &&
                          ` - ${activity.end_time}`}
                      </span>

                      <span>
                        💰 ₹
                        {Number(
                          activity.estimated_cost
                        ).toLocaleString("en-IN")}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(
                          activity.priority
                        )}`}
                      >
                        {activity.priority}
                      </span>
                    </div>

                    {activity.notes && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        {activity.notes}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <AddActivityModal
        isOpen={isModalOpen}
        dayId={dayId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchActivities}
      />

      <EditActivityModal
        isOpen={isEditModalOpen}
        activity={selectedActivity}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedActivity(null);
        }}
        onSuccess={fetchActivities}
      />
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
            setDeleteDialogOpen(false);
            setSelectedActivityId(null);
        }}
        />
    </>
  );
}