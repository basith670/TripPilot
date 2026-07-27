export interface CreateTripData {
    source_airport_id: number;
    destination_airport_id: number;
    departure_date: string;
    return_date: string;
    travelers: number;
    cabin_class: string;
    budget: number;
    status: string;
    notes: string;
  }