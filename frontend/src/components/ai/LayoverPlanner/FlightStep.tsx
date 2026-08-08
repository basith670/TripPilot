"use client";

import {
  PlaneTakeoff,
  PlaneLanding,
  CalendarDays,
  Clock3,
} from "lucide-react";

import AirportAutocomplete from "@/components/common/AirportAutocomplete";
import { Airport } from "@/types/airport";

interface FlightStepProps {
  formData: {
    departureAirport: string;
    layoverAirport: string;
    destinationAirport: string;

    arrivalDate: string;
    arrivalTime: string;

    departureDate: string;
    departureTime: string;
  };

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function FlightStep({
  formData,
  handleChange,
  setFormData,
}: FlightStepProps) {
  return (
    <div>

      {/* Header */}

      <div className="mb-8">

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">

          <PlaneTakeoff
            size={18}
            className="text-blue-600"
          />

          <span className="text-sm font-semibold text-blue-700">
            Step 1
          </span>

        </div>

        <h3 className="mt-4 text-2xl font-bold">
          Layover Flight Details
        </h3>

        <p className="mt-2 text-gray-500">
          Tell AI about your journey and layover schedule.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Departure */}

        <AirportAutocomplete
          label="Departure Airport"
          icon={PlaneTakeoff}
          value={formData.departureAirport}
          placeholder="Search departure airport..."
          onSelect={(airport: Airport) =>
            setFormData((prev: any) => ({
              ...prev,
              departureAirport: airport.iata_code,
            }))
          }
        />

        {/* Layover */}

        <AirportAutocomplete
          label="Layover Airport"
          icon={PlaneLanding}
          value={formData.layoverAirport}
          placeholder="Search layover airport..."
          onSelect={(airport: Airport) =>
            setFormData((prev: any) => ({
              ...prev,
              layoverAirport: airport.iata_code,
            }))
          }
        />

        {/* Destination */}

        <div className="lg:col-span-2">

          <AirportAutocomplete
            label="Destination Airport"
            icon={PlaneLanding}
            value={formData.destinationAirport}
            placeholder="Search destination airport..."
            onSelect={(airport: Airport) =>
              setFormData((prev: any) => ({
                ...prev,
                destinationAirport: airport.iata_code,
              }))
            }
          />

        </div>

        {/* Arrival Date */}

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Arrival Date
          </label>

          <div className="relative">

            <CalendarDays
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
            />

            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border pl-12 pr-4"
            />

          </div>

        </div>

        {/* Arrival Time */}

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Arrival Time
          </label>

          <div className="relative">

            <Clock3
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
            />

            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border pl-12 pr-4"
            />

          </div>

        </div>

        {/* Departure Date */}

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Departure Date
          </label>

          <div className="relative">

            <CalendarDays
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
            />

            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border pl-12 pr-4"
            />

          </div>

        </div>

        {/* Departure Time */}

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Departure Time
          </label>

          <div className="relative">

            <Clock3
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
            />

            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border pl-12 pr-4"
            />

          </div>

        </div>

      </div>

    </div>
  );
}