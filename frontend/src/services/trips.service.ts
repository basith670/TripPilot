import api from "@/lib/axios";
import { CreateTripData } from "@/features/trips/tripTypes";

/* ==========================================================
   GET TRIPS
========================================================== */

export const getTrips = async () => {
  const response = await api.get("/trips/");
  return response.data;
};

/* ==========================================================
   GET LAYOVER TRIPS
========================================================== */

export const getLayoverTrips = async () => {
  const response = await api.get("/layover-trips/");
  return response.data;
};

/* ==========================================================
   GET SINGLE TRIP
========================================================== */

export const getTrip = async (
  id: number | string
) => {
  const response = await api.get(
    `/trips/${id}/`
  );

  return response.data;
};

/* ==========================================================
   CREATE TRIP
========================================================== */

export const createTrip = async (
  data: CreateTripData
) => {
  const response = await api.post(
    "/trips/",
    data
  );

  return response.data;
};

/* ==========================================================
   UPDATE TRIP
========================================================== */

export const updateTrip = async (
  id: number,
  data: CreateTripData
) => {
  const response = await api.put(
    `/trips/${id}/`,
    data
  );

  return response.data;
};

/* ==========================================================
   DELETE TRIP
========================================================== */

export const deleteTrip = async (
  id: number
) => {
  await api.delete(`/trips/${id}/`);
};

/* ==========================================================
   SAVE AI ITINERARY
========================================================== */

export const saveAIItinerary = async (
  tripId: string,
  days: any[]
) => {
  const response = await api.post(
    `/trips/${tripId}/save-ai-itinerary/`,
    {
      days,
    }
  );

  return response.data;
};

/* ==========================================================
   SAVE GENERATED AI TRIP
========================================================== */

export const saveGeneratedTrip = async (
  planner: any,
  trip: any
) => {
  const response = await api.post(
    "/trips/save-generated-trip/",
    {
      planner,
      trip,
    }
  );

  return response.data;
};

/* ==========================================================
   SELECT FLIGHT
========================================================== */

export const selectFlight = async (
  tripId: number,
  flightId: number
) => {
  const response = await api.post(
    `/trips/${tripId}/select-flight/`,
    {
      flight_id: flightId,
    }
  );

  return response.data;
};

/* ==========================================================
   SELECT HOTEL
========================================================== */

export const selectHotel = async (
  tripId: number,
  hotelId: number
) => {
  const response = await api.post(
    `/trips/${tripId}/select-hotel/`,
    {
      hotel_id: hotelId,
    }
  );

  return response.data;
};

/* ==========================================================
   LAYOVER TRIPS
========================================================== */

export const getLayoverTrip = async (
  id: number | string
) => {
  const response = await api.get(
    `/layover-trips/${id}/`
  );

  return response.data;
};

export const updateLayoverTrip = async (
  id: number,
  data: any
) => {
  const response = await api.put(
    `/layover-trips/${id}/`,
    data
  );

  return response.data;
};

export const deleteLayoverTrip = async (
  id: number
) => {
  await api.delete(
    `/layover-trips/${id}/`
  );
};
