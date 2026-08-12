"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import FlightRecommendation from "./FlightRecommendation";

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

  /* ============================================================
     SAVE GENERATED TRIP
  ============================================================ */

  const handleSaveTrip = async () => {
    try {
      setSaving(true);

      /* ========================================================
         PLANNER DATA
      ======================================================== */

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

        food_preference:
          planner.foodPreference,

        interests:
          planner.interests,

        hotel_amenities:
          planner.hotelAmenities,
      };

      /* ========================================================
         EXPLICITLY PRESERVE BOTH FLIGHTS

         Backend structure:

         flight: {
           outbound: {...},
           return: {...},
           total_price: number,
           reason: string
         }
      ======================================================== */

      const flightData = trip.flight
        ? {
            outbound:
              trip.flight.outbound ?? null,

            return:
              trip.flight.return ?? null,

            total_price:
              Number(
                trip.flight.total_price ?? 0
              ),

            reason:
              trip.flight.reason ?? "",
          }
        : null;

      /* ========================================================
         BUILD COMPLETE TRIP PAYLOAD

         This guarantees that saveGeneratedTrip receives
         both outbound and return flights.
      ======================================================== */

      const tripToSave = {
        ...trip,

        flight: flightData,
      };

      console.log(
        "SAVING TRIP:",
        tripToSave
      );

      console.log(
        "OUTBOUND FLIGHT:",
        tripToSave.flight?.outbound
      );

      console.log(
        "RETURN FLIGHT:",
        tripToSave.flight?.return
      );

      /* ========================================================
         SAVE
      ======================================================== */

      const response =
        await saveGeneratedTrip(
          plannerData,
          tripToSave
        );

      /* ========================================================
         SUCCESS
      ======================================================== */

      if (response.success) {
        toast.success(
          "🎉 Trip Saved!",
          {
            description:
              "Your itinerary, outbound flight, and return flight have been saved successfully.",
          }
        );

        setTimeout(() => {
          router.push("/trips");
        }, 1200);
      }

      /* ========================================================
         FAILURE
      ======================================================== */

      else {
        toast.error(
          "Unable to save trip",
          {
            description:
              response.message ||
              "Unable to save your trip.",
          }
        );
      }
    } catch (error) {
      console.error(
        "Failed to save generated trip:",
        error
      );

      toast.error(
        "Save Failed",
        {
          description:
            "Something went wrong while saving your trip.",
        }
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     SAFETY CHECK
  ============================================================ */

  if (!trip) {
    return (
      <div
        className="
          mx-auto
          max-w-7xl
          rounded-3xl
          border
          border-border
          bg-card
          p-12
          text-center
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-foreground
          "
        >
          No Trip Results
        </h2>

        <p
          className="
            mt-2
            text-muted-foreground
          "
        >
          We could not find the generated trip.
        </p>
      </div>
    );
  }

  /* ============================================================
     FLIGHT DATA
  ============================================================ */

  const flight =
    trip.flight ?? null;

  /* ============================================================
     HOTEL
  ============================================================ */

  const hotel =
    trip.hotel ?? null;

  /* ============================================================
     ITINERARY
  ============================================================ */

  const itinerary =
    Array.isArray(
      trip.itinerary
    )
      ? trip.itinerary
      : [];

  /* ============================================================
     BUDGET
  ============================================================ */

  const budget =
    trip.budget ?? {};

  /* ============================================================
     PACKING
  ============================================================ */

  const packing =
    Array.isArray(
      trip.packing
    )
      ? trip.packing
      : [];

  /* ============================================================
     TRAVEL TIPS
  ============================================================ */

  const travelTips =
    Array.isArray(
      trip.travel_tips
    )
      ? trip.travel_tips
      : [];

  /* ============================================================
     BUDGET VALUES
  ============================================================ */

  const budgetEntries =
    Object.entries(
      budget
    );

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
      className="
        mx-auto
        max-w-7xl
        space-y-8
      "
    >
      {/* ======================================================
          TRIP HEADER
      ====================================================== */}

      <div
        className="
          rounded-3xl
          bg-card/80
          p-8
          shadow-xl
          backdrop-blur
        "
      >
        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          <div className="text-5xl">
            ✨
          </div>

          <div>
            <h1
              className="
                text-3xl
                font-black
                text-foreground
                md:text-4xl
              "
            >
              {trip.trip_summary?.title ||
                "Your AI Travel Plan"}
            </h1>

            <p
              className="
                mt-3
                text-muted-foreground
              "
            >
              {trip.trip_summary?.overview ||
                "Your personalized AI-generated travel itinerary."}
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-3
              "
            >
              {trip.trip_summary?.weather && (
                <span
                  className="
                    rounded-full
                    bg-blue-100
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-700
                    dark:bg-blue-500/15
                    dark:text-blue-300
                  "
                >
                  🌤{" "}
                  {
                    trip.trip_summary
                      .weather
                  }
                </span>
              )}

              {trip.trip_summary?.currency && (
                <span
                  className="
                    rounded-full
                    bg-green-100
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-green-700
                    dark:bg-green-500/15
                    dark:text-green-300
                  "
                >
                  💱{" "}
                  {
                    trip.trip_summary
                      .currency
                  }
                </span>
              )}

              {trip.trip_summary?.language && (
                <span
                  className="
                    rounded-full
                    bg-purple-100
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-purple-700
                    dark:bg-purple-500/15
                    dark:text-purple-300
                  "
                >
                  🗣{" "}
                  {
                    trip.trip_summary
                      .language
                  }
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          FLIGHTS
      ====================================================== */}

      {flight && (
        <FlightRecommendation
          flight={flight}
        />
      )}

      {/* ======================================================
          HOTEL
      ====================================================== */}

      {hotel && (
        <div
          className="
            rounded-3xl
            bg-card/80
            p-8
            shadow
            backdrop-blur
          "
        >
          <h2
            className="
              mb-6
              text-2xl
              font-bold
              text-foreground
            "
          >
            🏨 Recommended Hotel
          </h2>

          <div
            className="
              flex
              flex-col
              justify-between
              gap-6
              md:flex-row
            "
          >
            <div>
              <h3
                className="
                  text-2xl
                  font-bold
                  text-foreground
                "
              >
                {hotel.name}
              </h3>

              {hotel.address && (
                <p
                  className="
                    mt-2
                    text-muted-foreground
                  "
                >
                  📍 {hotel.address}
                </p>
              )}

              {hotel.rating !==
                undefined && (
                <p
                  className="
                    mt-2
                    text-foreground
                  "
                >
                  ⭐ {hotel.rating} / 5
                </p>
              )}

              {Array.isArray(
                hotel.amenities
              ) &&
                hotel.amenities.length >
                  0 && (
                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {hotel.amenities.map(
                      (
                        amenity: string,
                        index: number
                      ) => (
                        <span
                          key={`${amenity}-${index}`}
                          className="
                            rounded-full
                            bg-green-100
                            px-3
                            py-1
                            text-sm
                            font-medium
                            text-green-700
                            dark:bg-green-500/15
                            dark:text-green-300
                          "
                        >
                          {amenity}
                        </span>
                      )
                    )}
                  </div>
                )}
            </div>

            <div
              className="
                text-left
                md:text-right
              "
            >
              <p
                className="
                  text-4xl
                  font-black
                  text-green-600
                  dark:text-green-400
                "
              >
                ₹
                {Number(
                  hotel.total_price ??
                    0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              <p
                className="
                  mt-2
                  text-muted-foreground
                "
              >
                ₹
                {Number(
                  hotel.price_per_night ??
                    0
                ).toLocaleString(
                  "en-IN"
                )}
                /night
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          ITINERARY
      ====================================================== */}

      <div
        className="
          rounded-3xl
          bg-card/80
          p-8
          shadow
          backdrop-blur
        "
      >
        <h2
          className="
            mb-8
            text-2xl
            font-bold
            text-foreground
          "
        >
          📅 AI Itinerary
        </h2>

        {itinerary.length > 0 ? (
          <div className="space-y-6">
            {itinerary.map(
              (
                day: any,
                index: number
              ) => (
                <div
                  key={
                    day.day ??
                    index
                  }
                  className="
                    rounded-2xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-6
                    dark:border-blue-500/20
                    dark:bg-blue-500/10
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-foreground
                    "
                  >
                    Day {day.day}
                    {" · "}
                    {day.title}
                  </h3>

                  <div className="mt-5 space-y-4">
                    {Array.isArray(
                      day.activities
                    ) &&
                      day.activities.map(
                        (
                          activity: any,
                          activityIndex: number
                        ) => (
                          <div
                            key={
                              activity.id ??
                              activityIndex
                            }
                            className="
                              rounded-xl
                              bg-card
                              p-4
                              shadow-sm
                            "
                          >
                            <div
                              className="
                                flex
                                flex-col
                                gap-4
                                md:flex-row
                                md:items-start
                                md:justify-between
                              "
                            >
                              <div>
                                <h4
                                  className="
                                    font-semibold
                                    text-foreground
                                  "
                                >
                                  {
                                    activity.time
                                  }
                                  {" • "}
                                  {
                                    activity.title
                                  }
                                </h4>

                                <p
                                  className="
                                    mt-2
                                    text-muted-foreground
                                  "
                                >
                                  {
                                    activity.description
                                  }
                                </p>

                                {activity.location && (
                                  <p
                                    className="
                                      mt-2
                                      text-sm
                                      text-muted-foreground
                                    "
                                  >
                                    📍{" "}
                                    {
                                      activity.location
                                    }
                                  </p>
                                )}
                              </div>

                              <div
                                className="
                                  text-left
                                  md:text-right
                                "
                              >
                                <p
                                  className="
                                    font-bold
                                    text-green-600
                                    dark:text-green-400
                                  "
                                >
                                  ₹
                                  {Number(
                                    activity.estimated_cost ??
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                                {activity.transport && (
                                  <p
                                    className="
                                      text-sm
                                      text-muted-foreground
                                    "
                                  >
                                    {
                                      activity.transport
                                    }
                                  </p>
                                )}
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
        ) : (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-border
              p-8
              text-center
            "
          >
            <p className="text-muted-foreground">
              No itinerary activities
              were generated.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================
          BUDGET SUMMARY
          
          FIX:
          - Removed xl:grid-cols-7
          - Added responsive wrapping
          - min-w-0 prevents overflow
          - break-words prevents large prices
            from escaping the card
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          bg-card/80
          p-6
          shadow
          backdrop-blur
          sm:p-8
        "
      >
        <h2
          className="
            mb-6
            text-2xl
            font-bold
            text-foreground
          "
        >
          💰 Budget Summary
        </h2>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
          "
        >
          {budgetEntries.map(
            ([key, value]) => (
              <div
                key={key}
                className="
                  min-w-0
                  overflow-hidden
                  rounded-2xl
                  bg-muted
                  p-4
                  text-center
                "
              >
                <p
                  className="
                    truncate
                    text-sm
                    font-medium
                    capitalize
                    text-muted-foreground
                  "
                >
                  {key.replace(
                    /_/g,
                    " "
                  )}
                </p>

                <p
                  className="
                    mt-2
                    break-words
                    text-lg
                    font-bold
                    text-foreground
                    sm:text-xl
                  "
                >
                  ₹
                  {Number(
                    value ?? 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* ======================================================
          PACKING
      ====================================================== */}

      {packing.length > 0 && (
        <div
          className="
            rounded-3xl
            bg-card/80
            p-8
            shadow
          "
        >
          <h2
            className="
              mb-5
              text-2xl
              font-bold
              text-foreground
            "
          >
            🎒 Packing Checklist
          </h2>

          <ul className="space-y-3">
            {packing.map(
              (
                item: any,
                index: number
              ) => (
                <li
                  key={
                    item.item ??
                    index
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-lg
                    bg-muted
                    p-3
                  "
                >
                  <span className="text-foreground">
                    ✅ {item.item}
                  </span>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-red-100
                      px-2
                      py-1
                      text-xs
                      font-semibold
                      text-red-600
                      dark:bg-red-500/15
                      dark:text-red-400
                    "
                  >
                    {item.importance}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* ======================================================
          TRAVEL TIPS
      ====================================================== */}

      {travelTips.length > 0 && (
        <div
          className="
            rounded-3xl
            bg-card/80
            p-8
            shadow
          "
        >
          <h2
            className="
              mb-5
              text-2xl
              font-bold
              text-foreground
            "
          >
            💡 Travel Tips
          </h2>

          <ul className="space-y-3">
            {travelTips.map(
              (
                tip: any,
                index: number
              ) => (
                <li
                  key={
                    tip.title ??
                    index
                  }
                  className="
                    rounded-xl
                    bg-muted
                    p-4
                  "
                >
                  <h4
                    className="
                      font-semibold
                      text-foreground
                    "
                  >
                    ⭐ {tip.title}
                  </h4>

                  <p
                    className="
                      mt-2
                      text-muted-foreground
                    "
                  >
                    {tip.description}
                  </p>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* ======================================================
          SAVE TRIP
      ====================================================== */}

      <div
        className="
          flex
          justify-center
          pb-8
        "
      >
        <button
          onClick={handleSaveTrip}
          disabled={saving}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-12
            py-4
            text-lg
            font-bold
            text-white
            shadow-xl
            transition
            hover:scale-105
            hover:shadow-2xl
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving
            ? "Saving..."
            : "💾 Save Trip"}
        </button>
      </div>
    </motion.div>
  );
}