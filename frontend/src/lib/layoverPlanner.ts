import api from "./axios";

export interface LayoverPayload {
  departure_airport: string;
  layover_airport: string;
  destination_airport: string;

  arrival_date: string;
  arrival_time: string;

  departure_date: string;
  departure_time: string;

  budget: number | string;

  travel_style: string;

  visa_required: boolean;
  checked_baggage: boolean;
  lounge_access: boolean;

  interests: string[];
}

export async function generateLayover(
  payload: LayoverPayload
) {
  try {
    const response = await api.post(
        "/ai/layover/",
        payload
      );

    return response.data;
  } catch (error: any) {
    console.error("Layover AI Error:", error);

    return {
      success: false,
      error:
        error?.response?.data?.detail ||
        error?.response?.data ||
        "Unable to generate layover plan.",
    };
  }
}