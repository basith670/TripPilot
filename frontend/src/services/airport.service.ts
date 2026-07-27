import api from "@/lib/axios";

export interface Airport {
  id: number;
  name: string;
  iata_code: string;
}

export const getAirports = async (): Promise<Airport[]> => {
  const response = await api.get("/travel/airports/");
  return response.data;
};