import api from "./axios";

export async function saveLayoverTrip(
  planner: any,
  result: any
) {
  try {
    const response = await api.post(
      "/trips/save-layover/",
      {
        planner,
        result,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Save Layover Error:", error);

    return {
      success: false,
      error:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to save trip.",
    };
  }
}