import json

from django.conf import settings

from google import genai
from google.genai import types

from apps.ai.prompts.trip_prompt import build_trip_prompt
from apps.flights.services.flight_generator import FlightGenerator


class TripPlannerService:
    client = genai.Client(
        api_key=settings.GEMINI_API_KEY,
    )

    @classmethod
    def generate(
        cls,
        data,
    ):
        prompt = build_trip_prompt(data)

        try:
            response = cls.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    # Explicit timeout (ms) so a slow/hung Gemini call
                    # fails cleanly with our own error response instead
                    # of the request hanging until Gunicorn's worker
                    # timeout kills the whole process mid-request.
                    http_options=types.HttpOptions(
                        timeout=60_000,
                    ),
                ),
            )

            result = json.loads(
                response.text
            )

            # ==========================================
            # Generate Real Flight
            # ==========================================

            flight = FlightGenerator.generate(
                source_airport=data["source_airport"],
                destination_airport=data["destination_airport"],
                cabin_class=data["cabin_class"],
            )

            if flight:
                reason = result.get("flight", {}).get("reason", "")

                flight["reason"] = reason

                result["flight"] = flight
            else:
                # No seeded FlightRoute for this airport pair.
                # Fall back to whatever Gemini proposed (if anything)
                # rather than silently dropping the flight entirely.
                result.setdefault("flight", None)

            return {
                "success": True,
                "data": result,
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }