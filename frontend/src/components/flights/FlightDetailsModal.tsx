"use client";

import { Flight } from "@/types/flight";

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
  if (!isOpen || !flight) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "BOARDING":
        return "bg-green-100 text-green-700";

      case "DELAYED":
        return "bg-yellow-100 text-yellow-700";

      case "LANDED":
        return "bg-gray-100 text-gray-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-5">
          <h2 className="text-2xl font-bold">
            Flight Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 transition hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-6">
          {/* Airline */}

          <div className="mb-8 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
                <img
                  src={flight.airline_logo}
                  alt={flight.airline_name}
                  className="max-h-10 max-w-10 object-contain"
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Airline
                </p>

                <h3 className="text-3xl font-bold text-gray-900">
                  {flight.airline_name}
                </h3>

                <p className="mt-1 text-gray-500">
                  Flight {flight.flight_number}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                flight.status
              )}`}
            >
              {flight.status}
            </span>
          </div>

          {/* Timeline */}

          <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Departure */}

            <div className="text-center lg:text-left">
              <p className="text-4xl font-bold">
                {new Date(
                  flight.departure_datetime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(
                  flight.departure_datetime
                ).toLocaleDateString()}
              </p>

              <h4 className="mt-4 text-3xl font-bold">
                {flight.source_iata}
              </h4>

              <p className="text-gray-500">
                {flight.source_airport_name}
              </p>

              {flight.terminal && (
                <p className="mt-3 text-sm text-gray-500">
                  Terminal {flight.terminal}
                </p>
              )}

              {flight.gate && (
                <p className="text-sm text-gray-500">
                  Gate {flight.gate}
                </p>
              )}
            </div>

            {/* Duration */}

            <div className="flex flex-col items-center justify-center">
              <div className="w-full border-t border-dashed"></div>

              <div className="my-4 rounded-full bg-blue-50 px-5 py-3">
                <p className="font-semibold text-blue-700">
                  {Math.floor(
                    flight.duration_minutes / 60
                  )}
                  h {flight.duration_minutes % 60}m
                </p>

                <p className="text-sm text-gray-500">
                  {flight.stops === 0
                    ? "Non-stop"
                    : `${flight.stops} Stop${
                        flight.stops > 1 ? "s" : ""
                      }`}
                </p>
              </div>

              <div className="w-full border-t border-dashed"></div>
            </div>

            {/* Arrival */}

            <div className="text-center lg:text-right">
              <p className="text-4xl font-bold">
                {new Date(
                  flight.arrival_datetime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(
                  flight.arrival_datetime
                ).toLocaleDateString()}
              </p>

              <h4 className="mt-4 text-3xl font-bold">
                {flight.destination_iata}
              </h4>

              <p className="text-gray-500">
                {flight.destination_airport_name}
              </p>
            </div>
          </div>

          {/* Information */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              title="Cabin Class"
              value={flight.cabin_class.replaceAll(
                "_",
                " "
              )}
            />

            <InfoCard
              title="Aircraft"
              value={flight.aircraft || "-"}
            />

            <InfoCard
              title="Ticket Price"
              value={`₹${Number(
                flight.price
              ).toLocaleString("en-IN")}`}
              valueClass="text-green-600"
            />

            <InfoCard
              title="Baggage"
              value={flight.baggage_allowance}
            />

            <InfoCard
              title="Refundable"
              value={
                flight.refundable
                  ? "Yes"
                  : "No"
              }
            />

            <InfoCard
              title="Booking Reference"
              value={
                flight.booking_reference || "-"
              }
            />
          </div>
        </div>

        {/* Footer */}

        <div className="sticky bottom-0 border-t bg-white px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-100"
            >
              Close
            </button>

            <button
              onClick={onBoardingPass}
              className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
            >
              🎫 Boarding Pass
            </button>

            <button
              onClick={onSelect}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  valueClass = "text-gray-900",
}: {
  title: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}