import json

from django.conf import settings

from google import genai
from google.genai import types


class LayoverAIService:

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY,
    )

    @classmethod
    def generate(cls, payload):
        prompt = f"""
You are TripPilot AI.

Generate a realistic airport layover plan.

Return ONLY valid JSON.

Layover Details:

Departure Airport: {payload.get("departure_airport")}

Layover Airport: {payload.get("layover_airport")}

Destination Airport: {payload.get("destination_airport")}

Arrival Date:
{payload.get("arrival_date")}

Arrival Time:
{payload.get("arrival_time")}

Departure Date:
{payload.get("departure_date")}

Departure Time:
{payload.get("departure_time")}

Budget:
₹{payload.get("budget")}

Travel Style:
{payload.get("travel_style")}

Visa Required:
{payload.get("visa_required")}

Checked Baggage:
{payload.get("checked_baggage")}

Lounge Access:
{payload.get("lounge_access")}

Interests:
{", ".join(payload.get("interests", []))}

Return EXACTLY this JSON schema:

{{
  "airport": "",
  "country": "",
  "city": "",
  "layover_hours": 0,

  "summary": "",

  "timeline": [
    {{
      "time": "",
      "title": "",
      "description": "",
      "location": "",
      "estimated_cost": 0,
      "category": ""
    }}
  ],

  "tips": [],

  "restaurants": [],

  "lounges": [],

  "shopping": [],

  "transport": [],

  "warnings": [],

  "estimated_total_cost": 0
}}

Rules:

Return ONLY JSON.

Do not use markdown.

Do not explain anything.

Use real airport facilities whenever possible.

Create a realistic timeline from arrival until boarding.

Keep the estimated total cost within the given budget.
"""

        try:
            response = cls.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4,
                ),
            )

            result = json.loads(response.text)

            return {
                "success": True,
                "layover": result,
            }

        except json.JSONDecodeError:
            return {
                "success": False,
                "error": "Gemini returned invalid JSON.",
                "raw_response": (
                    response.text
                    if "response" in locals()
                    else ""
                ),
            }

        except Exception as e:
            print("\n========== GEMINI ERROR ==========")
            print(type(e).__name__)
            print(str(e))
            print("==================================\n")

            return {
                "success": False,
                "error": str(e),
            }