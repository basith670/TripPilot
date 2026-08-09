from datetime import datetime, timedelta

from django.db import transaction

from apps.flights.models import Airline, Flight
from apps.hotels.models import Hotel
from apps.travel.models import Airport
from apps.trips.models import (
    Activity,
    ItineraryDay,
    Trip,
)


class SaveTripService:

    @classmethod
    @transaction.atomic
    def save(
        cls,
        *,
        user,
        planner_data,
        ai_trip,
    ):
        # ---------------------------------------
        # Airports
        # ---------------------------------------

        source_airport = Airport.objects.get(
            iata_code=planner_data["source_airport"]
        )

        destination_airport = Airport.objects.get(
            iata_code=planner_data["destination_airport"]
        )

        # ---------------------------------------
        # Trip
        # ---------------------------------------

        summary = ai_trip["trip_summary"]

        trip = Trip.objects.create(
            user=user,

            source_airport=source_airport,
            destination_airport=destination_airport,

            departure_date=planner_data["departure_date"],
            return_date=planner_data["return_date"],

            title=summary["title"],
            overview=summary["overview"],

            adults=planner_data["adults"],
            children=planner_data["children"],
            infants=planner_data["infants"],
            seniors=planner_data["seniors"],

            cabin_class=planner_data["cabin_class"],

            budget=planner_data["budget"],
        )

        # ---------------------------------------
        # Flight data
        # ---------------------------------------

        flight_data = ai_trip["flight"]

        # ---------------------------------------
        # Airline
        # ---------------------------------------

        airline, _ = Airline.objects.get_or_create(
        code=flight_data.get(
            "airline_code",
            flight_data.get(
                "flight_code",
                flight_data["airline"][:5].upper(),
            ),
        ),
        )

        # ---------------------------------------
        # Flight
        # ---------------------------------------

        flight = Flight.objects.create(
            trip=trip,

            airline=airline,

            flight_type=Flight.FlightType.OUTBOUND,

            flight_number=flight_data["flight_number"],

            source_airport=source_airport,

            destination_airport=destination_airport,

            departure_datetime=datetime.fromisoformat(
                flight_data["departure_time"]
            ),

            arrival_datetime=datetime.fromisoformat(
                flight_data["arrival_time"]
            ),

            duration_minutes=cls._duration_to_minutes(
                flight_data["duration"]
            ),

            cabin_class=planner_data["cabin_class"],

            price=flight_data["price"],

            stops=flight_data["stops"],

            baggage_allowance=flight_data.get(
                "baggage",
                "",
            ),

            refundable=False,

            aircraft=flight_data.get(
                "aircraft",
                "",
            ),

            terminal=flight_data.get(
                "departure_terminal",
                "",
            ),

            gate="",

            booking_reference="",
        )

        # ---------------------------------------
        # Hotel
        # ---------------------------------------

        hotel_data = ai_trip["hotel"]

        guests = (
            planner_data["adults"]
            + planner_data["children"]
            + planner_data["infants"]
            + planner_data["seniors"]
        )

        hotel = Hotel.objects.create(
            trip=trip,

            name=hotel_data["name"],

            city=hotel_data["city"],

            country=hotel_data["country"],

            address=hotel_data["address"],

            rating=hotel_data["rating"],

            check_in=datetime.combine(
                planner_data["departure_date"],
                datetime.min.time(),
            ),

            check_out=datetime.combine(
                planner_data["return_date"],
                datetime.min.time(),
            ),

            room_type=hotel_data.get(
                "room_type",
                Hotel.RoomType.STANDARD,
            ).upper(),

            guests=guests,

            rooms=hotel_data.get(
                "rooms",
                1,
            ),

            price=hotel_data["total_price"],

            amenities=",".join(
                hotel_data["amenities"]
            ),

            breakfast_included=any(
                "breakfast" in amenity.lower()
                for amenity in hotel_data["amenities"]
            ),

            wifi_included=any(
                "wifi" in amenity.lower().replace("-", "")
                for amenity in hotel_data["amenities"]
            ),

            parking_available=False,

            booking_reference="",

            refundable=False,

            notes="\n\n".join(
                filter(
                    None,
                    [
                        hotel_data.get("description", ""),
                        hotel_data.get("reason", ""),
                    ],
                )
            ),
        )

        # ---------------------------------------
        # Attach selected flight/hotel to trip
        # ---------------------------------------

        trip.selected_flight = flight
        trip.selected_hotel = hotel

        trip.save(
            update_fields=[
                "selected_flight",
                "selected_hotel",
            ]
        )

        # ---------------------------------------
        # Itinerary
        # ---------------------------------------

        for day in ai_trip["itinerary"]:

            itinerary_day = ItineraryDay.objects.create(
                trip=trip,

                day_number=day["day"],

                date=planner_data["departure_date"]
                + timedelta(days=day["day"] - 1),

                title=day["title"],
            )

            for activity in day["activities"]:

                Activity.objects.create(
                    itinerary_day=itinerary_day,

                    title=activity["title"],

                    description=activity.get(
                        "description",
                        "",
                    ),

                    location=activity.get(
                        "location",
                        "",
                    ),

                    city=activity.get(
                        "city",
                        "",
                    ),

                    country=activity.get(
                        "country",
                        "",
                    ),

                    transport=activity.get(
                        "transport",
                        "",
                    ),

                    start_time=datetime.strptime(
                        activity["time"],
                        "%H:%M",
                    ).time(),

                    estimated_cost=activity.get(
                        "estimated_cost",
                        0,
                    ),

                    category=activity.get(
                        "category",
                        Activity.Category.ACTIVITIES,
                    ),

                    priority=activity.get(
                        "priority",
                        Activity.Priority.MEDIUM,
                    ),

                    notes="",
                )

        return trip

    @staticmethod
    def _duration_to_minutes(duration: str) -> int:
        duration = duration.lower().strip()

        hours = 0
        minutes = 0

        if "h" in duration:
            hours = int(
                duration.split("h")[0].strip()
            )

        if "m" in duration:
            minute_part = (
                duration.split("h")[-1]
                .replace("m", "")
                .strip()
            )

            if minute_part:
                minutes = int(minute_part)

        return hours * 60 + minutes