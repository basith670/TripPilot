"use client";

import { useEffect, useState } from "react";

import {
  updateFlight,
  getAirlines,
} from "@/services/flight.service";

import {
  getAirports,
  Airport,
} from "@/services/airport.service";

import {
  Airline,
  Flight,
} from "@/types/flight";

import { toast } from "sonner";

import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;

  flight: Flight | null;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;
}

export default function EditFlightModal({
  isOpen,
  flight,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [airlines, setAirlines] =
    useState<Airline[]>([]);

  const [airports, setAirports] =
    useState<Airport[]>([]);

  const [form, setForm] = useState({
    airline: "",

    flight_number: "",

    flight_type: "OUTBOUND" as
      | "OUTBOUND"
      | "RETURN",

    source_airport: "",

    destination_airport: "",

    departure_datetime: "",

    arrival_datetime: "",

    cabin_class: "ECONOMY" as
      | "ECONOMY"
      | "PREMIUM_ECONOMY"
      | "BUSINESS"
      | "FIRST",

    price: "",

    stops: "",

    baggage_allowance: "25 kg",

    refundable: true,

    aircraft: "",

    terminal: "",

    gate: "",

    booking_reference: "",

    status: "SCHEDULED" as
      | "SCHEDULED"
      | "DELAYED"
      | "BOARDING"
      | "LANDED"
      | "CANCELLED",
  });

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [
          airlineData,
          airportData,
        ] = await Promise.all([
          getAirlines(),
          getAirports(),
        ]);

        setAirlines(airlineData);

        setAirports(airportData);
      } catch (err) {
        console.error(err);

        toast.error(
          "Failed to load airlines and airports."
        );
      }
    };

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (!flight) return;

    setForm({
      airline: String(
        flight.airline
      ),

      flight_number:
        flight.flight_number,

      flight_type:
        flight.flight_type,

      source_airport: String(
        flight.source_airport
      ),

      destination_airport: String(
        flight.destination_airport
      ),

      departure_datetime:
        flight.departure_datetime.slice(
          0,
          16
        ),

      arrival_datetime:
        flight.arrival_datetime.slice(
          0,
          16
        ),

      cabin_class:
        flight.cabin_class as
          | "ECONOMY"
          | "PREMIUM_ECONOMY"
          | "BUSINESS"
          | "FIRST",

      price: String(
        flight.price
      ),

      stops: String(
        flight.stops
      ),

      baggage_allowance:
        flight.baggage_allowance,

      refundable:
        flight.refundable,

      aircraft:
        flight.aircraft,

      terminal:
        flight.terminal,

      gate:
        flight.gate,

      booking_reference:
        flight.booking_reference,

      status:
        flight.status as
          | "SCHEDULED"
          | "DELAYED"
          | "BOARDING"
          | "LANDED"
          | "CANCELLED",
    });
  }, [flight]);

  const resetForm = () => {
    setForm({
      airline: "",

      flight_number: "",

      flight_type:
        "OUTBOUND",

      source_airport: "",

      destination_airport: "",

      departure_datetime: "",

      arrival_datetime: "",

      cabin_class:
        "ECONOMY",

      price: "",

      stops: "",

      baggage_allowance:
        "25 kg",

      refundable: true,

      aircraft: "",

      terminal: "",

      gate: "",

      booking_reference: "",

      status: "SCHEDULED",
    });
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();

    onClose();
  };
  const handleSubmit = async () => {
    if (!flight) return;

    try {
      setLoading(true);

      const departure = new Date(
        form.departure_datetime
      );

      const arrival = new Date(
        form.arrival_datetime
      );

      const duration = Math.max(
        Math.floor(
          (arrival.getTime() -
            departure.getTime()) /
            60000
        ),
        0
      );

      await updateFlight(
        flight.id,
        {
          trip: flight.trip,

          airline: Number(
            form.airline
          ),

          flight_number:
            form.flight_number,

          flight_type:
            form.flight_type,

          source_airport:
            Number(
              form.source_airport
            ),

          destination_airport:
            Number(
              form.destination_airport
            ),

          departure_datetime:
            departure.toISOString(),

          arrival_datetime:
            arrival.toISOString(),

          duration_minutes:
            duration,

          cabin_class:
            form.cabin_class,

          price: Number(
            form.price
          ),

          stops: Number(
            form.stops
          ),

          baggage_allowance:
            form.baggage_allowance,

          refundable:
            form.refundable,

          aircraft:
            form.aircraft,

          terminal:
            form.terminal,

          gate: form.gate,

          booking_reference:
            form.booking_reference,

          status: form.status,
        }
      );

      toast.success(
        "Flight updated successfully."
      );

      await onSuccess();

      handleClose();
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to update flight."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !flight)
    return null;

  return createPortal(
    <div
      onClick={handleClose}
      className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
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
        max-w-6xl
        flex-col
        overflow-hidden
        rounded-[32px]
        bg-card
        shadow-2xl
        "
      >
        {/* Header */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card px-6 py-5">

          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Edit Flight
          </h2>

          <button
            onClick={handleClose}
            disabled={loading}
            className="text-3xl text-muted-foreground transition hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <div className="space-y-6">

            {/* Airline + Flight Number */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Airline
                </label>

                <select
                  value={form.airline}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      airline:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="">
                    Select Airline
                  </option>

                  {airlines.map(
                    (airline) => (
                      <option
                        key={
                          airline.id
                        }
                        value={
                          airline.id
                        }
                      >
                        {
                          airline.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Flight Number
                </label>

                <input
                  type="text"
                  value={
                    form.flight_number
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      flight_number:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

            </div>

            {/* Flight Type */}

            <div>

              <label className="mb-2 block font-medium text-foreground">
                Flight Type
              </label>

              <select
                value={
                  form.flight_type
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    flight_type:
                      e.target.value as
                        | "OUTBOUND"
                        | "RETURN",
                  }))
                }
                className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
              >
                <option value="OUTBOUND">
                  Outbound
                </option>

                <option value="RETURN">
                  Return
                </option>

              </select>

            </div>

            {/* Airports */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Source Airport
                </label>

                <select
                  value={
                    form.source_airport
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      source_airport:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground"
                >
                  <option value="">
                    Select Airport
                  </option>

                  {airports.map(
                    (airport) => (
                      <option
                        key={
                          airport.id
                        }
                        value={
                          airport.id
                        }
                      >
                        {
                          airport.iata_code
                        }{" "}
                        —{" "}
                        {
                          airport.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Destination Airport
                </label>

                <select
                  value={
                    form.destination_airport
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      destination_airport:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground"
                >
                  <option value="">
                    Select Airport
                  </option>

                  {airports.map(
                    (airport) => (
                      <option
                        key={
                          airport.id
                        }
                        value={
                          airport.id
                        }
                      >
                        {
                          airport.iata_code
                        }{" "}
                        —{" "}
                        {
                          airport.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* Departure + Arrival */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Departure
                </label>

                <input
                  type="datetime-local"
                  value={
                    form.departure_datetime
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      departure_datetime:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Arrival
                </label>

                <input
                  type="datetime-local"
                  value={
                    form.arrival_datetime
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      arrival_datetime:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground"
                />

              </div>

            </div>

            {/* Cabin Class + Price */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Cabin Class
                </label>

                <select
                  value={form.cabin_class}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      cabin_class:
                        e.target.value as
                          | "ECONOMY"
                          | "PREMIUM_ECONOMY"
                          | "BUSINESS"
                          | "FIRST",
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="ECONOMY">
                    Economy
                  </option>

                  <option value="PREMIUM_ECONOMY">
                    Premium Economy
                  </option>

                  <option value="BUSINESS">
                    Business
                  </option>

                  <option value="FIRST">
                    First Class
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Ticket Price
                </label>

                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

            </div>

            {/* Stops + Baggage */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Stops
                </label>

                <input
                  type="number"
                  value={form.stops}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      stops: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Baggage Allowance
                </label>

                <input
                  type="text"
                  value={form.baggage_allowance}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      baggage_allowance:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

            </div>

            {/* Aircraft + Terminal */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Aircraft
                </label>

                <input
                  type="text"
                  value={form.aircraft}
                  placeholder="Boeing 787 Dreamliner"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      aircraft:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Terminal
                </label>

                <input
                  type="text"
                  value={form.terminal}
                  placeholder="Terminal 3"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      terminal:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

            </div>

            {/* Gate + Booking Reference */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Gate
                </label>

                <input
                  type="text"
                  value={form.gate}
                  placeholder="A12"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      gate:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Booking Reference
                </label>

                <input
                  type="text"
                  value={form.booking_reference}
                  placeholder="ABC123"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      booking_reference:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

            </div>

            {/* Refundable + Status */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Refundable
                </label>

                <select
                  value={
                    form.refundable
                      ? "YES"
                      : "NO"
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      refundable:
                        e.target.value ===
                        "YES",
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="YES">
                    Yes
                  </option>

                  <option value="NO">
                    No
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium text-foreground">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status:
                        e.target.value as
                          | "SCHEDULED"
                          | "DELAYED"
                          | "BOARDING"
                          | "LANDED"
                          | "CANCELLED",
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="SCHEDULED">
                    Scheduled
                  </option>

                  <option value="DELAYED">
                    Delayed
                  </option>

                  <option value="BOARDING">
                    Boarding
                  </option>

                  <option value="LANDED">
                    Landed
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

            {/* Footer */}

            <div className="sticky bottom-0 -mx-6 mt-8 border-t border-border bg-card px-6 py-5">

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full rounded-lg border border-border px-5 py-3 font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading
                    ? "Updating..."
                    : "Update Flight"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}