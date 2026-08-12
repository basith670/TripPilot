"use client";

import { Flight } from "@/types/flight";

import {
  PlaneTakeoff,
} from "lucide-react";

interface FlightCardProps {
  flight: Flight;

  isSelected?: boolean;

  onView?: (
    flight: Flight
  ) => void;

  onEdit?: (
    flight: Flight
  ) => void;

  onDelete?: (
    flight: Flight
  ) => void;
}

export default function FlightCard({
  flight,
  isSelected = false,
  onView,
  onEdit,
  onDelete,
}: FlightCardProps) {

  /* ============================================================
     DATE / TIME
  ============================================================ */

  const departureDate =
    new Date(
      flight.departure_datetime
    );

  const arrivalDate =
    new Date(
      flight.arrival_datetime
    );

  const departureTime =
    departureDate.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  const arrivalTime =
    arrivalDate.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  /* ============================================================
     FLIGHT DATE

     IMPORTANT:
     This uses the departure date of the individual flight.

     OUTBOUND:
       Source → Destination
       Shows outbound departure date.

     RETURN:
       Destination → Source
       Shows return departure date.
  ============================================================ */

  const flightDate =
    departureDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  /* ============================================================
     FLIGHT TYPE

     Backend can provide:

       flight_type = "OUTBOUND"
       flight_type = "RETURN"

     Fallback:
       type = "OUTBOUND" / "RETURN"

     Final fallback:
       OUTBOUND
  ============================================================ */

  const rawFlight =
    flight as any;

  const flightType =
    rawFlight.flight_type === "RETURN" ||
    rawFlight.type === "RETURN"
      ? "RETURN"
      : "OUTBOUND";

  const flightTypeLabel =
    flightType === "OUTBOUND"
      ? "OUTBOUND FLIGHT"
      : "RETURN FLIGHT";

  /* ============================================================
     STATUS
  ============================================================ */

  const getStatusColor = () => {
    switch (
      flight.status
    ) {
      case "SCHEDULED":
        return `
          bg-green-100
          dark:bg-green-500/15
          text-green-700
          dark:text-green-300
        `;

      case "BOARDING":
        return `
          bg-blue-100
          dark:bg-blue-500/15
          text-blue-700
          dark:text-blue-300
        `;

      case "DELAYED":
        return `
          bg-yellow-100
          dark:bg-yellow-500/15
          text-yellow-700
          dark:text-yellow-300
        `;

      case "LANDED":
        return `
          bg-muted
          text-muted-foreground
        `;

      case "CANCELLED":
        return `
          bg-red-100
          dark:bg-red-500/15
          text-red-700
          dark:text-red-300
        `;

      default:
        return `
          bg-red-100
          dark:bg-red-500/15
          text-red-700
          dark:text-red-300
        `;
    }
  };

  return (
    <article
      className={`
        group
        relative
        overflow-hidden

        rounded-[32px]

        border

        ${
          isSelected
            ? `
              border-blue-500
              bg-blue-50/70
              dark:bg-blue-500/10
            `
            : `
              border-border
              bg-card/90
            `
        }

        backdrop-blur-xl

        shadow-lg

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-2xl
      `}
    >

      {/* ======================================================
          SELECTED ACCENT
      ====================================================== */}

      {isSelected && (
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-1.5
            bg-blue-600
          "
        />
      )}

      <div className="p-8">

        {/* ====================================================
            FLIGHT TYPE + DATE
        ==================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* Flight Direction */}

          <div
            className={`
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              text-sm
              font-bold

              ${
                flightType === "OUTBOUND"
                  ? `
                    bg-blue-100
                    text-blue-700
                    dark:bg-blue-500/15
                    dark:text-blue-300
                  `
                  : `
                    bg-violet-100
                    text-violet-700
                    dark:bg-violet-500/15
                    dark:text-violet-300
                  `
              }
            `}
          >

            <PlaneTakeoff
              size={16}
            />

            {flightTypeLabel}

          </div>

          {/* Departure Date */}

          <div
            className="
              rounded-xl
              border
              border-border
              bg-muted
              px-4
              py-2
            "
          >

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-muted-foreground
              "
            >
              Departure Date
            </p>

            <p
              className="
                mt-1
                text-sm
                font-bold
                text-foreground
              "
            >
              {flightDate}
            </p>

          </div>

        </div>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >

          {/* Airline */}

          <div
            className="
              flex
              items-center
              gap-5
            "
          >

            {/* Airline Logo */}

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl

                bg-muted

                shadow-sm
              "
            >

              {flight.airline_logo ? (
                <img
                  src={
                    flight.airline_logo
                  }
                  alt={
                    flight.airline_name
                  }
                  className="
                    h-10
                    w-10
                    object-contain
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-muted
                    text-sm
                    font-bold
                  "
                >
                  {flight.airline_name
                    ?.slice(
                      0,
                      2
                    )
                    .toUpperCase() ||
                    "✈"}
                </div>
              )}

            </div>

            {/* Airline Information */}

            <div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-foreground
                  "
                >
                  {
                    flight.airline_name
                  }
                </h2>

                {isSelected && (
                  <span
                    className="
                      rounded-full
                      bg-blue-600
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Selected
                  </span>
                )}

              </div>

              <p
                className="
                  mt-1
                  text-muted-foreground
                "
              >
                Flight{" "}
                {
                  flight.flight_number
                }
              </p>

            </div>

          </div>

          {/* Status */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <span
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-semibold
                ${getStatusColor()}
              `}
            >
              {
                flight.status
              }
            </span>

          </div>

        </div>

        {/* ====================================================
            TIMELINE
        ==================================================== */}

        <div className="my-10">

          <div
            className="
              grid
              grid-cols-3
              items-center
            "
          >

            {/* Departure */}

            <div>

              <p
                className="
                  mb-2
                  text-sm
                  font-semibold
                  text-muted-foreground
                "
              >
                {flightType ===
                "OUTBOUND"
                  ? "Departure"
                  : "Return Departure"}
              </p>

              <h3
                className="
                  text-4xl
                  font-bold
                  text-foreground
                "
              >
                {
                  departureTime
                }
              </h3>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-blue-700
                  dark:text-blue-300
                "
              >
                {
                  flight.source_iata
                }
              </p>

            </div>

            {/* Center */}

            <div
              className="
                flex
                flex-col
                items-center
              "
            >

              <p
                className="
                  mb-3
                  text-sm
                  font-semibold
                  text-muted-foreground
                "
              >
                {
                  flight.duration_display
                }
              </p>

              <div
                className="
                  flex
                  w-full
                  items-center
                "
              >

                <div
                  className="
                    h-px
                    flex-1
                    bg-border
                  "
                />

                <div
                  className="
                    mx-4
                    rounded-full
                    bg-blue-100
                    p-3
                    text-blue-600
                    dark:bg-blue-500/15
                    dark:text-blue-400
                  "
                >
                  <PlaneTakeoff
                    size={20}
                  />
                </div>

                <div
                  className="
                    h-px
                    flex-1
                    bg-border
                  "
                />

              </div>

              <p
                className="
                  mt-3
                  text-sm
                  text-muted-foreground
                "
              >
                {flight.stops ===
                0
                  ? "Non-stop"
                  : `${
                      flight.stops
                    } Stop${
                      flight.stops >
                      1
                        ? "s"
                        : ""
                    }`}
              </p>

            </div>

            {/* Arrival */}

            <div
              className="
                text-right
              "
            >

              <p
                className="
                  mb-2
                  text-sm
                  font-semibold
                  text-muted-foreground
                "
              >
                Arrival
              </p>

              <h3
                className="
                  text-4xl
                  font-bold
                  text-foreground
                "
              >
                {
                  arrivalTime
                }
              </h3>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-blue-700
                  dark:text-blue-300
                "
              >
                {
                  flight.destination_iata
                }
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            FLIGHT INFORMATION
        ==================================================== */}

        <div
          className="
            grid
            gap-5
            rounded-2xl
            bg-muted
            p-5
            md:grid-cols-3
          "
        >

          {/* Cabin */}

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-muted-foreground
              "
            >
              Cabin
            </p>

            <p
              className="
                mt-2
                font-semibold
                text-foreground
              "
            >
              {
                flight.cabin_class
                  .replaceAll(
                    "_",
                    " "
                  )
              }
            </p>

          </div>

          {/* Price */}

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-muted-foreground
              "
            >
              Price
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-bold
                text-emerald-600
                dark:text-emerald-400
              "
            >
              ₹
              {Number(
                flight.price
              ).toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          {/* Route */}

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-muted-foreground
              "
            >
              Route
            </p>

            <p
              className="
                mt-2
                font-semibold
                text-foreground
              "
            >
              {
                flight.source_iata
              }{" "}
              →{" "}
              {
                flight.destination_iata
              }
            </p>

          </div>

        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-6
            border-t
            border-border
            pt-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* Flight Details */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-5
            "
          >

            {/* Airline */}

            <div
              className="
                rounded-xl
                bg-muted
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Airline
              </p>

              <p
                className="
                  mt-1
                  font-semibold
                  text-foreground
                "
              >
                {
                  flight.airline_name
                }
              </p>

            </div>

            {/* Flight */}

            <div
              className="
                rounded-xl
                bg-muted
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Flight
              </p>

              <p
                className="
                  mt-1
                  font-semibold
                  text-foreground
                "
              >
                {
                  flight.flight_number
                }
              </p>

            </div>

            {/* Stops */}

            <div
              className="
                rounded-xl
                bg-muted
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Stops
              </p>

              <p
                className="
                  mt-1
                  font-semibold
                  text-foreground
                "
              >
                {flight.stops ===
                0
                  ? "Non-stop"
                  : `${
                      flight.stops
                    } Stop${
                      flight.stops >
                      1
                        ? "s"
                        : ""
                    }`}
              </p>

            </div>

          </div>

          {/* ==================================================
              ACTIONS

              Select Flight has intentionally been removed
              from the card.

              Selection is still available inside
              FlightDetailsModal.
          ================================================== */}

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >

            {/* Details */}

            <button
              onClick={() =>
                onView?.(
                  flight
                )
              }
              className="
                rounded-xl
                border
                border-border
                bg-card
                px-5
                py-3
                font-medium
                text-foreground
                transition-all
                hover:bg-accent
              "
            >
              Details
            </button>

            {/* Edit */}

            <button
              onClick={() =>
                onEdit?.(
                  flight
                )
              }
              className="
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                px-5
                py-3
                font-medium
                text-amber-700
                transition-all
                hover:bg-amber-100
                dark:border-amber-500/30
                dark:bg-amber-500/10
                dark:text-amber-300
                dark:hover:bg-amber-500/20
              "
            >
              Edit
            </button>

            {/* Delete */}

            <button
              onClick={() =>
                onDelete?.(
                  flight
                )
              }
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-5
                py-3
                font-medium
                text-red-700
                transition-all
                hover:bg-red-100
                dark:border-red-500/30
                dark:bg-red-500/10
                dark:text-red-300
                dark:hover:bg-red-500/20
              "
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}