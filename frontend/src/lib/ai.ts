import api from "./axios";

export interface GenerateItineraryRequest {
  destination: string;
  days: number;
  budget: number;
  travel_style: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;

  estimated_cost: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  location: string;
}

export interface ItineraryDay {
  day: number;
  activities: Activity[];
}

export interface GenerateItineraryResponse {
  success: boolean;

  itinerary: {
    days: ItineraryDay[];
  };
}

export const generateAIItinerary = async (
  data: GenerateItineraryRequest
): Promise<GenerateItineraryResponse> => {
  const response =
    await api.post<GenerateItineraryResponse>(
      "/ai/generate-itinerary/",
      data
    );

  return response.data;
};