import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  generateAIItinerary,
  GenerateItineraryRequest,
  GenerateItineraryResponse,
} from "@/lib/ai";

export const useGenerateItinerary = () => {
  const [loading, setLoading] = useState(false);

  const generate = async (
    data: GenerateItineraryRequest
  ): Promise<GenerateItineraryResponse | null> => {
    try {
      setLoading(true);

      const result = await generateAIItinerary(data);

      toast.success("AI itinerary generated successfully!");

      return result;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.error ??
            "Failed to generate itinerary."
          );
        } else {
          toast.error("Failed to generate itinerary.");
        }
      
        return null;
      } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generate,
  };
};