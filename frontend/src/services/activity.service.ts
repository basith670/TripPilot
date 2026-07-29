import api from "@/lib/axios";

export const getActivities = async (dayId: number | string) => {
  const response = await api.get("/activities/");

  return response.data.filter(
    (activity: any) =>
      Number(activity.itinerary_day) === Number(dayId)
  );
};

export const createActivity = async (data: {
  itinerary_day: number;
  title: string;
  location: string;
  start_time: string;
  end_time?: string;
  estimated_cost: number;
  priority: string;
  notes?: string;
}) => {
  const response = await api.post("/activities/", data);
  return response.data;
};

export const updateActivity = async (
  id: number,
  data: any
) => {
  const response = await api.put(
    `/activities/${id}/`,
    data
  );

  return response.data;
};

export const deleteActivity = async (
  id: number
) => {
  await api.delete(`/activities/${id}/`);
};