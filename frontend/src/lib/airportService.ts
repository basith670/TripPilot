import api from "./axios";
import { Airport } from "@/types/airport";

export async function searchAirports(
  search: string
): Promise<Airport[]> {
  if (!search.trim()) {
    return [];
  }

  try {
    const response = await api.get(
      "travel/airports/",
      {
        params: {
          search,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Airport search failed:", error);
    return [];
  }
}