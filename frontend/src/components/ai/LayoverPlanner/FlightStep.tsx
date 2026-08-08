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

  setFormData: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function FlightStep({
  formData,
  handleChange,
  setFormData,
}: FlightStepProps) {
  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-blue-100
            dark:bg-blue-500/15
            px-4
            py-2
          "
        >
          <PlaneTakeoff
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Step 1 of 3
          </span>
        </div>

        <h3 className="mt-5 text-3xl font-bold text-foreground">
          Flight Information
        </h3>

        <p className="mt-2 text-muted-foreground">
          Enter your flight schedule so AI can
          intelligently plan your layover.
        </p>
      </div>

      {/* Airports */}

      <div
        className="
          rounded-3xl
          border
          border-border
          bg-card
          p-6
        "
      >
        <h4 className="mb-6 text-lg font-semibold text-foreground">
          Airports
        </h4>

        <div className="grid gap-6 lg:grid-cols-2">
          <AirportAutocomplete
            label="Departure Airport"
            icon={PlaneTakeoff}
            value={formData.departureAirport}
            placeholder="Search departure airport..."
            onSelect={(airport: Airport) =>
              setFormData((prev: any) => ({
                ...prev,
                departureAirport:
                  airport.iata_code,
              }))
            }
          />

          <AirportAutocomplete
            label="Layover Airport"
            icon={PlaneLanding}
            value={formData.layoverAirport}
            placeholder="Search layover airport..."
            onSelect={(airport: Airport) =>
              setFormData((prev: any) => ({
                ...prev,
                layoverAirport:
                  airport.iata_code,
              }))
            }
          />

          <div className="lg:col-span-2">
            <AirportAutocomplete
              label="Destination Airport"
              icon={PlaneLanding}
              value={formData.destinationAirport}
              placeholder="Search destination airport..."
              onSelect={(airport: Airport) =>
                setFormData((prev: any) => ({
                  ...prev,
                  destinationAirport:
                    airport.iata_code,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Arrival */}

      <div
        className="
          rounded-3xl
          border
          border-blue-200
          bg-blue-50
          p-6

          dark:border-blue-500/20
          dark:bg-blue-500/10
        "
      >
        <h4 className="mb-6 text-lg font-semibold text-blue-900 dark:text-blue-300">
          Arrival at Layover Airport
        </h4>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Arrival Date
            </label>

            <div className="relative">
              <CalendarDays
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
              />

              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  pl-12
                  pr-4
                  text-foreground
                  transition-all
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/20
                  focus:outline-none
                "
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Arrival Time
            </label>

            <div className="relative">
              <Clock3
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
              />

              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  pl-12
                  pr-4
                  text-foreground
                  transition-all
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/20
                  focus:outline-none
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Departure */}

      <div
        className="
          rounded-3xl
          border
          border-green-200
          bg-green-50
          p-6

          dark:border-green-500/20
          dark:bg-green-500/10
        "
      >
        <h4 className="mb-6 text-lg font-semibold text-green-900 dark:text-green-300">
          Departure from Layover Airport
        </h4>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Departure Date
            </label>

            <div className="relative">
              <CalendarDays
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400"
              />

              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  pl-12
                  pr-4
                  text-foreground
                  transition-all
                  focus:border-green-500
                  focus:ring-4
                  focus:ring-green-500/20
                  focus:outline-none
                "
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Departure Time
            </label>

            <div className="relative">
              <Clock3
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400"
              />

              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  pl-12
                  pr-4
                  text-foreground
                  transition-all
                  focus:border-green-500
                  focus:ring-4
                  focus:ring-green-500/20
                  focus:outline-none
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}