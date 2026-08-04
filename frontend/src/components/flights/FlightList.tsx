"use client";

import { useEffect, useState } from "react";

import FlightCard from "./FlightCard";

import { Flight } from "@/types/flight";
import { getFlights } from "@/services/flight.service";

interface FlightListProps {
  tripId: number;
}

export default function FlightList({
  tripId,
}: FlightListProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const data = await getFlights({ trip: tripId });

      setFlights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [tripId]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        Loading flights...
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center">
        <h3 className="text-xl font-semibold">
          No Flights Found
        </h3>

        <p className="mt-2 text-gray-500">
          Add a flight to this trip to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          onView={(flight) =>
            console.log("View", flight)
          }
          onSelect={(flight) =>
            console.log("Selected", flight)
          }
        />
      ))}
    </div>
  );
}