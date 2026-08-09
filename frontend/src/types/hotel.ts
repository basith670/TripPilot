export interface Hotel {
    id: number;
  
    trip: number;
  
    name: string;
  
    image: string;
  
    rating: number;
  
    address: string;
  
    city: string;
  
    country: string;
  
    latitude: number | null;
  
    longitude: number | null;
  
    check_in: string;
  
    check_out: string;
  
    nights: number;
  
    room_type:
      | "STANDARD"
      | "DELUXE"
      | "SUITE"
      | "EXECUTIVE"
      | "FAMILY";
  
    guests: number;
  
    rooms: number;
  
    price: number;
  
    booking_reference: string;
  
    refundable: boolean;
  
    breakfast_included: boolean;
  
    wifi_included: boolean;
  
    parking_available: boolean;
  
    amenities: string;
  
    notes: string;
  
    status:
      | "RESERVED"
      | "CHECKED_IN"
      | "CHECKED_OUT"
      | "CANCELLED";
  
    created_at: string;
  
    updated_at: string;
  }