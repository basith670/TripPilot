export interface Airline {
    id: number;
    name: string;
    code: string;
    logo: string;
  }
  
  export interface Flight {
    id: number;
  
    trip: number;
  
    airline: number;
    airline_name: string;
    airline_logo: string;
  
    flight_type: "OUTBOUND" | "RETURN";
  
    flight_number: string;
  
    source_airport: number;
    destination_airport: number;
  
    source_airport_name: string;
    destination_airport_name: string;
  
    source_iata: string;
    destination_iata: string;
  
    departure_datetime: string;
    arrival_datetime: string;
  
    duration_minutes: number;
    duration_display: string;
  
    cabin_class: string;
  
    price: number;
  
    stops: number;
  
    baggage_allowance: string;
  
    refundable: boolean;
  
    aircraft: string;
  
    terminal: string;
  
    gate: string;
  
    booking_reference: string;
  
    status: string;
  
    created_at: string;
    updated_at: string;
  }
  
  /*
  |--------------------------------------------------------------------------
  | AI Generated Flight
  |--------------------------------------------------------------------------
  |
  | Used by the AI Trip Planner before the generated flight is saved
  | as a database Flight.
  |
  */
  
  export interface GeneratedFlight {
    airline: string;
    airline_name?: string;
    airline_code: string;
    airline_logo?: string;
  
    flight_number: string;
  
    departure_airport: string;
    arrival_airport: string;
  
    departure_terminal?: string;
    arrival_terminal?: string;
  
    departure_time: string;
    arrival_time: string;
  
    duration: string;
  
    distance_km?: number;
  
    price: number;
  
    stops: number;
  
    aircraft: string;
  
    baggage: string;
  
    cabin_class: string;
  
    reason?: string;
  }