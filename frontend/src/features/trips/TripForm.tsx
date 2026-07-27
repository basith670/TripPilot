"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { tripSchema, TripFormData } from "./tripSchema";
import { Airport, getAirports } from "@/services/airport.service";

interface TripFormProps {
  onSubmit: (data: TripFormData) => Promise<void> | void;
  loading?: boolean;
}

export default function TripForm({
  onSubmit,
  loading = false,
}: TripFormProps) {
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const data = await getAirports();
        setAirports(data);
      } catch (error) {
        console.error("Failed to load airports:", error);
      }
    };

    fetchAirports();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      source_airport_id: undefined,
      destination_airport_id: undefined,
      departure_date: "",
      return_date: "",
      travelers: 1,
      cabin_class: "ECONOMY",
      budget: 0,
      status: "PLANNING",
      notes: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {/* Source Airport */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Source Airport
          </label>

          <select
            {...register("source_airport_id")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="">Select Airport</option>

            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.iata_code} - {airport.name}
              </option>
            ))}
          </select>

          {errors.source_airport_id && (
            <p className="mt-1 text-sm text-red-500">
              {errors.source_airport_id.message}
            </p>
          )}
        </div>

        {/* Destination Airport */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Destination Airport
          </label>

          <select
            {...register("destination_airport_id")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="">Select Airport</option>

            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.iata_code} - {airport.name}
              </option>
            ))}
          </select>

          {errors.destination_airport_id && (
            <p className="mt-1 text-sm text-red-500">
              {errors.destination_airport_id.message}
            </p>
          )}
        </div>

        {/* Departure */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Departure Date
          </label>

          <input
            type="date"
            {...register("departure_date")}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          {errors.departure_date && (
            <p className="mt-1 text-sm text-red-500">
              {errors.departure_date.message}
            </p>
          )}
        </div>

        {/* Return */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Return Date
          </label>

          <input
            type="date"
            {...register("return_date")}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          {errors.return_date && (
            <p className="mt-1 text-sm text-red-500">
              {errors.return_date.message}
            </p>
          )}
        </div>

        {/* Travelers */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Travelers
          </label>

          <input
            type="number"
            min={1}
            {...register("travelers")}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          {errors.travelers && (
            <p className="mt-1 text-sm text-red-500">
              {errors.travelers.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Budget
          </label>

          <input
            type="number"
            min={0}
            {...register("budget")}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          {errors.budget && (
            <p className="mt-1 text-sm text-red-500">
              {errors.budget.message}
            </p>
          )}
        </div>

        {/* Cabin Class */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Cabin Class
          </label>

          <select
            {...register("cabin_class")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            {...register("status")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="PLANNING">Planning</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Notes
        </label>

        <textarea
          rows={4}
          {...register("notes")}
          className="w-full rounded-lg border border-gray-300 p-3"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </div>
    </form>
  );
}