import json
from json import JSONDecodeError

from django.conf import settings

from google import genai
from google.genai import types

from apps.ai.prompts.trip_prompt import build_trip_prompt
from apps.flights.services.flight_generator import FlightGenerator


class TripPlannerService:

    # ==========================================================
    # GEMINI CLIENT
    # ==========================================================

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY,
    )

    # ==========================================================
    # GENERATE TRIP
    # ==========================================================

    @classmethod
    def generate(
        cls,
        data,
    ):
        """
        Generate a complete AI travel plan.

        Gemini generates:
        - trip summary
        - hotel recommendation
        - itinerary
        - restaurants
        - transport
        - budget estimates
        - packing
        - travel tips
        - emergency contacts
        - local transport

        FlightGenerator generates:
        - outbound flight
        - return flight
        - airline
        - flight number
        - aircraft
        - duration
        - stops
        - baggage
        - price
        - timestamps

        Gemini only provides the flight recommendation reason.
        """

        try:

            # ==================================================
            # BUILD PROMPT
            # ==================================================

            prompt = build_trip_prompt(data)

            # ==================================================
            # GENERATE AI TRIP PLAN
            # ==================================================

            response = cls.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    http_options=types.HttpOptions(
                        timeout=60_000,
                    ),
                ),
            )

            # ==================================================
            # VALIDATE RESPONSE
            # ==================================================

            response_text = (
                response.text
                if response
                else None
            )

            if not response_text:
                raise ValueError(
                    "Gemini returned an empty response."
                )

            # ==================================================
            # PARSE JSON
            # ==================================================

            try:

                result = json.loads(
                    response_text
                )

            except JSONDecodeError as error:

                print(
                    "Gemini returned invalid JSON:"
                )

                print(
                    response_text[:2000]
                )

                raise ValueError(
                    "Gemini returned invalid JSON."
                ) from error

            # ==================================================
            # VALIDATE BASIC STRUCTURE
            # ==================================================

            if not isinstance(
                result,
                dict,
            ):
                raise ValueError(
                    "Gemini response must be a JSON object."
                )

            # ==================================================
            # FLIGHT RECOMMENDATION REASON
            # ==================================================

            flight_data_from_ai = (
                result.get(
                    "flight",
                    {},
                )
            )

            if not isinstance(
                flight_data_from_ai,
                dict,
            ):
                flight_data_from_ai = {}

            flight_reason = (
                flight_data_from_ai.get(
                    "reason",
                    "",
                )
            )

            # ==================================================
            # GENERATE OUTBOUND FLIGHT
            #
            # Source → Destination
            # ==================================================

            outbound_flight = (
                FlightGenerator.generate(
                    source_airport=data[
                        "source_airport"
                    ],

                    destination_airport=data[
                        "destination_airport"
                    ],

                    cabin_class=data[
                        "cabin_class"
                    ],

                    departure_date=data[
                        "departure_date"
                    ],
                )
            )

            # ==================================================
            # GENERATE RETURN FLIGHT
            #
            # Destination → Source
            # ==================================================

            return_flight = None

            if (
                data.get("return_date")
                and outbound_flight
            ):

                return_flight = (
                    FlightGenerator.generate(
                        source_airport=data[
                            "destination_airport"
                        ],

                        destination_airport=data[
                            "source_airport"
                        ],

                        cabin_class=data[
                            "cabin_class"
                        ],

                        departure_date=data[
                            "return_date"
                        ],
                    )
                )

            # ==================================================
            # ADD FLIGHT REASON
            # ==================================================

            if outbound_flight:

                outbound_flight[
                    "reason"
                ] = flight_reason

            if return_flight:

                return_flight[
                    "reason"
                ] = flight_reason

            # ==================================================
            # CALCULATE TOTAL FLIGHT PRICE
            #
            # OUTBOUND + RETURN
            # ==================================================

            flight_total = 0.0

            if outbound_flight:

                flight_total += float(
                    outbound_flight.get(
                        "price",
                        0,
                    )
                )

            if return_flight:

                flight_total += float(
                    return_flight.get(
                        "price",
                        0,
                    )
                )

            flight_total = round(
                flight_total,
                2,
            )

            # ==================================================
            # BUILD FINAL FLIGHT OBJECT
            # ==================================================

            result["flight"] = {
                "outbound": outbound_flight,

                "return": return_flight,

                "total_price": flight_total,

                "reason": flight_reason,
            }

            # ==================================================
            # UPDATE BUDGET
            # ==================================================

            if "budget" not in result:

                result["budget"] = {}

            budget = result["budget"]

            if not isinstance(
                budget,
                dict,
            ):
                budget = {}
                result["budget"] = budget

            # ==================================================
            # REPLACE AI FLIGHT ESTIMATE
            #
            # The actual generated flight prices are authoritative.
            # ==================================================

            budget["flight"] = flight_total

            # ==================================================
            # BUDGET CATEGORIES
            # ==================================================

            budget_categories = [
                "flight",
                "hotel",
                "food",
                "transport",
                "activities",
                "shopping",
            ]

            calculated_total = 0.0

            for category in budget_categories:

                value = budget.get(
                    category,
                    0,
                )

                try:

                    calculated_total += float(
                        value or 0
                    )

                except (
                    TypeError,
                    ValueError,
                ):

                    budget[category] = 0

            calculated_total = round(
                calculated_total,
                2,
            )

            # ==================================================
            # TOTAL
            # ==================================================

            budget["total"] = (
                calculated_total
            )

            # ==================================================
            # REMAINING
            # ==================================================

            try:

                user_budget = float(
                    data.get(
                        "budget",
                        0,
                    )
                    or 0
                )

            except (
                TypeError,
                ValueError,
            ):

                user_budget = 0.0

            budget["remaining"] = round(
                user_budget
                - calculated_total,
                2,
            )

            # ==================================================
            # DAILY AVERAGE
            # ==================================================

            try:

                departure_date = (
                    data.get(
                        "departure_date"
                    )
                )

                return_date = (
                    data.get(
                        "return_date"
                    )
                )

                if (
                    departure_date
                    and return_date
                ):

                    from datetime import (
                        date,
                        datetime,
                    )

                    departure = (
                        datetime.strptime(
                            str(
                                departure_date
                            )[:10],
                            "%Y-%m-%d",
                        ).date()
                    )

                    return_dt = (
                        datetime.strptime(
                            str(
                                return_date
                            )[:10],
                            "%Y-%m-%d",
                        ).date()
                    )

                    trip_days = (
                        return_dt
                        - departure
                    ).days + 1

                else:

                    trip_days = 1

                trip_days = max(
                    trip_days,
                    1,
                )

                budget["daily_average"] = (
                    round(
                        calculated_total
                        / trip_days,
                        2,
                    )
                )

            except Exception:

                budget[
                    "daily_average"
                ] = calculated_total

            # ==================================================
            # FINAL RESPONSE
            # ==================================================

            return {
                "success": True,
                "data": result,
            }

        # ======================================================
        # EXPECTED / GENERAL ERRORS
        # ======================================================

        except Exception as error:

            print(
                "=" * 70
            )

            print(
                "TRIP PLANNER ERROR"
            )

            print(
                repr(error)
            )

            print(
                "=" * 70
            )

            return {
                "success": False,
                "error": str(error),
            }