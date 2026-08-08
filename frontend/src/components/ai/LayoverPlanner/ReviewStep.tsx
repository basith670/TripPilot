"use client";

import {
  Plane,
  CalendarDays,
  Wallet,
  Heart,
  CheckCircle2,
} from "lucide-react";

interface ReviewStepProps {
  formData: {
    departureAirport: string;
    layoverAirport: string;
    destinationAirport: string;

    arrivalDate: string;
    arrivalTime: string;

    departureDate: string;
    departureTime: string;

    budget: string;

    travelStyle: string;

    visaRequired: boolean;
    checkedBaggage: boolean;
    loungeAccess: boolean;

    interests: string[];
  };
}

export default function ReviewStep({
  formData,
}: ReviewStepProps) {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-500/15 px-4 py-2">

          <CheckCircle2
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Final Review
          </span>

        </div>

        <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Review Your Layover Plan
        </h2>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Review your information before generating your AI layover itinerary.
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Flight */}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-blue-100 dark:bg-blue-500/15 p-3">

              <Plane
                size={22}
                className="text-blue-600 dark:text-blue-400"
              />

            </div>

            <h3 className="text-lg font-bold text-foreground">
              Flight Route
            </h3>

          </div>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Departure
              </span>

              <span className="font-semibold text-foreground">
                {formData.departureAirport}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Layover
              </span>

              <span className="font-semibold text-foreground">
                {formData.layoverAirport}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Destination
              </span>

              <span className="font-semibold text-foreground">
                {formData.destinationAirport}
              </span>

            </div>

          </div>

        </div>

        {/* Schedule */}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-green-100 dark:bg-green-500/15 p-3">

              <CalendarDays
                size={22}
                className="text-green-600 dark:text-green-400"
              />

            </div>

            <h3 className="text-lg font-bold text-foreground">
              Schedule
            </h3>

          </div>

          <div className="space-y-5 text-sm">

            <div>

              <p className="font-semibold text-foreground">
                Arrival
              </p>

              <p className="text-muted-foreground">
                {formData.arrivalDate} • {formData.arrivalTime}
              </p>

            </div>

            <div>

              <p className="font-semibold text-foreground">
                Departure
              </p>

              <p className="text-muted-foreground">
                {formData.departureDate} • {formData.departureTime}
              </p>

            </div>

          </div>

        </div>

        {/* Budget */}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/15 p-3">

              <Wallet
                size={22}
                className="text-emerald-600 dark:text-emerald-400"
              />

            </div>

            <h3 className="text-lg font-bold text-foreground">
              Budget
            </h3>

          </div>

          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{formData.budget || "0"}
          </p>

        </div>

        {/* Preferences */}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 dark:bg-purple-500/15 p-3">

              <Heart
                size={22}
                className="text-purple-600 dark:text-purple-400"
              />

            </div>

            <h3 className="text-lg font-bold text-foreground">
              Preferences
            </h3>

          </div>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Travel Style
              </span>

              <span className="font-semibold text-foreground">
                {formData.travelStyle}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Lounge Access
              </span>

              <span className="font-semibold text-foreground">
                {formData.loungeAccess ? "Yes" : "No"}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Checked Baggage
              </span>

              <span className="font-semibold text-foreground">
                {formData.checkedBaggage ? "Yes" : "No"}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Transit Visa
              </span>

              <span className="font-semibold text-foreground">
                {formData.visaRequired
                  ? "Required"
                  : "Not Required"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Interests */}

      <div className="rounded-3xl border border-border bg-muted p-6">

        <h3 className="mb-2 text-lg font-bold text-foreground">
          Selected Interests
        </h3>

        <p className="mb-6 text-sm text-muted-foreground">
          AI will prioritize these experiences during your layover.
        </p>

        {formData.interests.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground">
            No interests selected.
          </div>

        ) : (

          <div className="flex flex-wrap gap-3">

            {formData.interests.map((interest) => (

              <span
                key={interest}
                className="
                  rounded-full
                  bg-blue-600
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                "
              >
                {interest}
              </span>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}