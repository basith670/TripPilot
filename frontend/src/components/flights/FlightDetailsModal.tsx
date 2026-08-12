"use client";

import {
  Plane,
  Clock3,
  Calendar,
  MapPin,
  Ticket,
  Luggage,
  Building2,
  ShieldCheck,
  X,
} from "lucide-react";

import { Flight } from "@/types/flight";

import { createPortal } from "react-dom";

interface FlightDetailsModalProps {
  isOpen: boolean;
  flight: Flight | null;
  onClose: () => void;
  onSelect?: () => void;
  onBoardingPass?: () => void;
}

export default function FlightDetailsModal({
  isOpen,
  flight,
  onClose,
  onSelect,
  onBoardingPass,
}: FlightDetailsModalProps) {

  if (
    !isOpen ||
    !flight
  ) {
    return null;
  }

  const getStatusColor = (
    status: string
  ) => {

    switch (
      status
    ) {

      case "SCHEDULED":

        return `
          bg-blue-100
          dark:bg-blue-500/15
          text-blue-700
          dark:text-blue-300
        `;

      case "BOARDING":

        return `
          bg-green-100
          dark:bg-green-500/15
          text-green-700
          dark:text-green-300
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
          bg-muted
          text-muted-foreground
        `;
    }
  };

  /* ============================================================
     SAFE AIRLINE LOGO

     Prevents:

     An empty string ("") was passed to the src attribute.

     We only render <img> when a valid logo URL exists.
  ============================================================ */

  const airlineLogo =
    flight.airline_logo?.trim();

  return createPortal(

    <div
      onClick={
        onClose
      }
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center

        bg-slate-950/70
        backdrop-blur-md

        p-4
      "
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          flex
          h-[92vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-[32px]
          bg-card
        "
      >

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            sticky
            top-0
            z-20

            flex
            items-center
            justify-between

            border-b
            border-border

            bg-card/95

            px-8
            py-6

            backdrop-blur-xl
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-blue-600
                dark:text-blue-400
              "
            >
              Flight Information
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-bold
                text-foreground
              "
            >
              Flight Details
            </h2>

          </div>

          <button
            onClick={
              onClose
            }
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-2xl

              transition

              hover:bg-accent
            "
          >

            <X
              size={28}
            />

          </button>

        </div>

        {/* ====================================================
            BODY
        ==================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-8
          "
        >

          {/* ==================================================
              AIRLINE BANNER
          ================================================== */}

          <div
            className="
              mb-10

              rounded-[28px]

              bg-gradient-to-r
              from-slate-900
              via-blue-900
              to-indigo-900

              p-8

              text-white
            "
          >

            <div
              className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              {/* Airline */}

              <div
                className="
                  flex
                  items-center
                  gap-6
                "
              >

                {/* =================================================
                    SAFE LOGO
                ================================================= */}

                <div
                  className="
                    flex
                    h-24
                    w-24
                    shrink-0
                    items-center
                    justify-center

                    rounded-3xl

                    bg-white

                    shadow-xl
                  "
                >

                  {airlineLogo ? (

                    <img
                      src={
                        airlineLogo
                      }
                      alt={
                        flight.airline_name
                      }
                      className="
                        h-14
                        w-14
                        object-contain
                      "
                    />

                  ) : (

                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center

                        rounded-2xl

                        bg-slate-100

                        text-lg
                        font-bold
                        text-slate-700
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

                <div>

                  <p
                    className="
                      text-sm
                      uppercase
                      tracking-[0.25em]
                      text-slate-300
                    "
                  >
                    Airline
                  </p>

                  <h2
                    className="
                      mt-2
                      text-4xl
                      font-bold
                    "
                  >
                    {
                      flight.airline_name
                    }
                  </h2>

                  <p
                    className="
                      mt-3
                      text-lg
                      text-slate-300
                    "
                  >
                    Flight{" "}
                    {
                      flight.flight_number
                    }
                  </p>

                </div>

              </div>

              {/* Status + Price */}

              <div
                className="
                  flex
                  flex-col
                  items-start
                  gap-4
                  lg:items-end
                "
              >

                <span
                  className={`
                    rounded-full
                    px-5
                    py-3
                    text-sm
                    font-bold

                    ${getStatusColor(
                      flight.status
                    )}
                  `}
                >
                  {
                    flight.status
                  }
                </span>

                <div
                  className="
                    text-right
                  "
                >

                  <p
                    className="
                      text-sm
                      text-slate-300
                    "
                  >
                    Ticket Price
                  </p>

                  <h3
                    className="
                      mt-2
                      text-4xl
                      font-bold
                      text-emerald-300
                    "
                  >
                    ₹
                    {Number(
                      flight.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              FLIGHT TIMELINE
          ================================================== */}

          <div
            className="
              mb-12

              rounded-[30px]

              border
              border-border

              bg-muted

              p-8
            "
          >

            <div
              className="
                grid
                gap-8
                lg:grid-cols-3
              "
            >

              {/* Departure */}

              <div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-blue-600
                    dark:text-blue-400
                  "
                >

                  <Plane
                    size={18}
                  />

                  <span
                    className="
                      font-semibold
                    "
                  >
                    Departure
                  </span>

                </div>

                <h2
                  className="
                    mt-5
                    text-5xl
                    font-bold
                    text-foreground
                  "
                >

                  {new Date(
                    flight.departure_datetime
                  ).toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}

                </h2>

                <p
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-muted-foreground
                  "
                >

                  <Calendar
                    size={16}
                  />

                  {new Date(
                    flight.departure_datetime
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      weekday:
                        "short",
                      day:
                        "2-digit",
                      month:
                        "long",
                      year:
                        "numeric",
                    }
                  )}

                </p>

                <h3
                  className="
                    mt-6
                    text-3xl
                    font-bold
                    text-blue-700
                    dark:text-blue-300
                  "
                >
                  {
                    flight.source_iata
                  }
                </h3>

                <p
                  className="
                    mt-2
                    break-words
                    text-muted-foreground
                  "
                >
                  {
                    flight.source_airport_name
                  }
                </p>

                {flight.terminal && (

                  <p
                    className="
                      mt-3
                      text-foreground
                    "
                  >
                    Terminal{" "}
                    {
                      flight.terminal
                    }
                  </p>

                )}

                {flight.gate && (

                  <p
                    className="
                      text-foreground
                    "
                  >
                    Gate{" "}
                    {
                      flight.gate
                    }
                  </p>

                )}

              </div>

              {/* Center */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >

                <Clock3
                  size={42}
                  className="
                    text-blue-600
                    dark:text-blue-400
                  "
                />

                <h3
                  className="
                    mt-4
                    text-2xl
                    font-bold
                    text-foreground
                  "
                >
                  {
                    flight.duration_display
                  }
                </h3>

                <p
                  className="
                    mt-2
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

                <div
                  className="
                    mt-6
                    h-32
                    w-px
                    bg-border
                    lg:hidden
                  "
                />

              </div>

              {/* Arrival */}

              <div
                className="
                  lg:text-right
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-blue-600
                    dark:text-blue-400
                    lg:justify-end
                  "
                >

                  <MapPin
                    size={18}
                  />

                  <span
                    className="
                      font-semibold
                    "
                  >
                    Arrival
                  </span>

                </div>

                <h2
                  className="
                    mt-5
                    text-5xl
                    font-bold
                    text-foreground
                  "
                >

                  {new Date(
                    flight.arrival_datetime
                  ).toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}

                </h2>

                <p
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-muted-foreground
                    lg:justify-end
                  "
                >

                  <Calendar
                    size={16}
                  />

                  {new Date(
                    flight.arrival_datetime
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      weekday:
                        "short",
                      day:
                        "2-digit",
                      month:
                        "long",
                      year:
                        "numeric",
                    }
                  )}

                </p>

                <h3
                  className="
                    mt-6
                    text-3xl
                    font-bold
                    text-blue-700
                    dark:text-blue-300
                  "
                >
                  {
                    flight.destination_iata
                  }
                </h3>

                <p
                  className="
                    mt-2
                    text-muted-foreground
                  "
                >
                  {
                    flight.destination_airport_name
                  }
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              FLIGHT INFORMATION
          ================================================== */}

          <div
            className="
              mb-10
            "
          >

            <h3
              className="
                mb-6
                text-2xl
                font-bold
                text-foreground
              "
            >
              Flight Information
            </h3>

            <div
              className="
                grid
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
              "
            >

              <InfoCard
                icon={
                  <Ticket
                    size={22}
                  />
                }
                title="Cabin Class"
                value={flight.cabin_class.replaceAll(
                  "_",
                  " "
                )}
              />

              <InfoCard
                icon={
                  <Plane
                    size={22}
                  />
                }
                title="Aircraft"
                value={
                  flight.aircraft ||
                  "-"
                }
              />

              <InfoCard
                icon={
                  <Building2
                    size={22}
                  />
                }
                title="Terminal"
                value={
                  flight.terminal ||
                  "-"
                }
              />

              <InfoCard
                icon={
                  <MapPin
                    size={22}
                  />
                }
                title="Gate"
                value={
                  flight.gate ||
                  "-"
                }
              />

              <InfoCard
                icon={
                  <Luggage
                    size={22}
                  />
                }
                title="Baggage"
                value={
                  flight.baggage_allowance
                }
              />

              <InfoCard
                icon={
                  <ShieldCheck
                    size={22}
                  />
                }
                title="Refundable"
                value={
                  flight.refundable
                    ? "Yes"
                    : "No"
                }
              />

              <InfoCard
                icon={
                  <Ticket
                    size={22}
                  />
                }
                title="Booking Reference"
                value={
                  flight.booking_reference ||
                  "-"
                }
              />

              <InfoCard
                icon={
                  <Clock3
                    size={22}
                  />
                }
                title="Duration"
                value={
                  flight.duration_display
                }
              />

              <InfoCard
                icon={
                  <Plane
                    size={22}
                  />
                }
                title="Stops"
                value={
                  flight.stops ===
                  0
                    ? "Non-stop"
                    : `${
                        flight.stops
                      } Stop${
                        flight.stops >
                        1
                          ? "s"
                          : ""
                      }`
                }
              />

            </div>

          </div>

        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            sticky
            bottom-0

            border-t
            border-border

            bg-card/95

            px-8
            py-6

            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* Route */}

            <div>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Route
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-bold
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
              </h3>

            </div>

            {/* Actions */}

            <div
              className="
                flex
                flex-wrap
                justify-end
                gap-3
              "
            >

              {/* Close */}

              <button
                onClick={
                  onClose
                }
                className="
                  rounded-2xl
                  border
                  border-border
                  px-6
                  py-3
                  font-semibold
                  text-foreground
                  transition
                  hover:bg-accent
                "
              >
                Close
              </button>

              {/* Boarding Pass */}

              <button
                onClick={
                  onBoardingPass
                }
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-600
                  to-violet-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:scale-105
                "
              >
                🎫 Boarding Pass
              </button>

              {/* Select Flight

                  Kept here intentionally.

                  It was removed from FlightCard,
                  but selection remains available
                  from the details view.
              */}

              <button
                onClick={
                  onSelect
                }
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  px-6
                  py-3
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:scale-105
                "
              >
                Select Flight
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>,

    document.body
  );
}

/* ================================================================
   INFO CARD
================================================================ */

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {

  return (

    <div
      className="
        rounded-[24px]
        border
        border-border
        bg-card
        p-6
        shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-blue-100
          text-blue-600
          dark:bg-blue-500/15
          dark:text-blue-400
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-5
          text-sm
          font-medium
          uppercase
          tracking-wide
          text-muted-foreground
        "
      >
        {title}
      </p>

      <p
        className="
          mt-2
          break-words
          text-xl
          font-bold
          text-foreground
        "
      >
        {value}
      </p>

    </div>
  );
}