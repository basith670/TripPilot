import json

from django.conf import settings

from google import genai
from google.genai import types


class AIItineraryService:
    client = genai.Client(
        api_key=settings.GEMINI_API_KEY,
    )

    @classmethod
    def generate(
        cls,
        destination,
        days,
        budget,
        travel_style,
    ):
        prompt = f"""
You are TripPilot AI.

You are an expert international travel planner.

Your job is to generate realistic travel itineraries suitable for production travel applications.

Destination:
{destination}

Trip Length:
{days} days

Maximum Total Budget:
₹{budget}

Travel Style:
{travel_style}

Return ONLY valid JSON.

The JSON MUST follow EXACTLY this schema:

{{
  "days": [
    {{
      "day": 1,
      "activities": [
        {{
        "time": "09:00",
        "title": "Burj Khalifa Observation Deck",
        "description": "Visit the observation deck with panoramic city views.",
        "location": "Downtown Dubai",
        "estimated_cost": 1850,
        "category": "ACTIVITIES",
        "priority": "HIGH"
      }}
      ]
    }}
  ]
}}

Rules:

Return ONLY JSON.

Do NOT explain anything.

Do NOT use Markdown.

Do NOT wrap JSON inside ```.

Generate EXACTLY {days} days.

Generate between 4 and 6 activities every day.

Every activity MUST contain:

- time
- title
- description
- location
- estimated_cost
- category
- priority

Time Rules:

Use 24-hour format.

Example:

09:00

11:30

14:00

18:30

21:00

Activities must never overlap.

Activities must be arranged chronologically.

Priority Rules:

HIGH

MEDIUM

LOW

Only these three values are allowed.

Category Rules:

Category must be ONE of the following:

ACCOMMODATION

TRANSPORT

FOOD

ACTIVITIES

SHOPPING

ENTERTAINMENT

MISCELLANEOUS

Examples:

Breakfast → FOOD

Lunch → FOOD

Dinner → FOOD

Coffee → FOOD

Hotel Check-in → ACCOMMODATION

Hotel → ACCOMMODATION

Taxi → TRANSPORT

Metro → TRANSPORT

Airport Transfer → TRANSPORT

Museum → ACTIVITIES

Beach → ACTIVITIES

Theme Park → ACTIVITIES

Shopping Mall → SHOPPING

Souvenir Shopping → SHOPPING

Cinema → ENTERTAINMENT

Concert → ENTERTAINMENT

Location Rules:

Always use REAL places.

Examples:

Burj Khalifa

Dubai Mall

Palm Jumeirah

Louvre Abu Dhabi

Marina Bay Sands

Tokyo Skytree

Do not invent locations.

Budget Rules:

The TOTAL estimated cost across ALL activities should stay within ±10% of ₹{budget}.

Use realistic prices.

Examples:

Airport Transfer
₹500-2500

Metro
₹100-500

Taxi
₹300-1500

Breakfast
₹300-1200

Lunch
₹500-2000

Dinner
₹800-12000

Coffee
₹200-600

Museum
₹500-3000

Theme Park
₹3500-9000

Beach
₹0

Walking Tour
₹0-800

Luxury Shopping
₹3000-50000

Hotel Check-in
₹0

Luxury Hotel Check-in
₹0

Style Rules:

Luxury

Premium restaurants

Luxury shopping

Private transfers

Sky lounges

Business

Efficient schedule

Business districts

Good restaurants

Comfort

Budget

Public transport

Affordable restaurants

Free attractions

Hostels

Backpacker spots

Family

Theme parks

Aquariums

Museums

Shopping

Kid-friendly attractions

Couple

Sunset viewpoints

Fine dining

Cruises

Romantic experiences

Adventure

Water sports

Hiking

Safari

Desert activities

Scuba diving

Output Requirements:

Every day should feel different.

Avoid repeating attractions.

Mix indoor and outdoor experiences.

Include meal breaks where appropriate.

Distribute the budget realistically across the trip.

Return ONLY valid JSON.
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

            itinerary = json.loads(response.text)

            return {
                "success": True,
                "itinerary": itinerary,
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