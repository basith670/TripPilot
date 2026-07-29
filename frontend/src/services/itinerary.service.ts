import api from "@/lib/axios";

export const getItineraryDays = async (tripId: number | string) => {
  const response = await api.get("/itinerary-days/");

  return response.data.filter(
    (day: any) => Number(day.trip) === Number(tripId)
  );
};

export const createItineraryDay = async (data: {
  trip: number;
  day_number: number;
  date: string;
  title: string;
  notes?: string;
}) => {
  const response = await api.post("/itinerary-days/", data);

  return response.data;
};