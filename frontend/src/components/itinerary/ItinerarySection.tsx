"use client";

import { useEffect, useState } from "react";

import AddDayModal from "./AddDayModal";
import ActivitySection from "./ActivitySection";

import TripSummary from "../trips/TripSummary";

import { getItineraryDays } from "@/services/itinerary.service";

interface ItinerarySectionProps {
  tripId: string;
  travelers?: number;
}

interface ItineraryDay {
  id: number;
  trip: number;
  day_number: number;
  date: string;
  title: string;
  notes: string;
}

export default function ItinerarySection({
  tripId,
  travelers = 1,
}: ItinerarySectionProps) {
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // These will be calculated in the next step
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const fetchDays = async () => {
    try {
      setLoading(true);

      const data = await getItineraryDays(tripId);

      setDays(data);
    } catch (error) {
      console.error("Failed to load itinerary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, [tripId]);

  return (
    <>
      {/* Trip Summary */}
      <TripSummary
        days={days.length}
        activities={totalActivities}
        totalCost={totalCost}
        travelers={travelers}
      />

      <div className="rounded-2xl bg-white p-8 shadow">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Itinerary
            </h2>

            <p className="mt-1 text-gray-500">
              Organize your trip day by day.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            + Add Day
          </button>
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
          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day.id}
                className="rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      Day {day.day_number}
                    </h3>

                    <p className="text-gray-600">
                      {day.title}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {day.date}
                  </span>
                </div>

                {day.notes && (
                  <p className="mt-3 text-gray-600">
                    {day.notes}
                  </p>
                )}

                <div className="mt-5 border-t pt-5">
                  <ActivitySection dayId={day.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddDayModal
        isOpen={isModalOpen}
        tripId={tripId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDays}
      />
    </>
  );
}