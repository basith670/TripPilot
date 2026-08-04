"use client";

import { useEffect, useState } from "react";

import AddDayModal from "./AddDayModal";
import ActivitySection from "./ActivitySection";

import TripSummary from "../trips/TripSummary";

import GenerateItineraryDialog from "@/features/ai/GenerateItineraryDialog";

import {
  getItineraryDays,
  deleteItineraryDay,
  duplicateItineraryDay,
} from "@/services/itinerary.service";

import { saveAIItinerary } from "@/services/trips.service";

import {
  getBudgetSummary,
  BudgetSummary,
} from "@/services/budget.service";

import { ItineraryDay } from "@/types/itinerary";
import { ItineraryDay as AIItineraryDay } from "@/lib/ai";

import DayActionsMenu from "@/components/common/DayActionsMenu";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { toast } from "sonner";

import EditDayModal from "./EditDayModal";

interface ItinerarySectionProps {
  tripId: string;
  travelers?: number;
}

export default function ItinerarySection({
  tripId,
  travelers = 1,
}: ItinerarySectionProps) {
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [summary, setSummary] =
    useState<BudgetSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isAIDialogOpen, setIsAIDialogOpen] =
    useState(false);

  const [generatedItinerary, setGeneratedItinerary] =
    useState<AIItineraryDay[] | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedDayId, setSelectedDayId] =
    useState<number | null>(null);

  const [deletingDay, setDeletingDay] =
    useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedDay, setSelectedDay] =
      useState<ItineraryDay | null>(null);

  const fetchDays = async () => {
    try {
      setLoading(true);

      const [dayData, budgetData] =
        await Promise.all([
          getItineraryDays(tripId),
          getBudgetSummary(tripId),
        ]);

      setDays(dayData);
      setSummary(budgetData);
    } catch (error) {
      console.error(
        "Failed to load itinerary:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, [tripId]);

  const handleSaveAIItinerary = async () => {
    if (!generatedItinerary) return;

    try {
      await saveAIItinerary(
        tripId,
        generatedItinerary
      );

      await fetchDays();

      setGeneratedItinerary(null);

      toast.success(
        "AI itinerary saved successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save AI itinerary."
      );
    }
  };

  const handleDeleteDay = async () => {
    if (!selectedDayId) return;

    try {
      setDeletingDay(true);

      await deleteItineraryDay(selectedDayId);

      toast.success("Day deleted successfully.");

      setDeleteDialogOpen(false);
      setSelectedDayId(null);

      await fetchDays();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete day.");
    } finally {
      setDeletingDay(false);
    }
  };

  const handleDuplicateDay = async (
    dayId: number
  ) => {
    try {
      await duplicateItineraryDay(dayId);

      toast.success("Day duplicated.");

      await fetchDays();
    } catch (error) {
      console.error(error);

      toast.error("Failed to duplicate day.");
    }
  };

  return (
    <>
      <TripSummary
        days={days.length}
        activities={
          summary?.total_activities ?? 0
        }
        totalCost={
          summary?.total_cost ?? 0
        }
        travelers={travelers}
      />

<div className="rounded-2xl bg-white p-4 shadow sm:p-6 lg:p-8">
<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Itinerary
            </h2>

            <p className="mt-1 text-gray-500">
              Organize your trip day by day.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={() =>
                setIsAIDialogOpen(true)
              }
              className="w-full rounded-lg bg-purple-600 px-4 py-3 text-white transition hover:bg-purple-700 sm:w-auto"
            >
              🤖 Generate with AI
            </button>

            <button
              onClick={() =>
                setIsModalOpen(true)
              }
             className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 sm:w-auto"
            >
              + Add Day
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">
            Loading itinerary...
          </p>
        ) : days.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-500">
              No itinerary created yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {days.map((day) => (
              <div
                key={day.id}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md sm:p-6"
              >
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      Day {day.day_number}
                    </h3>

                    <p className="mt-1 text-gray-600">
                      {day.title}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                      {day.date}
                    </span>

                    <DayActionsMenu
                      onEdit={() => {
                        setSelectedDay(day);
                        setEditModalOpen(true);
                      }}
                      onDuplicate={() => handleDuplicateDay(day.id)}
                      onDelete={() => {
                        setSelectedDayId(day.id);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                {day.notes && (
                  <div className="mt-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-gray-700">
                      {day.notes}
                    </p>
                  </div>
                )}

                {/* Activities */}
                <div className="mt-6 border-t pt-6">
                  <ActivitySection
                    dayId={day.id}
                    onActivityChanged={
                      fetchDays
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {generatedItinerary && (
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold text-purple-700">
              🤖 AI Generated Itinerary
            </h2>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                {generatedItinerary.length} Days
              </span>

              <button
                onClick={
                  handleSaveAIItinerary
                }
                className="w-full rounded-lg bg-green-600 px-5 py-3 text-white transition hover:bg-green-700 sm:w-auto"
              >
                💾 Save to Trip
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedItinerary.map(
              (day) => (
                <div
                  key={day.day}
                  className="rounded-xl border bg-white p-4 sm:p-6"
                >
                  <h3 className="mb-4 text-xl font-bold">
                    Day {day.day}
                  </h3>

                  <div className="space-y-4">
                    {day.activities.map(
                      (
                        activity,
                        index
                      ) => (
                        <div
                          key={index}
                          className="rounded-lg border p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="font-semibold">
                              {
                                activity.title
                              }
                            </h4>

                            <span className="rounded bg-purple-100 px-3 py-1 text-sm">
                              {
                                activity.time
                              }
                            </span>
                          </div>

                          <p className="mt-2 text-gray-600">
                            {
                              activity.description
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <GenerateItineraryDialog
        open={isAIDialogOpen}
        onOpenChange={
          setIsAIDialogOpen
        }
        onGenerated={(data) =>
          setGeneratedItinerary(
            data.days
          )
        }
      />

      <AddDayModal
        isOpen={isModalOpen}
        tripId={tripId}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSuccess={fetchDays}
      />

      <EditDayModal
        isOpen={editModalOpen}
        day={selectedDay}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDay(null);
        }}
        onSuccess={fetchDays}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Day"
        message="This will permanently delete the day and all of its activities."
        confirmText="Delete"
        loading={deletingDay}
        onConfirm={handleDeleteDay}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedDayId(null);
        }}
      />
    </>
  );
}