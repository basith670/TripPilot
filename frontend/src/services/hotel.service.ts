import api from "@/lib/axios";

import { Hotel } from "@/types/hotel";

export const getHotels = async (
  params?: {
    trip?: number;
    status?: string;
    room_type?: string;
    city?: string;
  }
): Promise<Hotel[]> => {
  const response = await api.get<Hotel[]>(
    "/hotels/hotels/",
    {
      params,
    }
  );

  return response.data;
};

export const getHotel = async (
  id: number
): Promise<Hotel> => {
  const response = await api.get<Hotel>(
    `/hotels/hotels/${id}/`
  );

  return response.data;
};

export const createHotel = async (
  data: Partial<Hotel>
): Promise<Hotel> => {
  const response = await api.post<Hotel>(
    "/hotels/hotels/",
    data
  );

  return response.data;
};

export const updateHotel = async (
  id: number,
  data: Partial<Hotel>
): Promise<Hotel> => {
  const response = await api.put<Hotel>(
    `/hotels/hotels/${id}/`,
    data
  );

  return response.data;
};

export const deleteHotel = async (
  id: number
): Promise<void> => {
  await api.delete(
    `/hotels/hotels/${id}/`
  );
};