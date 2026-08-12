"use client";

import { Flight } from "@/types/flight";

interface BoardingPassProps {
  flight: Flight;
}

export default function BoardingPass({
  flight,
}: BoardingPassProps) {

  /* ============================================================
     DATE / TIME
  ============================================================ */

  const departureDate = new Date(
    flight.departure_datetime
  );

  const arrivalDate = new Date(
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
     TRAVEL DATE

     Uses the departure date of this individual flight.

     OUTBOUND:
       Outbound departure date

     RETURN:
       Return departure date
  ============================================================ */

  const travelDate =
    departureDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  /* ============================================================
     FLIGHT TYPE

     Supports:

       flight_type = "OUTBOUND"
       flight_type = "RETURN"

     Fallback:

       type = "OUTBOUND"
       type = "RETURN"
  ============================================================ */

  const rawFlight =
    flight as any;

  const flightType =
    rawFlight.flight_type ===
      "RETURN" ||
    rawFlight.type ===
      "RETURN"
      ? "RETURN"
      : "OUTBOUND";

  const flightTypeLabel =
    flightType ===
    "OUTBOUND"
      ? "Outbound Flight"
      : "Return Flight";

  /* ============================================================
     SAFE AIRLINE LOGO

     Prevents:

       An empty string ("") was passed to the src attribute.

     Only render <img> when a valid URL exists.
  ============================================================ */

  const airlineLogo =
    flight.airline_logo?.trim();

  /* ============================================================
     STATUS COLOR
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
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-card
        shadow-xl
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-700
          px-6
          py-5
          text-white
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* Airline */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            {/* =================================================
                AIRLINE LOGO
            ================================================= */}

            <div
              className="
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                p-2
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
                    h-12
                    w-12
                    object-contain
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-sm
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

            {/* Airline Information */}

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                {
                  flight.airline_name
                }
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-blue-100
                "
              >
                Flight{" "}
                {
                  flight.flight_number
                }
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-blue-200
                "
              >
                {flightTypeLabel}
              </p>

            </div>

          </div>

          {/* Boarding Pass Status */}

          <div
            className="
              text-left
              sm:text-right
            "
          >

            <p
              className="
                text-sm
                uppercase
                tracking-widest
                text-blue-100
              "
            >
              Boarding Pass
            </p>

            <span
              className={`
                mt-2
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
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

      </div>

      {/* ======================================================
          BODY
      ====================================================== */}

      <div
        className="
          grid
          gap-8
          p-6
          lg:grid-cols-[2fr_auto_1fr]
        "
      >

        {/* ====================================================
            FLIGHT ROUTE
        ==================================================== */}

        <div>

          <div
            className="
              grid
              grid-cols-3
              items-center
              gap-4
            "
          >

            {/* Departure */}

            <div>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                {flightType ===
                "RETURN"
                  ? "Return Departure"
                  : "Departure"}
              </p>

              <p
                className="
                  mt-2
                  text-4xl
                  font-bold
                  text-foreground
                "
              >
                {
                  departureTime
                }
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-foreground
                "
              >
                {
                  flight.source_iata
                }
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  flight.source_airport_name
                }
              </p>

            </div>

            {/* Flight */}

            <div
              className="
                flex
                flex-col
                items-center
              "
            >

              <div
                className="
                  w-full
                  border-t
                  border-dashed
                  border-border
                "
              />

              <div
                className="
                  my-4
                  rounded-full
                  bg-blue-50
                  px-5
                  py-2
                  text-center
                  dark:bg-blue-500/15
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-blue-700
                    dark:text-blue-300
                  "
                >
                  {
                    flight.duration_display
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-xs
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

              <div
                className="
                  w-full
                  border-t
                  border-dashed
                  border-border
                "
              />

            </div>

            {/* Arrival */}

            <div
              className="
                text-right
              "
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Arrival
              </p>

              <p
                className="
                  mt-2
                  text-4xl
                  font-bold
                  text-foreground
                "
              >
                {
                  arrivalTime
                }
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-foreground
                "
              >
                {
                  flight.destination_iata
                }
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  flight.destination_airport_name
                }
              </p>

            </div>

          </div>

          {/* ==================================================
              FLIGHT DETAILS
          ================================================== */}

          <div
            className="
              mt-8
              rounded-2xl
              bg-muted
              p-5
            "
          >

            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-3
              "
            >

              {/* Travel Date */}

              <div>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Travel Date
                </p>

                <p
                  className="
                    mt-2
                    font-semibold
                    text-foreground
                  "
                >
                  {
                    travelDate
                  }
                </p>

              </div>

              {/* Flight Number */}

              <div>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Flight Number
                </p>

                <p
                  className="
                    mt-2
                    font-semibold
                    text-foreground
                  "
                >
                  {
                    flight.flight_number
                  }
                </p>

              </div>

              {/* Cabin */}

              <div>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Cabin
                </p>

                <p
                  className="
                    mt-2
                    font-semibold
                    capitalize
                    text-foreground
                  "
                >
                  {flight.cabin_class.replaceAll(
                    "_",
                    " "
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            TICKET DIVIDER
        ==================================================== */}

        <div
          className="
            hidden
            flex-col
            items-center
            lg:flex
          "
        >

          <div
            className="
              h-6
              w-6
              rounded-full
              bg-muted
            "
          />

          <div
            className="
              flex-1
              border-l-2
              border-dashed
              border-border
            "
          />

          <div
            className="
              h-6
              w-6
              rounded-full
              bg-muted
            "
          />

        </div>

        {/* ====================================================
            BOARDING INFORMATION
        ==================================================== */}

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-6
            dark:bg-blue-500/10
          "
        >

          <h3
            className="
              mb-5
              text-lg
              font-bold
              text-foreground
            "
          >
            Boarding Information
          </h3>

          <div
            className="
              space-y-5
            "
          >

            {/* Terminal */}

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Terminal
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-foreground
                "
              >
                {
                  flight.terminal ||
                  "--"
                }
              </p>

            </div>

            {/* Gate */}

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Gate
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-foreground
                "
              >
                {
                  flight.gate ||
                  "--"
                }
              </p>

            </div>

            {/* Booking Reference */}

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Booking Reference
              </p>

              <p
                className="
                  mt-1
                  break-all
                  font-mono
                  text-lg
                  font-bold
                  text-foreground
                "
              >
                {
                  flight.booking_reference ||
                  "--"
                }
              </p>

            </div>

            {/* Baggage */}

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Baggage
              </p>

              <p
                className="
                  mt-1
                  font-semibold
                  text-foreground
                "
              >
                {
                  flight.baggage_allowance
                }
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          BARCODE
      ====================================================== */}

      <div
        className="
          border-t
          border-dashed
          border-border
          px-6
          py-8
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
          "
        >

          <div
            className="
              flex
              h-16
              items-end
              gap-[2px]
            "
          >

            {[
              30,
              50,
              80,
              60,
              90,
              35,
              70,
              55,
              95,
              45,
              75,
              60,
              40,
              85,
              65,
              30,
              70,
              55,
              95,
              45,
              80,
              50,
              60,
              90,
              35,
              75,
              45,
              85,
              65,
              40,
              95,
              55,
              70,
              60,
              35,
              80,
            ].map(
              (
                height,
                index
              ) => (

                <div
                  key={
                    index
                  }
                  className="
                    w-[3px]
                    rounded-sm
                    bg-foreground
                  "
                  style={{
                    height:
                      `${height}%`,
                  }}
                />

              )
            )}

          </div>

          <p
            className="
              mt-4
              break-all
              text-center
              font-mono
              text-sm
              tracking-[0.4em]
              text-muted-foreground
            "
          >
            {
              flight.booking_reference ||
              flight.flight_number
            }
          </p>

        </div>

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div
        className="
          bg-muted
          px-6
          py-5
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            text-center
            text-sm
            text-muted-foreground
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* Aircraft */}

          <p>

            Aircraft{" "}

            <span
              className="
                font-semibold
                text-foreground
              "
            >
              {
                flight.aircraft ||
                "--"
              }
            </span>

          </p>

          {/* Refundable */}

          <p>

            Refundable{" "}

            <span
              className={`
                font-semibold

                ${
                  flight.refundable
                    ? `
                      text-green-600
                      dark:text-green-400
                    `
                    : `
                      text-red-600
                      dark:text-red-400
                    `
                }
              `}
            >
              {
                flight.refundable
                  ? "Yes"
                  : "No"
              }
            </span>

          </p>

          {/* Price */}

          <p>

            Price{" "}

            <span
              className="
                font-bold
                text-blue-700
                dark:text-blue-300
              "
            >
              ₹
              {Number(
                flight.price
              ).toLocaleString(
                "en-IN"
              )}
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}