"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveLayoverTrip } from "@/lib/saveLayover";

import {
  ArrowLeft,
  Plane,
  Clock3,
  MapPin,
  Utensils,
  ShoppingBag,
  Car,
  Sofa,
  Lightbulb,
} from "lucide-react";

interface Props {
  result: any;
  planner: any;
  onBack: () => void;
  savedTrip?: boolean;
}

export default function LayoverResults({
  result,
  planner,
  onBack,
  savedTrip = false,
}: Props) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await saveLayoverTrip(
        planner,
        result
      );

      if (response.success) {
        toast.success(
          "Layover trip saved successfully!"
        );

        setTimeout(() => {
          router.push("/trips");
        }, 1200);
      } else {
        toast.error(
          response.error ||
            "Unable to save trip."
        );
      }
    } catch (err) {
      console.error(err);

      toast.error(
        "Unable to save trip."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Back */}

      <button
        onClick={onBack}
        className="
          inline-flex
          items-center
          gap-2
          rounded-2xl
          border
          border-border
          bg-card
          px-6
          py-3
          font-medium
          shadow
          transition
          hover:shadow-lg
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Hero */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-sky-500
          text-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-8
            p-6

            sm:p-8

            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:p-10
          "
        >
          {/* Airport */}

          <div
            className="
              flex
              flex-col
              items-center
              text-center

              lg:flex-row
              lg:items-center
              lg:text-left
            "
          >
            <div
              className="
                mb-6
                rounded-full
                bg-white/20
                p-5
                backdrop-blur

                lg:mb-0
                lg:mr-6
              "
            >
              <Plane className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>

            <div className="min-w-0">

              <h1
                className="
                  text-3xl
                  font-bold
                  leading-tight

                  sm:text-4xl

                  lg:text-5xl
                "
              >
                {result.airport}
              </h1>

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  items-center
                  gap-3
                  text-blue-100

                  sm:flex-row
                  sm:flex-wrap
                  sm:justify-center
                  sm:gap-6

                  lg:justify-start
                "
              >
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>
                    {result.city}, {result.country}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={18} />
                  <span>
                    {result.layover_hours} Hour Layover
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Budget */}

          <div
            className="
              w-full
              rounded-2xl
              bg-white/10
              p-6
              text-center
              backdrop-blur

              sm:max-w-sm
              sm:mx-auto

              lg:mx-0
              lg:w-72
            "
          >
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-blue-100
              "
            >
              Estimated Budget
            </p>

            <p
              className="
                mt-3
                text-3xl
                font-bold

                sm:text-4xl
              "
            >
              ₹{result.estimated_total_cost ?? "-"}
            </p>
          </div>
        </div>

        {/* Summary */}

        <div className="px-6 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">

          <div
            className="
              rounded-3xl
              bg-white/10
              p-5
              backdrop-blur

              sm:p-6
            "
          >
            <h2 className="text-xl font-semibold sm:text-2xl">
              AI Summary
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-blue-50

                sm:text-base
                sm:leading-8
              "
            >
              {result.summary}
            </p>

          </div>

        </div>

      </div>

      {/* Timeline */}

      <div
        className="
          rounded-3xl
          bg-card
          p-5
          shadow-xl

          sm:p-6

          lg:p-8
        "
      >

        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
          🗓 Layover Timeline
        </h2>

        <div className="space-y-6">

          {result.timeline?.map(
            (item: any, index: number) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-border
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl

                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-5

                    lg:flex-row
                    lg:justify-between
                  "
                >

                  <div className="flex-1">

                    <span
                      className="
                        rounded-full
                        bg-blue-100
                        dark:bg-blue-500/15
                        px-4
                        py-1.5
                        text-sm
                        font-semibold
                        text-blue-700
                        dark:text-blue-300
                      "
                    >
                      {item.time}
                    </span>

                    <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">

                      <div>
                        📍 {item.location}
                      </div>

                      <div>
                        🏷 {item.category}
                      </div>

                    </div>

                  </div>

                  <div
                    className="
                      w-full
                      rounded-2xl
                      bg-emerald-100
                      dark:bg-emerald-500/15
                      px-5
                      py-3
                      text-center
                      text-lg
                      font-bold
                      text-emerald-700
                      dark:text-emerald-300

                      lg:h-fit
                      lg:w-auto
                    "
                  >
                    ₹{item.estimated_cost}
                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* Recommendation Cards */}

      {(
        result.restaurants?.length ||
        result.lounges?.length ||
        result.shopping?.length ||
        result.transport?.length
      ) ? (

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Restaurants */}

          {result.restaurants?.length > 0 && (
            <div className="rounded-3xl bg-card p-8 shadow-xl">

              <div className="mb-6 flex items-center gap-3">
                <Utensils className="text-orange-500 dark:text-orange-400" />
                <h2 className="text-2xl font-bold">
                  Restaurants
                </h2>
              </div>

              <div className="space-y-4">
                {result.restaurants.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-border p-5 transition hover:shadow-lg"
                    >
                      <h3 className="text-lg font-semibold">
                        {typeof item === "string" ? item : item.name}
                      </h3>

                      {typeof item !== "string" && item.description && (
                        <p className="mt-2 text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {typeof item !== "string" && item.location && (
                        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                          📍 {item.location}
                        </p>
                      )}

                      {typeof item !== "string" && item.estimated_cost && (
                        <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{item.estimated_cost}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>
          )}

          {/* Lounges */}

          {result.lounges?.length > 0 && (
            <div className="rounded-3xl bg-card p-8 shadow-xl">

              <div className="mb-6 flex items-center gap-3">
                <Sofa className="text-indigo-500 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold">
                  Airport Lounges
                </h2>
              </div>

              <div className="space-y-4">
                {result.lounges.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-border p-5 transition hover:shadow-lg"
                    >
                      <h3 className="text-lg font-semibold">
                        {typeof item === "string" ? item : item.name}
                      </h3>

                      {typeof item !== "string" && item.description && (
                        <p className="mt-2 text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {typeof item !== "string" && item.location && (
                        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                          📍 {item.location}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>
          )}

          {/* Shopping */}

          {result.shopping?.length > 0 && (
            <div className="rounded-3xl bg-card p-8 shadow-xl">

              <div className="mb-6 flex items-center gap-3">
                <ShoppingBag className="text-pink-500 dark:text-pink-400" />
                <h2 className="text-2xl font-bold">
                  Shopping
                </h2>
              </div>

              <div className="space-y-4">
                {result.shopping.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-border p-5 transition hover:shadow-lg"
                    >
                      <h3 className="text-lg font-semibold">
                        {typeof item === "string" ? item : item.name}
                      </h3>

                      {typeof item !== "string" && item.description && (
                        <p className="mt-2 text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {typeof item !== "string" && item.location && (
                        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                          📍 {item.location}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>
          )}

          {/* Transport */}

          {result.transport?.length > 0 && (
            <div className="rounded-3xl bg-card p-8 shadow-xl">

              <div className="mb-6 flex items-center gap-3">
                <Car className="text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold">
                  Transport
                </h2>
              </div>

              <div className="space-y-4">
                {result.transport.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-border p-5 transition hover:shadow-lg"
                    >
                      <h3 className="text-lg font-semibold">
                        {typeof item === "string" ? item : item.title}
                      </h3>

                      {typeof item !== "string" && item.description && (
                        <p className="mt-2 text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {typeof item !== "string" && item.location && (
                        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                          📍 {item.location}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>
          )}

        </div>

      ) : null}

      {/* AI Tips */}

      {result.tips?.length > 0 && (

        <div className="rounded-3xl bg-card p-8 shadow-xl">

          <div className="mb-6 flex items-center gap-3">
            <Lightbulb className="text-yellow-500 dark:text-yellow-400" />
            <h2 className="text-2xl font-bold">
              AI Travel Tips
            </h2>
          </div>

          <div className="space-y-4">

            {result.tips.map(
              (tip: string, index: number) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border-l-4
                    border-blue-500
                    dark:border-blue-400
                    bg-blue-50
                    dark:bg-blue-500/10
                    p-5
                    text-blue-900
                    dark:text-blue-100
                  "
                >
                  {tip}
                </div>
              )
            )}

          </div>

        </div>

      )}

      {/* Action Bar */}

      {!savedTrip && (
        <div
          className="
            sticky
            bottom-6
            z-20
            rounded-3xl
            border
            border-border
            bg-card/90
            p-6
            shadow-2xl
            backdrop-blur
          "
        >
          <div className="flex justify-end">

            <button
              onClick={handleSave}
              disabled={saving}
              className="
                rounded-2xl
                bg-blue-600
                px-8
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving
                ? "Saving..."
                : "💾 Save To My Trips"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}