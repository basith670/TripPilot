import api from "@/lib/axios";
import { Activity } from "@/types/itinerary";

export const getActivities = async (
  dayId: number | string
): Promise<Activity[]> => {
  const response = await api.get<Activity[]>("/activities/");

  return response.data.filter(
    (activity: Activity) =>
      Number(activity.itinerary_day) === Number(dayId)
  );
};

export const createActivity = async (
  data: Omit<Activity, "id">
): Promise<Activity> => {
  const response = await api.post<Activity>(
    "/activities/",
    data
  );

  return response.data;
};

export const updateActivity = async (
  id: number,
  data: Partial<Omit<Activity, "id">>
): Promise<Activity> => {
  const response = await api.put<Activity>(
    `/activities/${id}/`,
    data
  );

  return response.data;
};

export const deleteActivity = async (
  id: number
): Promise<void> => {
  await api.delete(`/activities/${id}/`);
};