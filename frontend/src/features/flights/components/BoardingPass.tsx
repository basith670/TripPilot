"use client";

import { Flight } from "@/types/flight";

interface BoardingPassProps {
  flight: Flight;
}

export default function BoardingPass({
  flight,
}: BoardingPassProps) {
  const departureDate = new Date(
    flight.departure_datetime
  );

  const arrivalDate = new Date(
    flight.arrival_datetime
  );

  const departureTime =
    departureDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const arrivalTime =
    arrivalDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const travelDate =
    departureDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusColor = () => {
    switch (flight.status) {
      case "SCHEDULED":
        return "bg-green-100 text-green-700";

      case "BOARDING":
        return "bg-blue-100 text-blue-700";

      case "DELAYED":
        return "bg-yellow-100 text-yellow-700";

      case "LANDED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2">

              <img
                src={flight.airline_logo}
                alt={flight.airline_name}
                className="h-12 w-12 object-contain"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                {flight.airline_name}
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                Flight {flight.flight_number}
              </p>

            </div>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-sm uppercase tracking-widest text-blue-100">
              Boarding Pass
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}
            >
              {flight.status}
            </span>

          </div>

        </div>

      </div>
            {/* Body */}

            <div className="grid gap-8 p-6 lg:grid-cols-[2fr_auto_1fr]">

{/* Flight Route */}

<div>

  <div className="grid grid-cols-3 items-center gap-4">

    {/* Departure */}

    <div>

      <p className="text-sm text-gray-500">
        Departure
      </p>

      <p className="mt-2 text-4xl font-bold text-gray-900">
        {departureTime}
      </p>

      <p className="mt-3 text-2xl font-bold">
        {flight.source_iata}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {flight.source_airport_name}
      </p>

    </div>

    {/* Flight */}

    <div className="flex flex-col items-center">

      <div className="w-full border-t border-dashed border-gray-300"></div>

      <div className="my-4 rounded-full bg-blue-50 px-5 py-2 text-center">

        <p className="text-sm font-semibold text-blue-700">
          {flight.duration_display}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {flight.stops === 0
            ? "Non-stop"
            : `${flight.stops} Stop${
                flight.stops > 1
                  ? "s"
                  : ""
              }`}
        </p>

      </div>

      <div className="w-full border-t border-dashed border-gray-300"></div>

    </div>

    {/* Arrival */}

    <div className="text-right">

      <p className="text-sm text-gray-500">
        Arrival
      </p>

      <p className="mt-2 text-4xl font-bold text-gray-900">
        {arrivalTime}
      </p>

      <p className="mt-3 text-2xl font-bold">
        {flight.destination_iata}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {flight.destination_airport_name}
      </p>

    </div>

  </div>

  {/* Flight Details */}

  <div className="mt-8 rounded-2xl bg-gray-50 p-5">

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

      <div>

        <p className="text-sm text-gray-500">
          Travel Date
        </p>

        <p className="mt-2 font-semibold text-gray-900">
          {travelDate}
        </p>

      </div>

      <div>

        <p className="text-sm text-gray-500">
          Flight Number
        </p>

        <p className="mt-2 font-semibold text-gray-900">
          {flight.flight_number}
        </p>

      </div>

      <div>

        <p className="text-sm text-gray-500">
          Cabin
        </p>

        <p className="mt-2 font-semibold text-gray-900">
          {flight.cabin_class.replaceAll(
            "_",
            " "
          )}
        </p>

      </div>

    </div>

  </div>

</div>

{/* Ticket Divider */}

<div className="hidden lg:flex flex-col items-center">

  <div className="h-6 w-6 rounded-full bg-gray-100"></div>

  <div className="flex-1 border-l-2 border-dashed border-gray-300"></div>

  <div className="h-6 w-6 rounded-full bg-gray-100"></div>

</div>

{/* Boarding Information */}

<div className="rounded-2xl bg-blue-50 p-6">

  <h3 className="mb-5 text-lg font-bold text-gray-900">
    Boarding Information
  </h3>

  <div className="space-y-5">

    <div>

      <p className="text-xs uppercase tracking-wide text-gray-500">
        Terminal
      </p>

      <p className="mt-1 text-xl font-bold">
        {flight.terminal || "--"}
      </p>

    </div>

    <div>

      <p className="text-xs uppercase tracking-wide text-gray-500">
        Gate
      </p>

      <p className="mt-1 text-xl font-bold">
        {flight.gate || "--"}
      </p>

    </div>

    <div>

      <p className="text-xs uppercase tracking-wide text-gray-500">
        Booking Reference
      </p>

      <p className="mt-1 font-mono text-lg font-bold">
        {flight.booking_reference || "--"}
      </p>

    </div>

    <div>

      <p className="text-xs uppercase tracking-wide text-gray-500">
        Baggage
      </p>

      <p className="mt-1 font-semibold">
        {flight.baggage_allowance}
      </p>

    </div>

  </div>

</div>

</div>
      {/* Barcode */}

      <div className="border-t border-dashed border-gray-300 px-6 py-8">

        <div className="flex flex-col items-center">

          <div className="flex h-16 items-end gap-[2px]">

            {[
              30, 50, 80, 60, 90, 35, 70, 55, 95,
              45, 75, 60, 40, 85, 65, 30, 70, 55,
              95, 45, 80, 50, 60, 90, 35, 75, 45,
              85, 65, 40, 95, 55, 70, 60, 35, 80,
            ].map((height, index) => (
              <div
                key={index}
                className="w-[3px] rounded-sm bg-gray-900"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}

          </div>

          <p className="mt-4 font-mono text-sm tracking-[0.4em] text-gray-700">
            {flight.booking_reference ||
              flight.flight_number}
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="bg-gray-100 px-6 py-5">

        <div className="flex flex-col gap-4 text-center text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">

          <p>
            Aircraft{" "}
            <span className="font-semibold text-gray-900">
              {flight.aircraft || "--"}
            </span>
          </p>

          <p>
            Refundable{" "}
            <span
              className={`font-semibold ${
                flight.refundable
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {flight.refundable ? "Yes" : "No"}
            </span>
          </p>

          <p>
            Price{" "}
            <span className="font-bold text-blue-700">
              ₹
              {Number(flight.price).toLocaleString(
                "en-IN"
              )}
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}