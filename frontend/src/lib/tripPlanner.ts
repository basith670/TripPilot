import api from "./axios";

export const generateTrip = async (data: any) => {
  const response = await api.post(
    "/ai/generate-trip/",
    data
  );

  return response.data;
};