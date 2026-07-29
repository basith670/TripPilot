"use client";

import Link from "next/link";

import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

interface Airport {
  id: number;
  name: string;
  iata_code: string;
}

interface Trip {
  id: number;
  source_airport: Airport;
  destination_airport: Airport;
  departure_date: string;
  return_date: string;
  travelers: number;
  cabin_class: string;
  budget: string;
  status: string;
  notes: string;
}

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
}

const statusColors: Record<string, string> = {
  PLANNING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function TripCard({
  trip,
  onEdit,
  onDelete,
}: TripCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Clickable Area */}
      <Link
        href={`/trips/${trip.id}`}
        className="block cursor-pointer"
      >
        {/* Route */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {trip.source_airport.iata_code} → {trip.destination_airport.iata_code}
          </h2>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              statusColors[trip.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {trip.status}
          </span>
        </div>

        <p className="mt-1 text-gray-500">
          {trip.source_airport.name} → {trip.destination_airport.name}
        </p>

        {/* Details */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            <span className="text-gray-700">
              {trip.departure_date} - {trip.return_date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaUsers className="text-green-600" />
            <span className="text-gray-700">
              {trip.travelers} Travelers
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaPlaneDeparture className="text-orange-500" />
            <span className="text-gray-700">
              {trip.cabin_class}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaWallet className="text-purple-600" />
            <span className="font-semibold text-gray-900">
              ₹{Number(trip.budget).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Notes */}
        {trip.notes && (
          <p className="mt-5 rounded-lg bg-gray-50 p-3 text-gray-600">
            {trip.notes}
          </p>
        )}
      </Link>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3 border-t pt-4">
        <button
          onClick={() => onEdit(trip)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(trip)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}