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
  return_date: string | null;

  travelers: number;

  cabin_class: string;

  budget: number | null;

  status: string;

  notes?: string;

  // Selected Flight
  selected_flight: number | null;

  // Selected Hotel
  selected_hotel: number | null;

  days: ItineraryDay[];

  created_at: string;
  updated_at: string;
}