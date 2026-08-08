"use client";

import {
  PlaneTakeoff,
  PlaneLanding,
  CalendarDays,
  Wallet,
} from "lucide-react";

import AirportAutocomplete from "@/components/common/AirportAutocomplete";
import { Airport } from "@/types/airport";

interface BasicInfoStepProps {
  formData: {
    sourceAirport: string;
    destinationAirport: string;
    departureDate: string;
    returnDate: string;
    budget: string;
  };

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  setFormData: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function BasicInfoStep({
  formData,
  handleChange,
  setFormData,
}: BasicInfoStepProps) {
  return (
    <div>
      {/* Header */}

      <div className="mb-8">

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
            Step 1
          </span>

        </div>

        <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Trip Details
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
          Tell AI where you're travelling, when you're leaving,
          and your overall trip budget.
        </p>

      </div>

      {/* Form */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Departure */}

        <AirportAutocomplete
          label="Departure Airport"
          icon={PlaneTakeoff}
          value={formData.sourceAirport}
          placeholder="Search departure airport..."
          onSelect={(airport: Airport) =>
            setFormData((prev: any) => ({
              ...prev,
              sourceAirport: airport.iata_code,
            }))
          }
        />

        {/* Destination */}

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

        {/* Departure Date */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-foreground">
            Departure Date
          </label>

          <div className="relative">

            <CalendarDays
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400"
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

                bg-background

                pl-12
                pr-4

                text-foreground

                transition-all
                duration-300

                focus:border-purple-500
                focus:ring-4
                focus:ring-purple-500/20
                focus:outline-none
              "
            />

          </div>

        </div>

        {/* Return Date */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-foreground">
            Return Date
          </label>

          <div className="relative">

            <CalendarDays
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400"
            />

            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="
                h-14
                w-full

                rounded-2xl

                border
                border-border

                bg-background

                pl-12
                pr-4

                text-foreground

                transition-all
                duration-300

                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/20
                focus:outline-none
              "
            />

          </div>

        </div>

        {/* Budget */}

        <div className="lg:col-span-2">

          <label className="mb-2 block text-sm font-semibold text-foreground">
            Total Budget
          </label>

          <div className="relative">

            <Wallet
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              INR
            </span>

            <input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="200000"
              className="
                h-14
                w-full

                rounded-2xl

                border
                border-border

                bg-background

                pl-12
                pr-20

                text-base
                text-foreground

                placeholder:text-muted-foreground

                transition-all
                duration-300

                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/20
                focus:outline-none
              "
            />

          </div>

        </div>

      </div>
    </div>
  );
}