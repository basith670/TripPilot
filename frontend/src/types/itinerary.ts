export interface Activity {
  id: number;
  itinerary_day: number;

  title: string;
  location: string;

  start_time: string;
  end_time: string | null;

  estimated_cost: number;

  category: string;

  priority: string;

  notes?: string;
}
  
  export interface ItineraryDay {
    id: number;
    trip: number;
    day_number: number;
    date: string;
    title: string;
    notes?: string;
  }