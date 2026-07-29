import api from "@/lib/axios";
import { CreateTripData } from "@/features/trips/tripTypes";

export const getTrips = async () => {
  const response = await api.get("/trips/");
  return response.data;
};

export const getTrip = async (id: number | string) => {
  const response = await api.get(`/trips/${id}/`);
  return response.data;
};

export const createTrip = async (data: CreateTripData) => {
  const response = await api.post("/trips/", data);
  return response.data;
};

export const updateTrip = async (
  id: number,
  data: CreateTripData
) => {
  const response = await api.put(`/trips/${id}/`, data);
  return response.data;
};

export const deleteTrip = async (id: number) => {
  await api.delete(`/trips/${id}/`);
};