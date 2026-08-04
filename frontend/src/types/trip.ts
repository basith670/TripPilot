import { ItineraryDay } from "./itinerary";

export interface Airport {
  id: number;
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

export interface Trip {
  id: number;

  // Trip Name
  title: string;

  source_airport: Airport;
  destination_airport: Airport;

  departure_date: string;
  return_date: string;

  travelers: number;
  cabin_class: string;
  budget: number;

  status: string;
  notes?: string;

  days: ItineraryDay[];
}