import api from "@/lib/axios";
import { ItineraryDay } from "@/types/itinerary";

export const getItineraryDays = async (
  tripId: number | string
): Promise<ItineraryDay[]> => {
  const response = await api.get<ItineraryDay[]>(
    "/itinerary-days/"
  );

  return response.data.filter(
    (day: ItineraryDay) =>
      Number(day.trip) === Number(tripId)
  );
};

export const createItineraryDay = async (
  data: Omit<ItineraryDay, "id">
): Promise<ItineraryDay> => {
  const response = await api.post<ItineraryDay>(
    "/itinerary-days/",
    data
  );

  return response.data;
};

export const updateItineraryDay = async (
  id: number,
  data: Partial<ItineraryDay>
): Promise<ItineraryDay> => {
  const response = await api.patch<ItineraryDay>(
    `/itinerary-days/${id}/`,
    data
  );

  return response.data;
};

export const deleteItineraryDay = async (
  id: number
) => {
  const response = await api.delete(
    `/itinerary-days/${id}/`
  );

  return response.data;
};

export const duplicateItineraryDay = async (
  id: number
) => {
  const response = await api.post(
    `/itinerary-days/${id}/duplicate/`
  );

  return response.data;
};