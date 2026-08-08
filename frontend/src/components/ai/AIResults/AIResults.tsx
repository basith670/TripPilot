"use client";

import { motion } from "framer-motion";

import FlightRecommendation from "./FlightRecommendation";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { saveGeneratedTrip } from "@/services/trips.service";

interface AIResultsProps {
  trip: any;
  planner: any;
}

export default function AIResults({
  trip,
  planner,
}: AIResultsProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const handleSaveTrip = async () => {
    try {
      setSaving(true);

      const plannerData = {
        source_airport: planner.sourceAirport,
        destination_airport: planner.destinationAirport,
        departure_date: planner.departureDate,
        return_date: planner.returnDate,
        budget: planner.budget,

        adults: planner.adults,
        children: planner.children,
        infants: planner.infants,
        seniors: planner.seniors,

        cabin_class: planner.cabinClass,
        travel_style: planner.travelStyle,
        transport: planner.transport,
        food_preference: planner.foodPreference,

        interests: planner.interests,
        hotel_amenities: planner.hotelAmenities,
      };

      const response = await saveGeneratedTrip(
        plannerData,
        trip
      );
      if (response.success) {
        toast.success("🎉 Trip Saved!", {
          description:
            "Your itinerary has been added successfully.",
        });

        setTimeout(() => {
          router.push("/trips");
        }, 1200);
      } else {
        toast.error("Unable to save trip", {
          description: response.message,
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("Save Failed", {
        description:
          "Something went wrong while saving your trip.",
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* Header */}

      <div className="rounded-3xl bg-card/80 p-8 shadow-xl backdrop-blur">

        <div className="flex items-center gap-5">

          <div className="text-5xl">
            ✨
          </div>

          <div>

            <h1 className="text-4xl font-black">
              {trip.trip_summary.title}
            </h1>

            <p className="mt-3 text-muted-foreground">
              {trip.trip_summary.overview}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <span className="rounded-full bg-blue-100 dark:bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                🌤 {trip.trip_summary.weather}
              </span>

              <span className="rounded-full bg-green-100 dark:bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300">
                💱 {trip.trip_summary.currency}
              </span>

              <span className="rounded-full bg-purple-100 dark:bg-purple-500/15 px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                🗣 {trip.trip_summary.language}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Flight */}

      <FlightRecommendation
        flight={trip.flight}
      />

      {/* Hotel */}

      <div className="rounded-3xl bg-card/80 p-8 shadow backdrop-blur">

        <h2 className="mb-6 text-2xl font-bold">
          🏨 Recommended Hotel
        </h2>

        <div className="flex flex-col justify-between gap-6 md:flex-row">

          <div>

            <h3 className="text-2xl font-bold">
              {trip.hotel.name}
            </h3>

            <p className="mt-2 text-muted-foreground">
              📍 {trip.hotel.address}
            </p>

            <p className="mt-2">
              ⭐ {trip.hotel.rating} / 5
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {trip.hotel.amenities.map(
                (
                  amenity: string,
                  index: number
                ) => (

                  <span
                    key={index}
                    className="rounded-full bg-green-100 dark:bg-green-500/15 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300"
                  >
                    {amenity}
                  </span>

                )
              )}

            </div>

          </div>

          <div className="text-right">

            <p className="text-4xl font-black text-green-600 dark:text-green-400">

              ₹{trip.hotel.total_price.toLocaleString()}

            </p>

            <p className="mt-2 text-muted-foreground">
              ₹
              {trip.hotel.price_per_night.toLocaleString()}
              /night
            </p>

          </div>

        </div>

      </div>

      {/* Itinerary */}

      <div className="rounded-3xl bg-card/80 p-8 shadow backdrop-blur">

        <h2 className="mb-8 text-2xl font-bold">

          📅 AI Itinerary

        </h2>

        <div className="space-y-6">

          {trip.itinerary.map(
            (
              day: any,
              index: number
            ) => (

              <div
                key={index}
                className="rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 p-6"
              >

                <h3 className="text-xl font-bold">

                  Day {day.day}

                  {" · "}

                  {day.title}

                </h3>

                <div className="mt-5 space-y-4">

                  {day.activities.map(
                    (
                      activity: any,
                      activityIndex: number
                    ) => (

                      <div
                        key={activityIndex}
                        className="rounded-xl bg-card p-4 shadow-sm"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <h4 className="font-semibold">

                              {activity.time}

                              {" • "}

                              {activity.title}

                            </h4>

                            <p className="mt-2 text-muted-foreground">

                              {activity.description}

                            </p>

                            <p className="mt-2 text-sm text-muted-foreground">

                              📍 {activity.location}

                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-bold text-green-600 dark:text-green-400">

                              ₹
                              {activity.estimated_cost.toLocaleString()}

                            </p>

                            <p className="text-sm text-muted-foreground">

                              {activity.transport}

                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* Budget */}

      <div className="rounded-3xl bg-card/80 p-8 shadow backdrop-blur">

        <h2 className="mb-6 text-2xl font-bold">

          💰 Budget Summary

        </h2>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">

          {Object.entries(trip.budget).map(
            (
              [key, value]
            ) => (

              <div
                key={key}
                className="rounded-xl bg-muted p-4 text-center"
              >

                <p className="capitalize text-muted-foreground">

                  {key.replace("_", " ")}

                </p>

                <p className="mt-2 text-xl font-bold">

                  ₹
                  {Number(value).toLocaleString()}

                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* Packing */}

      <div className="rounded-3xl bg-card/80 p-8 shadow">

        <h2 className="mb-5 text-2xl font-bold">

          🎒 Packing Checklist

        </h2>

        <ul className="space-y-3">

          {trip.packing.map(
            (
              item: any,
              index: number
            ) => (

              <li
                key={index}
                className="flex items-center justify-between rounded-lg bg-muted p-3"
              >
                <span>
                  ✅ {item.item}
                </span>

                <span className="rounded-full bg-red-100 dark:bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  {item.importance}
                </span>
              </li>

            )
          )}

        </ul>

      </div>

      {/* Tips */}

      <div className="rounded-3xl bg-card/80 p-8 shadow">

        <h2 className="mb-5 text-2xl font-bold">

          💡 Travel Tips

        </h2>

        <ul className="space-y-3">

          {trip.travel_tips.map(
            (
              tip: any,
              index: number
            ) => (

              <li
                key={index}
                className="rounded-xl bg-muted p-4"
              >
                <h4 className="font-semibold">
                  ⭐ {tip.title}
                </h4>

                <p className="mt-2 text-muted-foreground">
                  {tip.description}
                </p>
              </li>

            )
          )}

        </ul>

      </div>

      {/* Save */}

      <div className="flex justify-center">

        <button
          onClick={handleSaveTrip}
          disabled={saving}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-12 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save Trip"}
        </button>

      </div>

    </motion.div>
  );
}