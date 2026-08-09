"use client";

import { useEffect, useState } from "react";

import AddDayModal from "./AddDayModal";
import EditDayModal from "./EditDayModal";
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

  const [editModalOpen, setEditModalOpen] =
    useState(false);

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

      await deleteItineraryDay(
        selectedDayId
      );

      toast.success(
        "Day deleted successfully."
      );

      setDeleteDialogOpen(false);
      setSelectedDayId(null);

      await fetchDays();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete day."
      );
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

      toast.error(
        "Failed to duplicate day."
      );
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
      <div
  className="
    rounded-[32px]
    border
    border-border
    bg-card/80
    backdrop-blur-xl
    p-6
    shadow-xl
    sm:p-8
  "
>
  {/* Header */}

  <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

    <div>

      <span
        className="
          inline-flex
          rounded-full
          bg-blue-500/10
          px-4
          py-2
          text-sm
          font-semibold
          text-blue-600
          dark:text-blue-400
        "
      >
        Travel Timeline
      </span>

      <h2 className="mt-5 text-4xl font-bold text-foreground">
        Itinerary
      </h2>

      <p className="mt-2 text-muted-foreground">
        Organize every day of your trip with activities,
        hotels and transportation.
      </p>

    </div>

    <div className="flex flex-col gap-3 sm:flex-row">

      <button
        onClick={() =>
          setIsAIDialogOpen(true)
        }
        className="
          inline-flex
          items-center
          justify-center

          rounded-2xl

          bg-gradient-to-r
          from-violet-600
          to-fuchsia-600

          px-6
          py-3

          font-semibold
          text-white

          shadow-lg

          transition-all

          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        🤖 Generate with AI
      </button>

      <button
        onClick={() =>
          setIsModalOpen(true)
        }
        className="
          inline-flex
          items-center
          justify-center

          rounded-2xl

          bg-gradient-to-r
          from-blue-600
          to-cyan-600

          px-6
          py-3

          font-semibold
          text-white

          shadow-lg

          transition-all

          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        + Add Day
      </button>

    </div>

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
        Loading itinerary...
      </p>

    </div>

  ) : days.length === 0 ? (

    <div
      className="
        rounded-3xl
        border-2
        border-dashed
        border-border
        bg-muted/30
        p-16
        text-center
      "
    >

      <div className="text-6xl">
        ✈️
      </div>

      <h3 className="mt-6 text-3xl font-bold text-foreground">
        No itinerary yet
      </h3>

      <p className="mt-3 text-muted-foreground">
        Add your first travel day or let AI build
        a complete itinerary for you.
      </p>

    </div>

  ) : (

    <div className="space-y-8">

      {days.map((day) => (

        <div
          key={day.id}
          className="
            rounded-[28px]
            border
            border-border
            bg-card
            p-6
            shadow-md
            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-xl
          "
        >

          {/* Header */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-2xl

                    bg-gradient-to-br
                    from-blue-600
                    to-cyan-600

                    text-xl
                    font-bold
                    text-white
                  "
                >
                  {day.day_number}
                </div>

                <div>

                  <h3 className="text-2xl font-bold text-foreground">
                    {day.title}
                  </h3>

                  <p className="mt-1 text-muted-foreground">
                    Day {day.day_number}
                  </p>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <span
                className="
                  rounded-full
                  bg-blue-500/10
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-600
                  dark:text-blue-400
                "
              >
                {day.date}
              </span>

              <DayActionsMenu
                onEdit={() => {
                  setSelectedDay(day);
                  setEditModalOpen(true);
                }}
                onDuplicate={() =>
                  handleDuplicateDay(day.id)
                }
                onDelete={() => {
                  setSelectedDayId(day.id);
                  setDeleteDialogOpen(true);
                }}
              />

            </div>

          </div>

          {day.notes && (

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-border
                bg-muted/40
                p-5
              "
            >

              <p className="leading-7 text-muted-foreground">
                {day.notes}
              </p>

            </div>

          )}

          <div className="mt-8 border-t border-border pt-8">

            <ActivitySection
              dayId={day.id}
              onActivityChanged={fetchDays}
            />

          </div>

        </div>

      ))}

    </div>

  )}

</div>
{generatedItinerary && (

<section
  className="
    mt-10

    rounded-[32px]

    border
    border-violet-500/20

    bg-gradient-to-br
    from-violet-500/5
    via-card
    to-fuchsia-500/5

    p-8

    shadow-xl
  "
>

  {/* Header */}

  <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

    <div>

      <span
        className="
          inline-flex
          rounded-full
          bg-violet-500/10
          px-4
          py-2
          text-sm
          font-semibold
          text-violet-600
          dark:text-violet-400
        "
      >
        🤖 AI Generated
      </span>

      <h2 className="mt-5 text-4xl font-bold text-foreground">
        Suggested Itinerary
      </h2>

      <p className="mt-2 text-muted-foreground">
        Review the AI generated travel plan before saving
        it to your trip.
      </p>

    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

      <span
        className="
          rounded-full
          bg-violet-500/10
          px-5
          py-2
          text-sm
          font-semibold
          text-violet-600
          dark:text-violet-400
        "
      >
        {generatedItinerary.length} Days
      </span>

      <button
        onClick={handleSaveAIItinerary}
        className="
          rounded-2xl

          bg-gradient-to-r
          from-emerald-600
          to-green-600

          px-6
          py-3

          font-semibold
          text-white

          shadow-lg

          transition-all

          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        💾 Save to Trip
      </button>

    </div>

  </div>

  <div className="space-y-8">

    {generatedItinerary.map((day) => (

      <div
        key={day.day}
        className="
          rounded-[28px]

          border
          border-border

          bg-card

          p-6

          shadow-md
        "
      >

        {/* Day Header */}

        <div className="mb-8 flex items-center gap-5">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-2xl

              bg-gradient-to-br
              from-violet-600
              to-fuchsia-600

              text-xl
              font-bold
              text-white
            "
          >
            {day.day}
          </div>

          <div>

            <h3 className="text-2xl font-bold text-foreground">
              Day {day.day}
            </h3>

            <p className="text-muted-foreground">
              AI Recommended Schedule
            </p>

          </div>

        </div>

        {/* Activities */}

        <div className="space-y-5">

          {day.activities.map((activity, index) => (

            <div
              key={index}
              className="
                rounded-2xl

                border
                border-border

                bg-muted/30

                p-5

                transition-all

                hover:bg-muted/50
              "
            >

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <h4 className="text-lg font-semibold text-foreground">
                  {activity.title}
                </h4>

                <span
                  className="
                    rounded-full

                    bg-violet-500/10

                    px-4
                    py-2

                    text-sm
                    font-semibold

                    text-violet-600
                    dark:text-violet-400
                  "
                >
                  {activity.time}
                </span>

              </div>

              <p className="mt-4 leading-7 text-muted-foreground">
                {activity.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    ))}

  </div>

</section>

)}
      <GenerateItineraryDialog
        open={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        onGenerated={(data) =>
          setGeneratedItinerary(data.days)
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
        message="This will permanently delete this day and all of its activities."
        confirmText="Delete Day"
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