import api from "@/lib/axios";

import { Flight, Airline } from "@/types/flight";

export const getFlights = async (
  params?: {
    trip?: number;
    flight_type?: string;
    status?: string;
  }
): Promise<Flight[]> => {
  console.log("🚀 Fetch Flights Params:", params);

  const response = await api.get<Flight[]>(
    "/flights/flights/",
    {
      params,
    }
  );

  console.log("✅ Flights Response:", response.data);

  return response.data;
};

export const getFlight = async (
  id: number
): Promise<Flight> => {
  console.log("Fetching Flight:", id);

  const response = await api.get<Flight>(
    `/flights/flights/${id}/`
  );

  console.log("Flight Response:", response.data);

  return response.data;
};

export const getAirlines = async (): Promise<Airline[]> => {
  const response = await api.get<Airline[]>(
    "/flights/airlines/"
  );

  return response.data;
};

export const createFlight = async (
  data: Partial<Flight>
): Promise<Flight> => {
  console.log("Creating Flight:", data);

  const response = await api.post<Flight>(
    "/flights/flights/",
    data
  );

  console.log("Created Flight:", response.data);

  return response.data;
};

export const updateFlight = async (
  id: number,
  data: Partial<Flight>
): Promise<Flight> => {
  console.log("Updating Flight:", id, data);

  const response = await api.put<Flight>(
    `/flights/flights/${id}/`,
    data
  );

  console.log("Updated Flight:", response.data);

  return response.data;
};

export const deleteFlight = async (
  id: number
): Promise<void> => {
  console.log("Deleting Flight:", id);

  await api.delete(`/flights/flights/${id}/`);
};