"use client";

import { useEffect, useState } from "react";

import {
  createFlight,
  getAirlines,
} from "@/services/flight.service";

import {
  getAirports,
  Airport,
} from "@/services/airport.service";

import { Airline } from "@/types/flight";

import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  tripId: number;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function AddFlightModal({
  isOpen,
  tripId,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);

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
        const [airlineData, airportData] =
          await Promise.all([
            getAirlines(),
            getAirports(),
          ]);

        setAirlines(airlineData);

        setAirports(airportData);
      } catch (err) {
        console.error(err);

        toast.error(
          "Failed to load data."
        );
      }
    };

    loadData();
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;

    setForm({
      airline: "",

      flight_number: "",

      flight_type: "OUTBOUND",

      source_airport: "",

      destination_airport: "",

      departure_datetime: "",

      arrival_datetime: "",

      cabin_class: "ECONOMY",

      price: "",

      stops: "",

      baggage_allowance: "25 kg",

      refundable: true,

      aircraft: "",

      terminal: "",

      gate: "",

      booking_reference: "",

      status: "SCHEDULED",
    });

    onClose();
  };

  const handleSubmit = async () => {
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

      console.log("FORM STATE:", form);
        console.log("AIRLINE:", form.airline);
        console.log("PAYLOAD:", {
        trip: tripId,
        airline: Number(form.airline),
        source_airport: Number(form.source_airport),
        destination_airport: Number(form.destination_airport),
        });

      await createFlight({
        trip: tripId,

        airline: Number(form.airline),

        flight_number:
          form.flight_number,

        flight_type:
          form.flight_type,

        source_airport: Number(
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

          duration_minutes: duration,

        cabin_class:
          form.cabin_class,

          price: Number(form.price),

          stops: Number(form.stops),

        baggage_allowance:
          form.baggage_allowance,

        refundable:
          form.refundable,

        aircraft: form.aircraft,

        terminal: form.terminal,

        gate: form.gate,

        booking_reference:
          form.booking_reference,

        status: form.status,
      });

      toast.success(
        "Flight created successfully."
      );

      await onSuccess();

      handleClose();
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to create flight."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

  <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

    <div className="mb-8 flex items-center justify-between">

      <h2 className="text-3xl font-bold">
        Add Flight
      </h2>

      <button
        onClick={handleClose}
        className="text-2xl text-gray-500 hover:text-black"
      >
        ×
      </button>

    </div>

    <div className="space-y-6">

      {/* Airline + Flight Number */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="mb-2 block font-medium">
            Airline
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.airline}
            onChange={(e) =>
                setForm((prev) => ({
                    ...prev,
                    airline: e.target.value,
                }))
            }
        >
            <option value="">Select Airline</option>

            {airlines.map((airline) => (
                <option
                    key={airline.id}
                    value={airline.id}
                >
                    {airline.name}
                </option>
            ))}
        </select>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Flight Number
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="EK530"
            value={form.flight_number}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                flight_number: e.target.value,
              }))
            }
          />

        </div>

      </div>

      {/* Flight Type */}

      <div>

        <label className="mb-2 block font-medium">
          Flight Type
        </label>

        <select
          className="w-full rounded-lg border p-3"
          value={form.flight_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              flight_type: e.target.value as
                | "OUTBOUND"
                | "RETURN",
            }))
          }
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

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="mb-2 block font-medium">
            Source Airport
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.source_airport}
            onChange={(e)=>
                setForm((prev)=>({
                    ...prev,
                    source_airport:e.target.value
                }))
                }
          >
            <option value="">
              Select Airport
            </option>

            {airports.map((airport) => (
              <option
                key={airport.id}
                value={airport.id}
              >
                {airport.iata_code} — {airport.name}
              </option>
            ))}

          </select>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Destination Airport
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.destination_airport}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                destination_airport: e.target.value,
              }))
            }
          >
            <option value="">
              Select Airport
            </option>

            {airports.map((airport) => (
              <option
                key={airport.id}
                value={airport.id}
              >
                {airport.iata_code} — {airport.name}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* Departure + Arrival */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="mb-2 block font-medium">
            Departure
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border p-3"
            value={form.departure_datetime}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                departure_datetime: e.target.value,
              }))
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Arrival
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border p-3"
            value={form.arrival_datetime}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                arrival_datetime: e.target.value,
              }))
            }
          />

        </div>

      </div>
            {/* Cabin Class + Price */}

            <div className="grid grid-cols-2 gap-6">

<div>

  <label className="mb-2 block font-medium">
    Cabin Class
  </label>

  <select
    className="w-full rounded-lg border p-3"
    value={form.cabin_class}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        cabin_class: e.target.value as
          | "ECONOMY"
          | "PREMIUM_ECONOMY"
          | "BUSINESS"
          | "FIRST",
      }))
    }
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

  <label className="mb-2 block font-medium">
    Ticket Price
  </label>

  <input
    type="number"
    className="w-full rounded-lg border p-3"
    value={form.price}
    onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          price: e.target.value,
        }))
      }
  />

</div>

</div>

{/* Stops + Baggage */}

<div className="grid grid-cols-2 gap-6">

<div>

  <label className="mb-2 block font-medium">
    Stops
  </label>

  <input
  type="number"
  className="w-full rounded-lg border p-3"
  value={form.stops}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      stops: e.target.value,
    }))
  }
/>

</div>

<div>

  <label className="mb-2 block font-medium">
    Baggage Allowance
  </label>

  <input
    className="w-full rounded-lg border p-3"
    value={form.baggage_allowance}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        baggage_allowance: e.target.value,
      }))
    }
  />

</div>

</div>

{/* Aircraft + Terminal */}

<div className="grid grid-cols-2 gap-6">

<div>

  <label className="mb-2 block font-medium">
    Aircraft
  </label>

  <input
    className="w-full rounded-lg border p-3"
    placeholder="Boeing 787 Dreamliner"
    value={form.aircraft}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        aircraft: e.target.value,
      }))
    }
  />

</div>

<div>

  <label className="mb-2 block font-medium">
    Terminal
  </label>

  <input
    className="w-full rounded-lg border p-3"
    placeholder="Terminal 3"
    value={form.terminal}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        terminal: e.target.value,
      }))
    }
  />

</div>

</div>

{/* Gate + Booking Reference */}

<div className="grid grid-cols-2 gap-6">

<div>

  <label className="mb-2 block font-medium">
    Gate
  </label>

  <input
    className="w-full rounded-lg border p-3"
    placeholder="A12"
    value={form.gate}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        gate: e.target.value,
      }))
    }
  />

</div>

<div>

  <label className="mb-2 block font-medium">
    Booking Reference
  </label>

  <input
    className="w-full rounded-lg border p-3"
    placeholder="ABC123"
    value={form.booking_reference}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        booking_reference: e.target.value,
      }))
    }
  />

</div>

</div>

{/* Refundable + Status */}

<div className="grid grid-cols-2 gap-6">

<div>

  <label className="mb-2 block font-medium">
    Refundable
  </label>

  <select
    className="w-full rounded-lg border p-3"
    value={form.refundable ? "YES" : "NO"}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        refundable:
          e.target.value === "YES",
      }))
    }
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

  <label className="mb-2 block font-medium">
    Status
  </label>

  <select
    className="w-full rounded-lg border p-3"
    value={form.status}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        status: e.target.value as
          | "SCHEDULED"
          | "DELAYED"
          | "BOARDING"
          | "LANDED"
          | "CANCELLED",
      }))
    }
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

      <div className="mt-8 flex justify-end gap-4">

        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Flight"}
        </button>

      </div>

    </div>

  </div>

</div>
  );
}