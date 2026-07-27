import { z } from "zod";

export const tripSchema = z
  .object({
    source_airport_id: z.coerce.number().min(1, "Select a source airport"),
    destination_airport_id: z.coerce.number().min(1, "Select a destination airport"),
    departure_date: z.string().min(1, "Departure date is required"),
    return_date: z.string().min(1, "Return date is required"),
    travelers: z.coerce.number().min(1, "At least one traveler is required"),
    cabin_class: z.string(),
    budget: z.coerce.number().min(0, "Budget cannot be negative"),
    status: z.string(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => data.source_airport_id !== data.destination_airport_id,
    {
      message: "Source and destination airports must be different",
      path: ["destination_airport_id"],
    }
  );

export type TripFormData = z.infer<typeof tripSchema>;